#!/bin/bash

echo "======================================"
echo "孕期指南 - 小红书内容提取服务"
echo "======================================"
echo ""

# 检查 Python
if ! command -v python3 &> /dev/null; then
    echo "❌ 未找到 Python3，请先安装 Python"
    exit 1
fi

echo "✓ Python3 已安装"

# 检查是否安装依赖
if [ ! -d "venv" ]; then
    echo ""
    echo "📦 首次运行，正在创建虚拟环境..."
    python3 -m venv venv
fi

# 激活虚拟环境
source venv/bin/activate

# 升级 pip
echo ""
echo "📦 升级 pip..."
pip install --upgrade pip -q

# 安装依赖
echo ""
echo "📦 安装依赖..."
pip install -r requirements.txt

# 安装 Playwright 浏览器
echo ""
echo "🌐 安装 Playwright 浏览器..."
playwright install chromium

echo ""
echo "======================================"
echo "✓ 服务准备完成"
echo "======================================"
echo ""
echo "💡 重要提示："
echo "1. 你需要提供小红书 Cookie 才能提取内容"
echo "2. 获取方式："
echo "   - 打开 https://www.xiaohongshu.com"
echo "   - 登录账号"
echo "   - 按 F12 打开开发者工具"
echo "   - 进入 Application -> Cookies"
echo "   - 复制 a1、web_session、webId 的值"
echo ""
echo "======================================"
echo "🚀 启动服务中..."
echo "======================================"
echo ""

# 启动服务
python xhs_api.py
