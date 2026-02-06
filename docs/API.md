# API 文档

## 基础信息

- **Base URL**: `http://localhost:8000`
- **数据格式**: JSON
- **认证**: 无（当前版本）

## 接口列表

---

### 健康检查

检查服务是否正常运行。

**请求**

```
GET /health
```

**响应**

```json
{
  "status": "healthy",
  "version": "0.1.0"
}
```

---

## 投资组合接口

### 获取组合业绩

获取投资组合在指定时间段内的业绩表现。

**请求**

```
GET /api/portfolio/performance
```

**查询参数**

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| start_date | date | 否 | 开始日期，格式 YYYY-MM-DD，默认为 1 年前 |
| end_date | date | 否 | 结束日期，格式 YYYY-MM-DD，默认为今天 |

**响应**

```json
{
  "start_date": "2024-01-01",
  "end_date": "2025-01-01",
  "total_return": 8.52,
  "cagr": 8.52,
  "max_drawdown": -5.23,
  "volatility": 7.81,
  "sharpe_ratio": 0.58,
  "nav_series": [
    {"date": "2024-01-02", "nav": 1.0012},
    {"date": "2024-01-03", "nav": 1.0035}
  ]
}
```

**响应字段说明**

| 字段 | 类型 | 说明 |
|-----|------|------|
| total_return | float | 总收益率（%） |
| cagr | float | 年化收益率（%） |
| max_drawdown | float | 最大回撤（%），负数 |
| volatility | float | 年化波动率（%） |
| sharpe_ratio | float | 夏普比率 |
| nav_series | array | 净值序列 |

---

### 获取资产配置

获取当前各资产的配置详情。

**请求**

```
GET /api/portfolio/allocation
```

**响应**

```json
{
  "total_value": 100000.00,
  "assets": [
    {
      "symbol": "SPY",
      "name": "SPDR S&P 500 ETF",
      "category": "股票",
      "current_weight": 0.2523,
      "target_weight": 0.25,
      "current_value": 25230.00,
      "deviation": 0.0023
    }
  ],
  "last_updated": "2025-01-15T10:30:00"
}
```

**响应字段说明**

| 字段 | 类型 | 说明 |
|-----|------|------|
| total_value | float | 组合总市值 |
| assets | array | 各资产配置详情 |
| assets[].symbol | string | 资产代码 |
| assets[].name | string | 资产名称 |
| assets[].category | string | 资产类别 |
| assets[].current_weight | float | 当前权重 (0-1) |
| assets[].target_weight | float | 目标权重 (0-1) |
| assets[].current_value | float | 当前市值 |
| assets[].deviation | float | 偏离度 (current - target) |
| last_updated | string | 最后更新时间 |

---

### 获取再平衡建议

获取组合再平衡建议。

**请求**

```
GET /api/portfolio/rebalance
```

**查询参数**

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| threshold | float | 否 | 再平衡阈值，范围 0.01-0.20，默认 0.05 |

**响应**

```json
{
  "needs_rebalance": true,
  "threshold": 0.05,
  "actions": [
    {
      "symbol": "SPY",
      "action": "sell",
      "current_weight": 0.30,
      "target_weight": 0.25,
      "adjustment_pct": 5.0
    },
    {
      "symbol": "TLT",
      "action": "buy",
      "current_weight": 0.20,
      "target_weight": 0.25,
      "adjustment_pct": -5.0
    }
  ],
  "summary": "组合需要再平衡，有资产偏离目标配置超过5%"
}
```

**响应字段说明**

| 字段 | 类型 | 说明 |
|-----|------|------|
| needs_rebalance | boolean | 是否需要再平衡 |
| threshold | float | 再平衡阈值 |
| actions | array | 具体操作建议 |
| actions[].action | string | 操作类型: buy/sell/hold |
| actions[].adjustment_pct | float | 调整百分比 |
| summary | string | 建议摘要 |

---

## 市场数据接口

### 获取实时行情

获取指定资产的实时行情。

**请求**

```
GET /api/market/quote
```

**查询参数**

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| symbols | string | 否 | 资产代码，逗号分隔，如 SPY,TLT,GLD,SHV。不传返回默认组合 |

**响应**

```json
[
  {
    "symbol": "SPY",
    "name": "SPDR S&P 500 ETF",
    "price": 478.52,
    "change": 2.35,
    "change_percent": 0.49,
    "volume": 52341200,
    "market_cap": 438500000000,
    "timestamp": "2025-01-15T16:00:00"
  }
]
```

---

### 获取历史数据

获取指定时间段的历史 K 线数据。

**请求**

```
GET /api/market/history
```

**查询参数**

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| symbols | string | 否 | 资产代码，逗号分隔 |
| start_date | date | 否 | 开始日期，默认 1 年前 |
| end_date | date | 否 | 结束日期，默认今天 |

**响应**

```json
{
  "symbols": [
    {
      "symbol": "SPY",
      "data": [
        {
          "date": "2024-01-02",
          "open": 472.35,
          "high": 475.12,
          "low": 471.80,
          "close": 474.52,
          "volume": 48523100
        }
      ]
    }
  ],
  "start_date": "2024-01-01",
  "end_date": "2025-01-01"
}
```

---

### 获取券商链接

获取主流券商的交易页面链接。

**请求**

```
GET /api/market/broker-links
```

**响应**

```json
{
  "brokers": [
    {
      "name": "富途证券",
      "url": "https://www.futunn.com/trade",
      "region": "HK/US"
    },
    {
      "name": "老虎证券",
      "url": "https://www.tigerbrokers.com/market",
      "region": "US/HK/SG"
    }
  ]
}
```

---

## 错误响应

当请求发生错误时，API 返回统一格式的错误响应：

```json
{
  "detail": "错误信息描述"
}
```

**HTTP 状态码**

| 状态码 | 说明 |
|-------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 交互式文档

启动后端服务后，可访问以下地址查看交互式 API 文档：

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
