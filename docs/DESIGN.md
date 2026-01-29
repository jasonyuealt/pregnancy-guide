# 孕期指南 (Pregnancy Guide)

一个帮助准妈妈全面了解孕期知识、合理安排孕期生活的 PC 网站应用。

## 项目概述

### 目标用户
- 备孕期女性
- 孕期准妈妈
- 准爸爸及家庭成员

### 核心需求
1. **孕期时间轴**：按天/周/月查看注意事项和待办事项
2. **AI 内容生成**：自动生成孕期各阶段的基础知识内容
3. **小红书整合**：导入小红书文章链接，AI 提取关键内容整合到对应时间区块

---

## 核心功能模块

### 1. 孕期时间轴 (Timeline)
主视图，支持三种时间粒度切换：

| 视图 | 说明 | 展示内容 |
|------|------|----------|
| **日视图** | 每日详细安排 | 今日注意事项、待办清单、饮食建议、运动建议 |
| **周视图** | 40周孕期指南 | 胎儿发育、身体变化、产检项目、本周重点 |
| **月视图** | 10个月概览 | 阶段总结、关键里程碑、购物清单汇总 |

### 2. AI 内容生成器 (AI Generator)
- **初始化生成**：根据预产期自动生成 40 周的基础内容框架
- **内容类型**：
  - 胎儿发育信息
  - 准妈妈身体变化
  - 饮食营养建议
  - 运动注意事项
  - 产检项目提醒
  - 购物清单建议

### 3. 小红书内容整合 (Content Importer)
- **文章导入**：粘贴小红书文章链接或内容
- **AI 提取**：自动提取文章中的关键信息
  - 识别所属孕周/阶段
  - 提取产品推荐
  - 提取注意事项
  - 提取经验分享
- **智能归类**：将提取的内容自动归类到对应的时间区块
- **来源标注**：保留原文来源，方便溯源

### 4. 购物清单 (Shopping List)
- **分阶段清单**：孕早期、孕中期、孕晚期、待产包
- **物品管理**：添加、编辑、勾选、删除
- **AI 推荐**：基于当前孕周推荐需要准备的物品
- **小红书推荐整合**：从导入的文章中提取的产品推荐

### 5. 个人设置 (Settings)
- **预产期设置**：输入预产期，自动计算当前孕周
- **数据导出**：导出个人清单和笔记
- **本地存储**：数据存储在浏览器 localStorage

---

## 页面结构

```
/                           # 首页 - 仪表盘概览
├── /timeline               # 孕期时间轴（主视图）
│   ├── ?view=day          # 日视图
│   ├── ?view=week         # 周视图（默认）
│   └── ?view=month        # 月视图
├── /timeline/week/:week    # 某一周详情页
├── /timeline/month/:month  # 某一月详情页
├── /shopping               # 购物清单
│   ├── /early              # 孕早期清单
│   ├── /middle             # 孕中期清单
│   ├── /late               # 孕晚期清单
│   └── /hospital-bag       # 待产包清单
├── /import                 # 小红书导入页
└── /settings               # 设置页
```

---

## AI 接口配置

### API 端点
```
POST https://cerebras-proxy.brain.loocaa.com:1443/v1/chat/completions
```

### 请求头
```
Authorization: Bearer DlJYSkMVj1x4zoe8jZnjvxfHG6z5yGxK
Content-Type: application/json
Accept: application/json
```

### 使用模型
```
qwen-3-235b-a22b-instruct-2507
```

### AI 功能场景

#### 场景1：生成某周的孕期内容
```json
{
  "model": "qwen-3-235b-a22b-instruct-2507",
  "messages": [
    {
      "role": "system",
      "content": "你是一个专业的孕期顾问，请根据用户提供的孕周，生成该周的详细指南..."
    },
    {
      "role": "user", 
      "content": "请生成孕期第24周的详细指南，包括：胎儿发育、身体变化、注意事项、饮食建议、运动建议、产检项目"
    }
  ]
}
```

#### 场景2：提取小红书文章内容
```json
{
  "model": "qwen-3-235b-a22b-instruct-2507",
  "messages": [
    {
      "role": "system",
      "content": "你是一个内容提取助手，请从用户提供的小红书文章中提取孕期相关信息..."
    },
    {
      "role": "user",
      "content": "请从以下文章中提取关键信息：\n\n[文章内容]\n\n请返回JSON格式..."
    }
  ]
}
```

---

## 数据结构设计

### 孕周数据 (WeekData)
```typescript
class WeekData {
  week: number;                    // 孕周数 1-40
  fetalDevelopment: string;        // 胎儿发育
  bodyChanges: string;             // 身体变化
  tips: string[];                  // 注意事项
  nutrition: string[];             // 饮食建议
  exercise: string[];              // 运动建议
  checkups: CheckupItem[];         // 产检项目
  shopping: ShoppingItem[];        // 购物建议
  customNotes: Note[];             // 用户笔记
  importedContent: ImportedItem[]; // 导入的小红书内容
}
```

