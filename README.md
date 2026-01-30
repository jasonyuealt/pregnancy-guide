# 孕期指南 (Pregnancy Guide)

从小红书收集孕期知识，AI 智能分析整理，按孕周归纳展示

## 🎯 核心功能

| 页面 | 路由 | 说明 |
|------|------|------|
| 首页 | `/` | 当前孕周知识总览、收藏统计、重点提醒 |
| 知识库 | `/knowledge` | 按孕周展示 AI 聚合的结构化知识 |
| 我的收藏 | `/collection` | 所有导入的小红书笔记（瀑布流展示） |
| 购物清单 | `/shopping` | 从笔记中提取的待购物品 |
| 设置 | `/settings` | 末次月经/预产期设置 |

## ✨ 特色功能

### 1. **快速导入小红书内容**
- 右下角悬浮按钮，随时粘贴小红书分享链接
- 使用 Playwright 自动提取标题、正文、图片、作者等信息
- 支持多种小红书链接格式

### 2. **AI 智能分析**
- 自动识别内容适用的孕周（如：第24周、25周、26周）
- 智能分类：营养/产检/运动/物品/症状/经验
- 提取关键知识点、注意事项、推荐产品

### 3. **知识聚合展示**
- 同类内容自动聚合，避免信息凌乱
- 按孕周组织，快速找到"我现在第X周该做什么"
- 显示来源笔记数量，可点击查看原文

### 4. **实时更新**
- 每次导入新笔记，自动触发知识聚合
- 首页实时展示当前孕周的重点内容
- 购物清单自动从产品类笔记中提取

## 🔧 技术栈

- **前端框架**: Next.js 14 (App Router)
- **UI 样式**: Tailwind CSS（温馨母婴风格）
- **状态管理**: Zustand（localStorage 持久化）
- **图标库**: Lucide React
- **AI 模型**: Qwen-3-235B（智能分析）
- **内容提取**: Python Playwright + Flask API

## 🎨 设计系统 - 温馨母婴风格

| 颜色 | 色值 | 用途 |
|------|------|------|
| 奶油粉 | `#FFB5C2` | 主色（强调/按钮） |
| 蜜桃色 | `#FFD4BC` | 辅助（渐变/标签） |
| 奶油米 | `#FFF5E9` | 背景 |
| 薄荷绿 | `#B8D4C0` | 成功状态 |
| 温暖黄 | `#FFD89C` | 提醒/警告 |
| 天空蓝 | `#C5DBEB` | 信息提示 |

**设计特点：**
- 柔和圆润的圆角（16-24px）
- 多层次柔和阴影
- 温暖的中性色文字
- 流畅的过渡动画

## 📁 目录结构

```
src/
├── app/                        # 页面（简化为4个）
│   ├── page.tsx               # 首页 - Feed 流
│   ├── content/               # 我的内容（合并 collection + knowledge）
│   ├── shopping/              # 购物清单
│   ├── settings/              # 设置
│   └── layout.tsx             # 根布局
│
├── components/
│   ├── layout/                # 布局组件
│   │   ├── Sidebar.tsx        # 侧边栏（简化为4项）
│   │   └── MobileNav.tsx      # 移动端导航
│   ├── feed/                  # Feed 流组件（新）
│   │   ├── WeekProgress.tsx   # 孕周进度卡片
│   │   ├── ContentCard.tsx    # 内容卡片
│   │   └── CategorySection.tsx # 类别区块
│   └── common/
│       ├── QuickImport.tsx    # 快速导入
│       └── DatePicker.tsx     # 日期选择器
│
├── bloc/
│   └── app.bloc.ts            # 全局状态管理
│
├── lib/
│   ├── ai.ts                  # AI 分析接口
│   ├── xhs-extractor.ts       # 小红书内容提取
│   └── mcp-client.ts          # MCP 客户端
│
└── types/
    └── index.ts               # TypeScript 类型定义
```

## 🚀 快速开始

### 1. 安装前端依赖

```bash
yarn install
```

### 2. 启动 Python 服务（小红书内容提取）

```bash
cd services
./start.sh
```

服务会在 `http://localhost:5005` 启动。

首次运行会自动安装 Python 依赖和 Playwright 浏览器。

### 3. 启动开发服务器

