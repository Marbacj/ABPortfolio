"""
永久投资组合后端服务入口
"""
import uvicorn
from app.core.config import settings

if __name__ == "__main__":
    uvicorn.run(
        "app.api:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
