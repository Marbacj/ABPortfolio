"""
投资组合服务 - 计算收益、回撤等指标
"""
import numpy as np
import pandas as pd
from typing import List
from datetime import date, datetime

from app.schemas.portfolio import (
    PortfolioPerformance,
    PortfolioAllocation,
    AssetAllocation,
    RebalanceAdvice,
    RebalanceAction,
)
from app.services.market_service import MarketDataService
from app.core.config import settings


class PortfolioService:
    """投资组合服务"""

    def __init__(self):
        self.market_service = MarketDataService()
        self.asset_config = settings.PORTFOLIO_ASSETS
        self.symbols = list(self.asset_config.keys())

    async def calculate_performance(
        self, start_date: date, end_date: date
    ) -> PortfolioPerformance:
        """
        计算组合业绩

        使用等权重（各25%）的永久投资组合策略
        """
        # 获取价格数据
        prices = await self.market_service.get_price_dataframe(
            self.symbols, start_date, end_date
        )

        if prices.empty:
            raise ValueError("无法获取价格数据")

        # 计算日收益率
        returns = prices.pct_change().dropna()

        # 等权重组合收益
        weights = np.array([self.asset_config[s]["target_weight"] for s in self.symbols])
        portfolio_returns = (returns * weights).sum(axis=1)

        # 累计净值
        cumulative = (1 + portfolio_returns).cumprod()
        nav_series = [
            {"date": idx.strftime("%Y-%m-%d"), "nav": round(val, 4)}
            for idx, val in cumulative.items()
        ]

        # 总收益率
        total_return = cumulative.iloc[-1] - 1

        # 年化收益率 (CAGR)
        days = (end_date - start_date).days
        years = days / 365.25
        cagr = (cumulative.iloc[-1] ** (1 / years)) - 1 if years > 0 else 0

        # 最大回撤
        rolling_max = cumulative.cummax()
        drawdown = (cumulative - rolling_max) / rolling_max
        max_drawdown = drawdown.min()

        # 年化波动率
        volatility = portfolio_returns.std() * np.sqrt(252)

        # 夏普比率 (假设无风险利率为 4%)
        risk_free_rate = 0.04
        excess_return = cagr - risk_free_rate
        sharpe_ratio = excess_return / volatility if volatility > 0 else 0

        return PortfolioPerformance(
            start_date=start_date,
            end_date=end_date,
            total_return=round(total_return * 100, 2),
            cagr=round(cagr * 100, 2),
            max_drawdown=round(max_drawdown * 100, 2),
            volatility=round(volatility * 100, 2),
            sharpe_ratio=round(sharpe_ratio, 2),
            nav_series=nav_series,
        )

    async def get_current_allocation(self) -> PortfolioAllocation:
        """
        获取当前资产配置

        基于最新价格计算各资产的市值占比
        """
        quotes = await self.market_service.get_quotes(self.symbols)

        # 假设初始投资为 $100,000，等权分配
        initial_investment = 100000
        initial_per_asset = initial_investment / len(self.symbols)

        total_value = 0
        assets = []

        for quote in quotes:
            symbol = quote.symbol
            config = self.asset_config.get(symbol, {})
            target_weight = config.get("target_weight", 0.25)

            # 简化计算：假设以当前价格持有固定市值
            current_value = initial_per_asset  # 实际应用中应从数据库读取持仓
            total_value += current_value

        # 计算权重
        for quote in quotes:
            symbol = quote.symbol
            config = self.asset_config.get(symbol, {})
            target_weight = config.get("target_weight", 0.25)
            current_value = initial_per_asset

            current_weight = current_value / total_value if total_value > 0 else 0
            deviation = current_weight - target_weight

            assets.append(
                AssetAllocation(
                    symbol=symbol,
                    name=config.get("name", symbol),
                    category=config.get("category", "未分类"),
                    current_weight=round(current_weight, 4),
                    target_weight=target_weight,
                    current_value=round(current_value, 2),
                    deviation=round(deviation, 4),
                )
            )

        return PortfolioAllocation(
            total_value=round(total_value, 2),
            assets=assets,
            last_updated=datetime.now().isoformat(),
        )

    async def get_rebalance_advice(self, threshold: float) -> RebalanceAdvice:
        """
        获取再平衡建议
        """
        allocation = await self.get_current_allocation()

        actions = []
        needs_rebalance = False

        for asset in allocation.assets:
            deviation = asset.deviation

            if abs(deviation) > threshold:
                needs_rebalance = True
                if deviation > 0:
                    action = "sell"
                else:
                    action = "buy"
            else:
                action = "hold"

            actions.append(
                RebalanceAction(
                    symbol=asset.symbol,
                    action=action,
                    current_weight=asset.current_weight,
                    target_weight=asset.target_weight,
                    adjustment_pct=round(deviation * 100, 2),
                )
            )

        if needs_rebalance:
            summary = f"组合需要再平衡，有资产偏离目标配置超过{threshold*100:.0f}%"
        else:
            summary = f"组合配置良好，所有资产偏离度均在{threshold*100:.0f}%以内"

        return RebalanceAdvice(
            needs_rebalance=needs_rebalance,
            threshold=threshold,
            actions=actions,
            summary=summary,
        )
