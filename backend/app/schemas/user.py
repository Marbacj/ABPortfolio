"""
用户交易与持仓相关数据模型
"""
from pydantic import BaseModel, Field, validator
from typing import List, Optional
from datetime import datetime
from app.models.user_portfolio import TransactionType


class TransactionCreate(BaseModel):
    """创建交易请求"""
    symbol: str = Field(..., description="资产代码")
    type: TransactionType = Field(..., description="交易类型: BUY/SELL")
    quantity: float = Field(..., gt=0, description="交易数量")
    price: float = Field(..., gt=0, description="成交单价")


class TransactionResponse(BaseModel):
    """交易响应"""
    id: int
    symbol: str
    type: str
    quantity: float
    price: float
    amount: float
    timestamp: datetime

    class Config:
        from_attributes = True


class HoldingResponse(BaseModel):
    """持仓响应"""
    symbol: str
    quantity: float
    average_cost: float
    current_price: Optional[float] = None
    market_value: Optional[float] = None
    return_amount: Optional[float] = None  # 浮动盈亏
    return_percent: Optional[float] = None # 收益率

    class Config:
        from_attributes = True


class UserPortfolioSummary(BaseModel):
    """用户资产概览"""
    total_market_value: float
    total_cost: float
    total_return: float
    total_return_percent: float
    holdings: List[HoldingResponse]
