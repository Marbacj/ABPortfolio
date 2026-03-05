"""
用户交易与持仓服务
"""
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, insert
from sqlalchemy.exc import NoResultFound
from decimal import Decimal
import logging

from app.models.user_portfolio import Transaction, Holding, TransactionType
from app.schemas.user import TransactionCreate, HoldingResponse, UserPortfolioSummary
from app.services.market_service import MarketDataService

logger = logging.getLogger(__name__)

class UserPortfolioService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.market_service = MarketDataService()

    async def create_transaction(self, tx_data: TransactionCreate) -> Transaction:
        """
        创建交易记录并更新持仓
        """
        # 1. 记录交易流水
        amount = Decimal(str(tx_data.quantity)) * Decimal(str(tx_data.price))
        
        new_tx = Transaction(
            symbol=tx_data.symbol,
            type=tx_data.type.value,
            quantity=tx_data.quantity,
            price=tx_data.price,
            amount=amount
        )
        self.db.add(new_tx)

        # 2. 更新持仓
        stmt = select(Holding).where(Holding.symbol == tx_data.symbol)
        result = await self.db.execute(stmt)
        holding = result.scalar_one_or_none()

        if holding is None:
            if tx_data.type == TransactionType.SELL:
                raise ValueError("Cannot sell asset not held")
            
            holding = Holding(
                symbol=tx_data.symbol,
                quantity=tx_data.quantity,
                average_cost=tx_data.price
            )
            self.db.add(holding)
        else:
            current_qty = holding.quantity
            current_cost = holding.average_cost
            tx_qty = Decimal(str(tx_data.quantity))
            tx_price = Decimal(str(tx_data.price))

            if tx_data.type == TransactionType.BUY:
                # 买入：更新平均成本
                # 新成本 = (旧数量 * 旧成本 + 新数量 * 新价格) / (旧数量 + 新数量)
                new_qty = current_qty + tx_qty
                new_cost = (current_qty * current_cost + tx_qty * tx_price) / new_qty
                
                holding.quantity = new_qty
                holding.average_cost = new_cost
            else:
                # 卖出：只更新数量，成本不变（先进先出或平均成本法下，卖出不改变剩余持仓的单位成本）
                if current_qty < tx_qty:
                    raise ValueError("Insufficient holdings")
                
                new_qty = current_qty - tx_qty
                holding.quantity = new_qty
                
                if new_qty == 0:
                    holding.average_cost = 0

        await self.db.commit()
        await self.db.refresh(new_tx)
        return new_tx

    async def get_holdings(self) -> List[HoldingResponse]:
        """
        获取当前持仓（包含实时市值）
        """
        result = await self.db.execute(select(Holding).where(Holding.quantity > 0))
        holdings = result.scalars().all()
        
        if not holdings:
            return []

        # 获取实时价格
        symbols = [h.symbol for h in holdings]
        quotes = await self.market_service.get_quotes(symbols)
        price_map = {q.symbol: q.price for q in quotes}

        response_list = []
        for h in holdings:
            current_price = price_map.get(h.symbol, 0)
            quantity = float(h.quantity)
            avg_cost = float(h.average_cost)
            
            market_value = quantity * current_price
            cost_value = quantity * avg_cost
            return_amount = market_value - cost_value
            return_percent = (return_amount / cost_value * 100) if cost_value > 0 else 0

            response_list.append(HoldingResponse(
                symbol=h.symbol,
                quantity=quantity,
                average_cost=avg_cost,
                current_price=current_price,
                market_value=round(market_value, 2),
                return_amount=round(return_amount, 2),
                return_percent=round(return_percent, 2)
            ))

        return response_list

    async def get_transactions(self) -> List[Transaction]:
        """
        获取交易历史
        """
        result = await self.db.execute(select(Transaction).order_by(Transaction.timestamp.desc()))
        return result.scalars().all()

    async def get_portfolio_summary(self) -> UserPortfolioSummary:
        """
        获取用户资产概览
        """
        holdings_list = await self.get_holdings()
        
        total_market_value = sum(h.market_value for h in holdings_list)
        total_cost = sum(h.quantity * h.average_cost for h in holdings_list)
        total_return = total_market_value - total_cost
        total_return_percent = (total_return / total_cost * 100) if total_cost > 0 else 0

        return UserPortfolioSummary(
            total_market_value=round(total_market_value, 2),
            total_cost=round(total_cost, 2),
            total_return=round(total_return, 2),
            total_return_percent=round(total_return_percent, 2),
            holdings=holdings_list
        )
