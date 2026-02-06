#!/bin/bash
set -e

# 创建虚拟环境
if [ ! -d "venv" ]; then
    echo "创建虚拟环境..."
    python3 -m venv venv
fi

# 激活虚拟环境并升级 pip
echo "升级 pip..."
./venv/bin/pip install --upgrade pip

# 安装依赖
echo "安装项目依赖..."
./venv/bin/pip install -e .

echo "安装完成！"
echo "请运行 'source backend/venv/bin/activate' 来激活环境。"