```bash
yarn dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 4. 配置小红书 Cookie

进入「设置」页面，按照提示获取并配置小红书 Cookie。

详细步骤请查看 [services/README.md](services/README.md)

## 📖 使用指南

### 1. 设置预产期/末次月经

首次使用请进入"设置"页面，输入：
- **末次月经日期**（推荐，更准确）
- 或 **预产期**

系统会根据中国标准计算孕周（显示格式：孕X+Y）

### 2. 导入小红书笔记

1. 在小红书 APP 中找到想要收藏的笔记
2. 点击分享按钮，复制链接
3. 点击网站右下角的 ➕ 按钮
4. 粘贴链接，点击"开始导入"

**AI 会自动：**
- 提取笔记内容
- 分析适用孕周和类别
- 提取关键知识点
- 聚合到对应孕周的知识库

### 3. 浏览知识库

进入"知识库"页面，可以：
- 按阶段筛选（孕早期/中期/晚期）
- 展开具体孕周查看聚合内容
- 点击"查看原文"回溯来源笔记

### 4. 管理收藏

进入"我的收藏"页面，可以：
- 按分类筛选笔记
- 搜索标题、内容、作者
- 收藏/删除笔记
- 点击卡片查看原文

## 🏗️ 核心工作流

```
用户粘贴小红书链接
  ↓
Playwright 提取内容（标题、正文、图片、作者）
  ↓
AI 分析内容
  ├─ 识别适用孕周: [24, 25, 26]
  ├─ 智能分类: 营养/产检/运动/物品/症状/经验
  ├─ 提取关键知识点
  ├─ 识别推荐产品
  └─ 提取注意事项
  ↓
保存到 xhsNotes 数组
  ↓
触发知识聚合（实时）
  ├─ 按孕周分组笔记
  ├─ 按类别聚合知识点
  ├─ 生成 WeekKnowledge
  └─ 提取产品到购物清单
  ↓
更新 UI 展示
```

## 🔧 技术细节

### 小红书内容提取

使用 Python xhs 库 + Flask API：

```bash
# 启动 Python 服务
cd services
./start.sh
```

前端调用：

```typescript
// 调用 Python API
const result = await extractXhsContent(url, cookie);
```

**流程：**
1. 用户在设置页面配置 Cookie
2. 点击快速导入，粘贴小红书链接
3. 前端调用 Python Flask API
4. Python 使用 xhs 库提取内容
5. 返回结构化数据给前端

### AI 分析流程

使用 Qwen-3-235B 模型分析内容：

```typescript
const aiAnalysis = await analyzeXhsContent(title, content, tags);

// 返回结构化数据:
{
  weeks: [24, 25, 26],
  category: 'nutrition',
  keyPoints: ['每天补充DHA 200-300mg', '控制糖分摄入'],
  products: ['DHA补充剂', '孕妇枕'],
  warnings: ['糖耐前一晚需禁食8小时'],
  relatedTags: ['DHA', '糖耐', '孕中期营养']
}
```

### 知识聚合算法

```typescript
// 当新笔记添加时，自动触发聚合
function aggregateWeekKnowledge(week: number) {
  // 1. 获取该周所有笔记
  const weekNotes = xhsNotes.filter(n => 
    n.aiAnalysis.weeks.includes(week)
  );
  
  // 2. 按类别分组
  const byCategory = {
    nutrition: weekNotes.filter(n => n.aiAnalysis.category === 'nutrition'),
    checkup: weekNotes.filter(n => n.aiAnalysis.category === 'checkup'),
    // ...
  };
  
  // 3. 聚合知识点（去重）
  const nutritionSummary = {
    content: [...new Set(byCategory.nutrition.flatMap(n => n.aiAnalysis.keyPoints))],
    sourceNotes: byCategory.nutrition.map(n => n.id),
  };
  
  // 4. 生成 WeekKnowledge
  updateWeekKnowledge(week, { nutritionSummary, ... });
}
```

## 📊 数据存储

使用 Zustand + localStorage 持久化：

```typescript
// 核心状态
{
  xhsNotes: XhsNote[],              // 原始笔记
  weekKnowledgeCache: {             // 聚合知识
    24: WeekKnowledge,
    25: WeekKnowledge,
    // ...
  },
  shoppingList: ShoppingItem[],     // 购物清单
  settings: UserSettings,           // 用户设置
}
```

## 🔮 未来规划

- [ ] 支持多种内容来源（抖音、知乎等）
- [ ] AI 对比分析多篇笔记，识别冲突信息
- [ ] 云端数据同步（多设备）
- [ ] 生成孕周周报
- [ ] 导出知识库为 PDF

## 📄 开源协议

MIT License

## 💡 贡献指南

欢迎提交 Issue 和 Pull Request！

---

**注意事项：**
- 小红书内容提取需遵守平台条款
- AI 分析结果仅供参考，重要决策请咨询医生
- 本项目为个人学习项目，不做商业用途
