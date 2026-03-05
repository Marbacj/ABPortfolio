"""
用户交易与持仓 API 路由
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.core.database import get_db
from app.schemas.user import (
    TransactionCreate,
    TransactionResponse,
    HoldingResponse,
    UserPortfolioSummary,
)
from app.services.user_service import UserPortfolioService

router = APIRouter()


@router.post("/transaction", response_model=TransactionResponse)
async def create_transaction(
    tx: TransactionCreate, db: AsyncSession = Depends(get_db)
):
    """
    提交交易 (买入/卖出)
    """
    service = UserPortfolioService(db)
    try:
        return await service.create_transaction(tx)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/holdings", response_model=List[HoldingResponse])
async def get_holdings(db: AsyncSession = Depends(get_db)):
    """
    获取个人持仓详情
    """
    service = UserPortfolioService(db)
    try:
        return await service.get_holdings()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/transactions", response_model=List[TransactionResponse])
async def get_transactions(db: AsyncSession = Depends(get_db)):
    """
    获取交易历史
    """
    service = UserPortfolioService(db)
    try:
        return await service.get_transactions()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/summary", response_model=UserPortfolioSummary)
async def get_portfolio_summary(db: AsyncSession = Depends(get_db)):
    """
    获取资产概览 (总市值、总收益等)
    """
    service = UserPortfolioService(db)
    try:
        return await service.get_portfolio_summary()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
