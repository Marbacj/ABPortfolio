"""
投资组合相关数据模型
"""
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date


class AssetAllocation(BaseModel):
    """单个资产配置"""

    symbol: str = Field(..., description="资产代码")
    name: str = Field(..., description="资产名称")
    category: str = Field(..., description="资产类别")
    current_weight: float = Field(..., description="当前权重")
    target_weight: float = Field(..., description="目标权重")
    current_value: float = Field(..., description="当前市值")
    deviation: float = Field(..., description="偏离度")


class PortfolioAllocation(BaseModel):
    """投资组合配置"""

    total_value: float = Field(..., description="组合总市值")
    assets: List[AssetAllocation] = Field(..., description="各资产配置详情")
    last_updated: str = Field(..., description="最后更新时间")


class PortfolioPerformance(BaseModel):
    """投资组合业绩"""

    start_date: date = Field(..., description="统计开始日期")
    end_date: date = Field(..., description="统计结束日期")
    total_return: float = Field(..., description="总收益率")
    cagr: float = Field(..., description="年化收益率")
    max_drawdown: float = Field(..., description="最大回撤")
    volatility: float = Field(..., description="年化波动率")
    sharpe_ratio: float = Field(..., description="夏普比率")
    nav_series: List[dict] = Field(..., description="净值序列")


class RebalanceAction(BaseModel):
    """单个再平衡操作"""

    symbol: str = Field(..., description="资产代码")
    action: str = Field(..., description="操作类型: buy/sell/hold")
    current_weight: float = Field(..., description="当前权重")
    target_weight: float = Field(..., description="目标权重")
    adjustment_pct: float = Field(..., description="调整百分比")


class RebalanceAdvice(BaseModel):
    """再平衡建议"""

    needs_rebalance: bool = Field(..., description="是否需要再平衡")
    threshold: float = Field(..., description="再平衡阈值")
    actions: List[RebalanceAction] = Field(..., description="具体操作建议")
    summary: str = Field(..., description="建议摘要")
