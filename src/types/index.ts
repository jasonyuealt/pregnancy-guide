/**
 * 孕期阶段枚举
 */
export type PregnancyStage = 'early' | 'middle' | 'late' | 'hospital';

/**
 * 内容类型枚举
 */
export type ContentCategory = 'nutrition' | 'checkup' | 'exercise' | 'product' | 'symptom' | 'experience';

/**
 * AI分析结果接口
 */
export interface AiAnalysisResult {
  weeks: number[];                    // 适用孕周 [24, 25, 26]
  category: ContentCategory;          // 内容分类
  keyPoints: string[];                // 关键知识点
  products: string[];                 // 提取的产品列表
  warnings: string[];                 // 注意事项/警告
  relatedTags: string[];              // 相关标签
}

/**
 * 小红书笔记 - 核心数据模型
 */
export class XhsNote {
  id: string;
  sourceUrl: string;
  title: string;
  content: string;
  images: string[];
  author: string;
  authorAvatar: string;
  likes: number;
  tags: string[];
  importedAt: Date;
  
  // AI分析结果
  aiAnalysis: AiAnalysisResult | null;
  
  // 用户标注
  userNotes: string;
  isFavorite: boolean;
  isArchived: boolean;

  constructor(data: Partial<XhsNote> = {}) {
    this.id = data.id || crypto.randomUUID();
    this.sourceUrl = data.sourceUrl || '';
    this.title = data.title || '';
    this.content = data.content || '';
    this.images = data.images || [];
    this.author = data.author || '';
    this.authorAvatar = data.authorAvatar || '';
    this.likes = data.likes || 0;
    this.tags = data.tags || [];
    this.importedAt = data.importedAt || new Date();
    this.aiAnalysis = data.aiAnalysis || null;
    this.userNotes = data.userNotes || '';
    this.isFavorite = data.isFavorite || false;
    this.isArchived = data.isArchived || false;
  }
}

/**
 * 产检项目详情
 */
export interface CheckupDetail {
  name: string;              // 糖耐量筛查
  timing: string;            // 24-28周
  process: string[];         // ['空腹抽血', '喝糖水', '等待1小时']
  preparation: string[];     // ['前一晚禁食8小时']
  notes: string[];           // ['建议早上去']
}

/**
 * 推荐物品详情
 */
export interface ProductDetail {
  name: string;              // 孕妇枕
  reason: string;            // 缓解腰酸背痛
  recommendedBrands: string[]; // ['品牌A', '品牌B']
  isPurchased: boolean;
}

/**
 * 分类内容摘要
 */
export interface CategorySummary {
  content: string[];         // 内容要点列表
  sourceNotes: string[];     // 来源笔记ID列表
  lastUpdated: Date;
}

/**
 * 孕周聚合知识 - AI整理后的结构化内容
 */
export class WeekKnowledge {
  week: number;
  
  // 各类别的内容摘要
  nutritionSummary: CategorySummary;
  checkupSummary: {
    items: CheckupDetail[];
    sourceNotes: string[];
    lastUpdated: Date;
  };
  exerciseSummary: CategorySummary;
  productSummary: {
    items: ProductDetail[];
    sourceNotes: string[];
    lastUpdated: Date;
  };
  symptomSummary: CategorySummary;
  experienceSummary: CategorySummary;
  
  // 统计信息
  totalNotes: number;        // 该周总共有多少篇笔记
  highlightPoints: string[]; // 本周重点提醒

  constructor(data: Partial<WeekKnowledge> = {}) {
    this.week = data.week || 1;
    this.nutritionSummary = data.nutritionSummary || {
      content: [],
      sourceNotes: [],
      lastUpdated: new Date(),
    };
    this.checkupSummary = data.checkupSummary || {
      items: [],
      sourceNotes: [],
      lastUpdated: new Date(),
    };
    this.exerciseSummary = data.exerciseSummary || {
      content: [],
      sourceNotes: [],
      lastUpdated: new Date(),
    };
    this.productSummary = data.productSummary || {
      items: [],
      sourceNotes: [],
      lastUpdated: new Date(),
    };
    this.symptomSummary = data.symptomSummary || {
      content: [],
      sourceNotes: [],
      lastUpdated: new Date(),
    };
    this.experienceSummary = data.experienceSummary || {
      content: [],
      sourceNotes: [],
      lastUpdated: new Date(),
    };
    this.totalNotes = data.totalNotes || 0;
    this.highlightPoints = data.highlightPoints || [];
  }
}

/**
 * 购物项目
 */
export class ShoppingItem {
  id: string;
  name: string;
  reason: string;            // 购买原因
  recommendedBrands: string[]; // 推荐品牌
  stage: PregnancyStage;
  week: number | null;
  checked: boolean;
  sourceNoteId: string | null; // 来源笔记ID
  note?: string;
  createdAt: Date;

  constructor(data: Partial<ShoppingItem> = {}) {
    this.id = data.id || crypto.randomUUID();
    this.name = data.name || '';
    this.reason = data.reason || '';
    this.recommendedBrands = data.recommendedBrands || [];
    this.stage = data.stage || 'middle';
    this.week = data.week ?? null;
    this.checked = data.checked || false;
    this.sourceNoteId = data.sourceNoteId ?? null;
    this.note = data.note;
    this.createdAt = data.createdAt || new Date();
  }
}

/**
 * 用户设置
 */
export class UserSettings {
  dueDate: string | null; // 预产期 YYYY-MM-DD
  lmpDate: string | null; // 末次月经 YYYY-MM-DD
  currentWeek: number;
  currentDay: number;
  xhsCookie: string | null; // 小红书 Cookie

  constructor(data: Partial<UserSettings> = {}) {
    this.dueDate = data.dueDate ?? null;
    this.lmpDate = data.lmpDate ?? null;
    this.currentWeek = data.currentWeek || 24;
    this.currentDay = data.currentDay || 3;
    this.xhsCookie = data.xhsCookie ?? null;
  }

  /**
   * 根据预产期计算当前孕周
   */
  calculateCurrentWeek(): { week: number; day: number } {
    if (!this.dueDate) {
      return { week: this.currentWeek, day: this.currentDay };
    }

    const due = new Date(this.dueDate);
    const today = new Date();
    const pregnancyStart = new Date(due);
    pregnancyStart.setDate(pregnancyStart.getDate() - 280); // 孕期40周 = 280天

    const diffTime = today.getTime() - pregnancyStart.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const week = Math.floor(diffDays / 7) + 1;
    const day = (diffDays % 7) + 1;

    return { week: Math.max(1, Math.min(40, week)), day };
  }

  /**
   * 计算距离预产期天数
   */
  getDaysUntilDue(): number {
    if (!this.dueDate) return 0;
    const due = new Date(this.dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  /**
   * 获取孕期阶段
   */
  getStage(): PregnancyStage {
    const { week } = this.calculateCurrentWeek();
    if (week <= 12) return 'early';
    if (week <= 28) return 'middle';
    return 'late';
  }

  /**
   * 获取孕期阶段中文名
   */
  getStageName(): string {
    const stage = this.getStage();
    const names: Record<PregnancyStage, string> = {
      early: '孕早期',
      middle: '孕中期',
      late: '孕晚期',
      hospital: '待产期',
    };
    return names[stage];
  }
}
