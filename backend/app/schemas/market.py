"""
市场数据相关模型
"""
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date


class QuoteResponse(BaseModel):
    """行情响应"""

    symbol: str = Field(..., description="股票代码")
    name: str = Field(..., description="股票名称")
    price: float = Field(..., description="当前价格")
    change: float = Field(..., description="涨跌额")
    change_percent: float = Field(..., description="涨跌幅")
    volume: Optional[int] = Field(None, description="成交量")
    market_cap: Optional[float] = Field(None, description="市值")
    timestamp: str = Field(..., description="数据时间")


class OHLCV(BaseModel):
    """K线数据"""

    date: str = Field(..., description="日期")
    open: float = Field(..., description="开盘价")
    high: float = Field(..., description="最高价")
    low: float = Field(..., description="最低价")
    close: float = Field(..., description="收盘价")
    volume: int = Field(..., description="成交量")


class SymbolHistory(BaseModel):
    """单个股票的历史数据"""

    symbol: str = Field(..., description="股票代码")
    data: List[OHLCV] = Field(..., description="K线数据列表")


class HistoricalData(BaseModel):
    """历史数据响应"""

    symbols: List[SymbolHistory] = Field(..., description="各股票历史数据")
    start_date: str = Field(..., description="开始日期")
    end_date: str = Field(..., description="结束日期")
