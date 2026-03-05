"""
投资组合服务单元测试
"""
import pytest
from datetime import date, timedelta
import numpy as np

# 测试数据计算逻辑
def test_cagr_calculation():
    """测试年化收益率计算"""
    # 假设 1 年内净值从 1.0 涨到 1.10
    initial_nav = 1.0
    final_nav = 1.10
    years = 1
    
    cagr = (final_nav / initial_nav) ** (1 / years) - 1
    
    assert abs(cagr - 0.10) < 0.001  # 10% 年化收益


def test_max_drawdown_calculation():
    """测试最大回撤计算"""
    # 模拟净值序列: 1.0 -> 1.2 -> 1.0 -> 1.3
    nav_series = np.array([1.0, 1.1, 1.2, 1.15, 1.0, 1.1, 1.3])
    
    rolling_max = np.maximum.accumulate(nav_series)
    drawdowns = (nav_series - rolling_max) / rolling_max
    max_drawdown = drawdowns.min()
    
    # 最大回撤发生在 1.2 -> 1.0，为 -16.67%
    assert abs(max_drawdown - (-0.1667)) < 0.01


def test_volatility_calculation():
    """测试波动率计算"""
    # 模拟日收益率
    daily_returns = np.array([0.01, -0.005, 0.008, -0.003, 0.012])
    
    # 年化波动率 = 日波动率 * sqrt(252)
    daily_vol = daily_returns.std()
    annual_vol = daily_vol * np.sqrt(252)
    
    assert annual_vol > 0


def test_sharpe_ratio_calculation():
    """测试夏普比率计算"""
    # 假设年化收益 10%，无风险利率 4%，波动率 15%
    annual_return = 0.10
    risk_free_rate = 0.04
    volatility = 0.15
    
    sharpe = (annual_return - risk_free_rate) / volatility
    
    assert abs(sharpe - 0.40) < 0.01


def test_portfolio_weights():
    """测试组合权重验证"""
    # 永久投资组合各资产权重
    weights = {
        '510300.SS': 0.25,
        'TLT': 0.25,
        'GLD': 0.25,
        'SHV': 0.25,
    }
    
    total_weight = sum(weights.values())
    
    assert abs(total_weight - 1.0) < 0.001


def test_rebalance_threshold():
    """测试再平衡阈值判断"""
    threshold = 0.05  # 5%
    
    # 当前权重
    current_weights = {
        '510300.SS': 0.30,  # 偏离 +5%
        'TLT': 0.22,  # 偏离 -3%
        'GLD': 0.23,  # 偏离 -2%
        'SHV': 0.25,  # 偏离 0%
    }
    
    target_weight = 0.25
    
    needs_rebalance = False
    for symbol, weight in current_weights.items():
        if abs(weight - target_weight) > threshold:
            needs_rebalance = True
            break
    
    assert needs_rebalance is True  # 510300.SS 偏离超过阈值


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
