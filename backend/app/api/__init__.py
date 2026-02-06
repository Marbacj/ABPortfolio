"""
FastAPI Application Entry Point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.routes import portfolio, market

app = FastAPI(
    title="永久投资组合 API",
    description="Permanent Portfolio 监控与分析服务",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(portfolio.router, prefix="/api/portfolio", tags=["Portfolio"])
app.include_router(market.router, prefix="/api/market", tags=["Market"])


@app.get("/health")
async def health_check():
    """健康检查接口"""
    return {"status": "healthy", "version": "0.1.0"}