### 购物项目 (ShoppingItem)
```typescript
class ShoppingItem {
  id: string;
  name: string;                    // 物品名称
  category: string;                // 分类
  stage: 'early' | 'middle' | 'late' | 'hospital'; // 所属阶段
  week: number | null;             // 建议购买孕周
  checked: boolean;                // 是否已购买
  source: 'ai' | 'user' | 'xiaohongshu'; // 来源
  sourceUrl?: string;              // 小红书来源链接
  note?: string;                   // 备注
}
```

### 导入内容 (ImportedItem)
```typescript
class ImportedItem {
  id: string;
  sourceUrl: string;               // 原文链接
  sourceTitle: string;             // 原文标题
  extractedAt: Date;               // 提取时间
  targetWeek: number | null;       // 归属孕周
  targetStage: string | null;      // 归属阶段
  contentType: 'tip' | 'product' | 'experience'; // 内容类型
  content: string;                 // 提取的内容
  tags: string[];                  // 标签
}
```

---

## 孕期阶段划分

### 孕早期 (第1-12周)
| 周数 | 关键事项 | 建议购置 |
|------|----------|----------|
| 1-4周 | 确认怀孕、开始补充叶酸 | 验孕棒、叶酸 |
| 5-8周 | 首次产检、建档 | 孕妇维生素、防辐射服（可选） |
| 9-12周 | NT检查、早期唐筛 | 孕妇枕、舒适内衣 |

### 孕中期 (第13-28周)
| 周数 | 关键事项 | 建议购置 |
|------|----------|----------|
| 13-16周 | 中期唐筛 | 孕妇装、托腹带 |
| 17-20周 | 四维彩超 | 妊娠纹霜、钙片 |
| 21-24周 | 糖耐量测试 | 胎教音乐、胎心仪（可选） |
| 25-28周 | 常规产检 | 开始准备待产包 |

### 孕晚期 (第29-40周)
| 周数 | 关键事项 | 建议购置 |
|------|----------|----------|
| 29-32周 | 胎位检查 | 婴儿服装、纸尿裤 |
| 33-36周 | 每周产检 | 完善待产包 |
| 37-40周 | 随时待产 | 最后确认清单 |

---

## 技术栈

### 前端
- **框架**：Next.js 14 (App Router)
- **UI库**：Tailwind CSS + shadcn/ui
- **状态管理**：Zustand
- **数据存储**：localStorage + IndexedDB
- **HTTP请求**：fetch API
- **图标**：Lucide React

### 部署
- **平台**：Vercel

---

## 开发计划

### Phase 1: 核心框架
1. 项目初始化（Next.js + Tailwind + shadcn/ui）
2. 首页仪表盘
3. 孕期时间轴（周视图）
4. 基础数据结构和本地存储

### Phase 2: AI 功能
1. AI 接口封装
2. 孕期内容自动生成
3. 内容编辑和保存

### Phase 3: 小红书整合
1. 文章导入界面
2. AI 内容提取
3. 智能归类到对应区块

### Phase 4: 购物清单
1. 分阶段购物清单
2. 物品管理功能
3. AI 购物建议

### Phase 5: 完善优化
1. 日视图和月视图
2. 数据导出功能
3. 移动端适配
4. 性能优化

---

## 设计风格

### 色彩方案（PC端）
- **主色**：温暖玫瑰粉 `#F5A5B8`
- **辅助色**：薰衣草紫 `#B8A5F5` / 薄荷绿 `#A5F5D4`
- **背景色**：浅灰白 `#FAFAFA` / 纯白 `#FFFFFF`
- **文字色**：深灰 `#1F2937` / 中灰 `#6B7280`
- **边框色**：浅灰 `#E5E7EB`

### 设计原则
1. **清晰专业**：信息层次分明，PC端充分利用宽屏空间
2. **温馨舒适**：整体风格温暖但不过于花哨
3. **高效操作**：支持键盘快捷键，批量操作
4. **响应式**：PC优先，移动端适配

---

## 文件结构

```
pregnancy-guide/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # 首页
│   │   ├── timeline/           # 时间轴
│   │   ├── shopping/           # 购物清单
│   │   ├── import/             # 小红书导入
│   │   └── settings/           # 设置
│   ├── components/             # 公共组件
│   │   ├── ui/                 # shadcn/ui 组件
│   │   ├── layout/             # 布局组件（Header, Sidebar）
│   │   └── features/           # 功能组件
│   ├── bloc/                   # 业务逻辑层
│   │   ├── timeline.bloc.ts    # 时间轴逻辑
│   │   ├── shopping.bloc.ts    # 购物清单逻辑
│   │   ├── import.bloc.ts      # 导入逻辑
│   │   └── ai.bloc.ts          # AI 接口逻辑
│   ├── data/                   # 静态数据/初始数据
│   ├── types/                  # 类型定义（class）
│   ├── hooks/                  # 自定义 Hooks
│   ├── lib/                    # 工具库
│   │   ├── ai.ts               # AI API 封装
│   │   └── storage.ts          # 本地存储封装
│   └── utils/                  # 工具函数
├── public/                     # 静态资源
├── README.md                   # 项目文档
├── package.json
└── tailwind.config.js
```
