# 小红书内容提取服务使用指南

## 🚀 快速启动

### 1. 安装依赖并启动服务

```bash
# 方式一：使用启动脚本（推荐）
cd services
./start.sh

# 方式二：手动启动
cd services
pip install -r requirements.txt
playwright install
python xhs_api.py
```

服务启动后，会在 `http://localhost:5005` 运行。

---

## 🔑 获取小红书 Cookie

**小红书内容提取需要 Cookie 才能工作**，获取步骤：

### 步骤 1: 登录小红书网页版
1. 打开浏览器，访问 https://www.xiaohongshu.com
2. 使用手机号登录你的小红书账号

### 步骤 2: 打开开发者工具
- Windows/Linux: 按 `F12` 或 `Ctrl + Shift + I`
- Mac: 按 `Cmd + Option + I`

### 步骤 3: 找到 Cookie
1. 点击开发者工具顶部的 **Application** 标签
2. 左侧展开 **Cookies**
3. 选择 `https://www.xiaohongshu.com`
4. 在右侧找到以下三个字段并复制它们的值：
   - `a1`
   - `web_session`
   - `webId`

### 步骤 4: 组合 Cookie
将三个值用分号连接，格式如下：

```
a1=你的a1值; web_session=你的web_session值; webId=你的webId值
```

示例：
```
a1=abc123def; web_session=xyz789uvw; webId=12345678
```

---

## 💻 在网站中使用

### 方式一：通过设置页面配置（推荐）

1. 启动 Python 服务（如上）
2. 启动 Next.js 前端：`yarn dev`
3. 打开网站设置页面
4. 找到"小红书 Cookie 配置"
5. 粘贴你的 Cookie
6. 点击"保存"

现在就可以使用快速导入功能了！

### 方式二：环境变量配置

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_XHS_API_URL=http://localhost:5005
NEXT_PUBLIC_XHS_COOKIE=你的cookie
```

---

## 🧪 测试服务

### 方法 1: 使用 curl

```bash
curl -X POST http://localhost:5005/extract \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.xiaohongshu.com/explore/693014ea000000001e02ea12",
    "cookie": "你的cookie"
  }'
```

### 方法 2: 使用浏览器

访问 http://localhost:5005/health 查看服务状态。

---

## ⚠️ 常见问题

### Q1: 提示 "xhs 库未安装"
**解决方案：**
```bash
cd services
pip install -r requirements.txt
```

### Q2: 提示 "Cookie 失效"
**原因：** Cookie 有时效性，可能几天后就失效了。

**解决方案：**
1. 重新登录小红书网页版
2. 按上述步骤重新获取 Cookie
3. 更新配置

### Q3: 提示 "Python API 服务未启动"
**解决方案：**
1. 确保 Python 服务正在运行
2. 检查端口 5005 是否被占用
3. 查看终端是否有错误信息

### Q4: 提取内容为空
**可能原因：**
1. Cookie 不正确或已失效
2. 笔记需要登录才能查看
3. 笔记已被删除

**解决方案：**
1. 检查 Cookie 是否正确
2. 尝试在浏览器中打开链接确认笔记存在
3. 使用"手动输入"功能作为备选

---

## 🔒 隐私说明

- Cookie 仅用于提取小红书内容
- Cookie 存储在本地，不会上传到服务器
- 建议使用小号的 Cookie，避免主账号风险

---

## 📚 技术细节

### API 接口

#### `POST /extract`
提取小红书笔记内容

**请求体：**
```json
{
  "url": "小红书链接",
  "cookie": "你的cookie（可选，但建议提供）"
}
```

**响应：**
```json
{
  "success": true,
  "data": {
    "title": "笔记标题",
    "content": "笔记正文",
    "images": ["图片URL数组"],
    "author": "作者昵称",
    "authorAvatar": "作者头像URL",
    "likes": 点赞数,
    "tags": ["标签数组"]
  }
}
```

#### `GET /health`
健康检查

**响应：**
```json
{
  "status": "ok",
  "xhs_available": true
}
```

---

## 🎯 下一步

1. ✅ 启动 Python 服务
2. ✅ 获取并配置 Cookie
3. ✅ 启动前端：`yarn dev`
4. ✅ 测试导入功能

有问题随时查看日志或提问！
