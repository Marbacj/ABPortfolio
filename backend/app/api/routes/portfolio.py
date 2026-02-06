"""
投资组合相关API路由
"""
from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from datetime import date, timedelta

from app.schemas.portfolio import (
    PortfolioPerformance,
    PortfolioAllocation,
    RebalanceAdvice,
)
from app.services.portfolio_service import PortfolioService

router = APIRouter()
portfolio_service = PortfolioService()


@router.get("/performance", response_model=PortfolioPerformance)
async def get_portfolio_performance(
    start_date: Optional[date] = Query(
        default=None, description="开始日期，默认为1年前"
    ),
    end_date: Optional[date] = Query(default=None, description="结束日期，默认为今天"),
):
    """
    获取投资组合业绩表现

    返回包含：
    - 总收益率
    - 年化收益率 (CAGR)
    - 最大回撤
    - 波动率
    - 夏普比率
    """
    if start_date is None:
        start_date = date.today() - timedelta(days=365)
    if end_date is None:
        end_date = date.today()

    try:
        performance = await portfolio_service.calculate_performance(start_date, end_date)
        return performance
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/allocation", response_model=PortfolioAllocation)
async def get_portfolio_allocation():
    """
    获取当前资产配置

    返回永久投资组合的四大资产类别及其当前市值占比
    """
    try:
        allocation = await portfolio_service.get_current_allocation()
        return allocation
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/rebalance", response_model=RebalanceAdvice)
async def get_rebalance_advice(
    threshold: float = Query(
        default=0.05, ge=0.01, le=0.20, description="再平衡阈值，默认5%"
    ),
):
    """
    获取再平衡建议

    当任一资产偏离目标配置超过阈值时，给出调整建议
    """
    try:
        advice = await portfolio_service.get_rebalance_advice(threshold)
        return advice
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
