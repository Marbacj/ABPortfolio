# 永久投资组合 (Permanent Portfolio)

一个基于 Web 的永久投资组合监控与评估平台，帮助投资者追踪经典的低波动稳健投资策略。

## 项目概述

永久投资组合是由 Harry Browne 于 1980 年代提出的投资策略，将资产等分配置于四大类别：

| 资产类别 | 代表ETF | 目标配比 | 适应场景 |
|---------|--------|---------|---------|
| 股票 | SPY | 25% | 经济繁荣 |
| 长期国债 | TLT | 25% | 经济衰退/通缩 |
| 黄金 | GLD | 25% | 高通胀 |
| 现金等价物 | SHV | 25% | 紧缩/危机 |

## 功能特性

- **组合业绩监控**：实时计算总收益率、年化收益(CAGR)、最大回撤、波动率、夏普比率
- **资产配置可视化**：饼图展示当前各资产权重分布
- **净值走势图**：交互式图表展示历史净值变化
- **实时行情**：显示四大资产的最新价格与涨跌幅
- **再平衡建议**：当资产偏离目标配置超过阈值时给出调整建议
- **券商跳转**：一键跳转至主流券商进行交易

## 技术栈

### 后端
- **框架**: FastAPI (Python 3.10+)
- **数据源**: yfinance (Yahoo Finance API)
- **数据处理**: Pandas, NumPy
- **数据验证**: Pydantic

### 前端
- **框架**: Next.js 14 (React 18)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **图表**: Recharts
- **图标**: Lucide React

### 部署
- 本地开发运行（后端 + 前端）

## 快速开始

### 前置要求

- Python 3.10+
- Node.js 18+
- pnpm / npm / yarn

### 后端启动

```bash
cd backend

# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install -e .

# 启动服务
python main.py
# 或
uvicorn app.api:app --reload
```

后端服务将运行在 http://localhost:8000

API 文档: http://localhost:8000/docs

### 前端启动

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端应用将运行在 http://localhost:3000

## 项目结构

```
ABPortfolio/
├── backend/                # 后端服务
│   ├── app/
│   │   ├── api/            # API 路由
│   │   ├── core/           # 核心配置
│   │   ├── services/       # 业务逻辑
│   │   ├── schemas/        # 数据模型
│   │   ├── models/         # 数据库模型
│   │   └── utils/          # 工具函数
│   ├── tests/              # 单元测试
│   ├── pyproject.toml      # Python 依赖
│   └── main.py             # 入口文件
├── frontend/               # 前端应用
│   ├── src/
│   │   ├── app/            # Next.js 页面
│   │   ├── components/     # UI 组件
│   │   ├── hooks/          # React Hooks
│   │   ├── lib/            # 工具库
│   │   └── types/          # 类型定义
│   ├── package.json
│   └── tsconfig.json
├── docs/                   # 项目文档
└── README.md
```

## API 接口

### 投资组合

| 接口 | 方法 | 描述 |
|-----|------|------|
| `/api/portfolio/performance` | GET | 获取组合业绩 |
| `/api/portfolio/allocation` | GET | 获取资产配置 |
| `/api/portfolio/rebalance` | GET | 获取再平衡建议 |

### 市场数据

| 接口 | 方法 | 描述 |
|-----|------|------|
| `/api/market/quote` | GET | 获取实时行情 |
| `/api/market/history` | GET | 获取历史K线 |
| `/api/market/broker-links` | GET | 获取券商链接 |

## 配置说明

### 环境变量

复制 `backend/.env.example` 为 `backend/.env` 并配置：

```env
DEBUG=true
HOST=0.0.0.0
PORT=8000
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/abportfolio
REDIS_URL=redis://localhost:6379/0
```

前端环境变量 (`frontend/.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 注意事项

1. **数据延迟**: Yahoo Finance 数据存在约 15 分钟延迟
2. **免责声明**: 本平台仅供参考，不构成投资建议
3. **交易功能**: 不提供直接交易，仅提供券商跳转链接

## License

MIT
