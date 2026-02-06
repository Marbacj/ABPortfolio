.PHONY: install start-infra stop-infra start-backend start-frontend dev

# 初始化项目（安装所有依赖）
install:
	@echo "安装后端依赖..."
	cd backend && chmod +x setup_dev.sh && ./setup_dev.sh
	@echo "安装前端依赖..."
	cd frontend && npm install

# 启动基础设施（数据库和Redis）
start-infra:
	@echo "启动 Docker 容器 (Postgres & Redis)..."
	docker-compose -f deploy/docker-compose.yml up -d db redis

# 停止基础设施
stop-infra:
	docker-compose -f deploy/docker-compose.yml down

# 启动后端（开发模式）
start-backend:
	@echo "启动后端服务..."
	cd backend && source venv/bin/activate && python main.py

# 启动前端（开发模式）
start-frontend:
	@echo "启动前端服务..."
	cd frontend && npm run dev

# 一键启动开发环境（需要安装 make 和 tmux 或者手动分窗口）
# 这里只打印提示，因为同时运行两个前台进程比较复杂
dev:
	@echo "请在三个不同的终端窗口中分别运行以下命令："
	@echo "1. make start-infra"
	@echo "2. make start-backend"
	@echo "3. make start-frontend"
