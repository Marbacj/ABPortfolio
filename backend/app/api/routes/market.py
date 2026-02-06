"""
市场数据相关API路由
"""
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from datetime import date, timedelta

from app.schemas.market import QuoteResponse, HistoricalData
from app.services.market_service import MarketDataService

router = APIRouter()
market_service = MarketDataService()

# 永久投资组合默认资产
DEFAULT_SYMBOLS = ["SPY", "TLT", "GLD", "SHV"]


@router.get("/quote", response_model=List[QuoteResponse])
async def get_quotes(
    symbols: Optional[str] = Query(
        default=None,
        description="股票代码，逗号分隔，如 SPY,TLT,GLD,SHV。不传则返回默认组合",
    ),
):
    """
    获取实时行情（延迟约15分钟）

    返回指定资产的最新价格、涨跌幅等信息
    """
    symbol_list = symbols.split(",") if symbols else DEFAULT_SYMBOLS

    try:
        quotes = await market_service.get_quotes(symbol_list)
        return quotes
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history", response_model=HistoricalData)
async def get_historical_data(
    symbols: Optional[str] = Query(
        default=None, description="股票代码，逗号分隔"
    ),
    start_date: Optional[date] = Query(
        default=None, description="开始日期，默认为1年前"
    ),
    end_date: Optional[date] = Query(default=None, description="结束日期，默认为今天"),
):
    """
    获取历史K线数据

    返回指定时间范围内的日K线数据
    """
    symbol_list = symbols.split(",") if symbols else DEFAULT_SYMBOLS

    if start_date is None:
        start_date = date.today() - timedelta(days=365)
    if end_date is None:
        end_date = date.today()

    try:
        history = await market_service.get_historical_data(
            symbol_list, start_date, end_date
        )
        return history
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/broker-links")
async def get_broker_links():
    """
    获取券商交易链接

    返回主流券商的Web交易页面链接，用于跳转交易
    """
    return {
        "brokers": [
            {
                "name": "富途证券",
                "url": "https://www.futunn.com/trade",
                "region": "HK/US",
            },
            {
                "name": "老虎证券",
                "url": "https://www.tigerbrokers.com/market",
                "region": "US/HK/SG",
            },
            {
                "name": "盈透证券",
                "url": "https://www.interactivebrokers.com/en/trading/trading-platform.php",
                "region": "Global",
            },
            {
                "name": "Robinhood",
                "url": "https://robinhood.com/stocks",
                "region": "US",
            },
            {
                "name": "雪盈证券",
                "url": "https://www.snowballsecurities.com/trade",
                "region": "US/HK",
            },
        ]
    }
