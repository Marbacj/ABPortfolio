"""
应用配置
"""
from typing import List
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """应用配置类"""

    # 应用配置
    APP_NAME: str = "ABPortfolio"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # 数据库配置
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@127.0.0.1:5432/abportfolio"

    # Redis配置
    REDIS_URL: str = "redis://127.0.0.1:6379/0"
    CACHE_TTL: int = 300  # 缓存过期时间（秒）

    # CORS配置
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    # 永久投资组合配置（中国版默认组合）
    PORTFOLIO_ASSETS: dict = {
        "510300.SS": {"name": "沪深300ETF", "category": "股票", "target_weight": 0.25},
        "511010.SS": {
            "name": "国债ETF",
            "category": "长期国债",
            "target_weight": 0.25,
        },
        "518880.SS": {"name": "黄金ETF", "category": "黄金", "target_weight": 0.25},
        "511990.SS": {
            "name": "货币ETF",
            "category": "现金等价物",
            "target_weight": 0.25,
        },
    }

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
