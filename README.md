# 孕期指南 (Pregnancy Guide)

一个帮助准妈妈全面了解孕期知识、合理安排孕期生活的网站应用。

## 功能列表

| 页面 | 路由 | 功能说明 |
|------|------|----------|
| 首页仪表盘 | `/` | 孕期概览、进度、本周重点、待办事项 |
| 孕期时间轴 | `/timeline` | 日/周/月视图，胎儿发育、身体变化、产检、购物 |
| 购物清单 | `/shopping` | 分阶段购物清单管理 |
| 小红书导入 | `/import` | AI 提取小红书内容整合 |
| AI 生成 | `/ai-generate` | AI 自动生成孕周内容 |
| 设置 | `/settings` | 预产期设置等 |

## 技术栈

- **框架**: Next.js 14 (App Router)
- **UI**: Tailwind CSS
- **状态管理**: Zustand
- **图标**: Lucide React (SVG 图标)
- **AI**: Qwen-3-235B (cerebras-proxy)
- **设计规范**: UI/UX Pro Max Skill

## 配色方案 - 阳光宝贝

| 颜色名称 | 色值 | 用途 |
|----------|------|------|
| 珊瑚橙 | `#FF8A6B` | 主色 |
| 蜜桃粉 | `#FFB5A7` | 辅助色 |
| 薄荷绿 | `#7DD3C0` | 完成状态 |
| 阳光黄 | `#FFD97D` | 提醒强调 |
| 薰衣草紫 | `#C9B3FF` | 点缀色 |
| 奶油白 | `#FFF9F3` | 背景色 |

## UI/UX 规范 (基于 ui-ux-pro-max-skill)

- **字体**: ZCOOL KuaiLe (标题) + Nunito (正文) - 活泼温馨
- **图标**: 使用 Lucide React SVG 图标，不使用 emoji 作为功能图标
- **交互**: 所有可点击元素添加 `cursor-pointer`
- **动画**: hover 状态使用 150-300ms 过渡时间
- **可访问性**: 尊重 `prefers-reduced-motion` 用户偏好

## 开发

```bash
# 安装依赖
yarn install

# 启动开发服务器
yarn dev

# 构建
yarn build
```

## 目录结构

```
src/
├── app/                    # Next.js 页面
│   ├── page.tsx           # 首页
│   ├── timeline/          # 时间轴
│   ├── shopping/          # 购物清单
│   ├── import/            # 小红书导入
│   └── settings/          # 设置
├── components/            # 组件
│   └── layout/            # 布局组件
├── bloc/                  # 业务逻辑/状态管理
├── lib/                   # 工具库 (AI 接口等)
└── types/                 # 类型定义
```
