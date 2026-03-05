"""
User Portfolio Database Models
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, Enum, DECIMAL
from datetime import datetime
import enum
from app.core.database import Base


class TransactionType(str, enum.Enum):
    BUY = "BUY"
    SELL = "SELL"


class Transaction(Base):
    """交易流水表"""
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String(10), nullable=False, index=True)
    type = Column(String(10), nullable=False)  # BUY / SELL
    quantity = Column(DECIMAL(10, 4), nullable=False)
    price = Column(DECIMAL(10, 2), nullable=False)
    amount = Column(DECIMAL(12, 2), nullable=False)
    timestamp = Column(DateTime, default=datetime.now)


class Holding(Base):
    """当前持仓表"""
    __tablename__ = "holdings"

    symbol = Column(String(10), primary_key=True, index=True)
    quantity = Column(DECIMAL(10, 4), nullable=False, default=0)
    average_cost = Column(DECIMAL(10, 2), nullable=False, default=0)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
