"""
市场数据服务 - 使用 yfinance 获取金融数据
"""
import yfinance as yf
from typing import List
from datetime import date, datetime
import pandas as pd

from app.schemas.market import QuoteResponse, HistoricalData, SymbolHistory, OHLCV
from app.core.config import settings


class MarketDataService:
    """市场数据服务"""

    def __init__(self):
        self.asset_config = settings.PORTFOLIO_ASSETS

    async def get_quotes(self, symbols: List[str]) -> List[QuoteResponse]:
        """
        获取实时行情
        """
        quotes = []
        for symbol in symbols:
            try:
                ticker = yf.Ticker(symbol)
                info = ticker.info
                hist = ticker.history(period="2d")

                if len(hist) >= 1:
                    current_price = hist["Close"].iloc[-1]
                    if len(hist) >= 2:
                        prev_close = hist["Close"].iloc[-2]
                    else:
                        prev_close = current_price

                    change = current_price - prev_close
                    change_pct = (change / prev_close) * 100 if prev_close > 0 else 0

                    asset_info = self.asset_config.get(symbol, {})
                    name = asset_info.get("name", info.get("shortName", symbol))

                    quotes.append(
                        QuoteResponse(
                            symbol=symbol,
                            name=name,
                            price=round(current_price, 2),
                            change=round(change, 2),
                            change_percent=round(change_pct, 2),
                            volume=int(hist["Volume"].iloc[-1]) if "Volume" in hist else None,
                            market_cap=info.get("marketCap"),
                            timestamp=datetime.now().isoformat(),
                        )
                    )
            except Exception as e:
                # 如果获取失败，返回占位数据
                quotes.append(
                    QuoteResponse(
                        symbol=symbol,
                        name=symbol,
                        price=0.0,
                        change=0.0,
                        change_percent=0.0,
                        timestamp=datetime.now().isoformat(),
                    )
                )

        return quotes

    async def get_historical_data(
        self, symbols: List[str], start_date: date, end_date: date
    ) -> HistoricalData:
        """
        获取历史K线数据
        """
        result_symbols = []

        for symbol in symbols:
            try:
                ticker = yf.Ticker(symbol)
                hist = ticker.history(start=start_date, end=end_date)

                ohlcv_list = []
                for idx, row in hist.iterrows():
                    ohlcv_list.append(
                        OHLCV(
                            date=idx.strftime("%Y-%m-%d"),
                            open=round(row["Open"], 2),
                            high=round(row["High"], 2),
                            low=round(row["Low"], 2),
                            close=round(row["Close"], 2),
                            volume=int(row["Volume"]),
                        )
                    )

                result_symbols.append(
                    SymbolHistory(symbol=symbol, data=ohlcv_list)
                )
            except Exception as e:
                result_symbols.append(SymbolHistory(symbol=symbol, data=[]))

        return HistoricalData(
            symbols=result_symbols,
            start_date=start_date.isoformat(),
            end_date=end_date.isoformat(),
        )

    async def get_price_dataframe(
        self, symbols: List[str], start_date: date, end_date: date
    ) -> pd.DataFrame:
        """
        获取价格 DataFrame，用于组合计算
        """
        data = yf.download(
            symbols,
            start=start_date,
            end=end_date,
            progress=False,
        )

        # 提取调整后收盘价
        if len(symbols) == 1:
            prices = data["Close"].to_frame(name=symbols[0])
        else:
            prices = data["Close"]

        return prices
