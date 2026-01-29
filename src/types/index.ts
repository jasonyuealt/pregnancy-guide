/**
 * 内容来源
 */
export type ContentSource = 'ai' | 'xiaohongshu' | 'user';

/**
 * 内容类型
 */
export type ItemType = 'todo' | 'shopping' | 'tip' | 'forWife';

/**
 * 周内容项 - 统一的数据结构
 * 每条待办、购物、注意事项、为老婆做的事都是一个 WeekItem
 */
export class WeekItem {
  id: string;
  type: ItemType;           // 类型：待办/购物/注意/为老婆
  content: string;          // 内容
  source: ContentSource;    // 来源：AI/小红书/自定义
  completed: boolean;       // 是否完成（仅 todo/shopping 用）
  week: number;             // 所属周数
  note?: string;            // 备注（如购物理由）
  createdAt: string;        // 创建时间

  constructor(data: Partial<WeekItem> = {}) {
    this.id = data.id || crypto.randomUUID();
    this.type = data.type || 'todo';
    this.content = data.content || '';
    this.source = data.source || 'user';
    this.completed = data.completed || false;
    this.week = data.week || 0;
    this.note = data.note;
    this.createdAt = data.createdAt || new Date().toISOString();
  }
}

/**
 * 周数据 - 存储每周的所有内容
 */
export interface WeekData {
  week: number;
  items: WeekItem[];           // 该周所有内容
  aiGenerated: boolean;        // 是否已由 AI 生成过
  lastUpdated: string;         // 最后更新时间
}

/**
 * 用户设置
 */
export class UserSettings {
  dueDate: string | null;      // 预产期 YYYY-MM-DD
  lmpDate: string | null;      // 末次月经 YYYY-MM-DD

  constructor(data: Partial<UserSettings> = {}) {
    this.dueDate = data.dueDate ?? null;
    this.lmpDate = data.lmpDate ?? null;
  }
}

/**
 * 类型标签映射
 */
export const TYPE_LABELS: Record<ItemType, string> = {
  todo: '待办',
  shopping: '购物',
  tip: '注意',
  forWife: '为老婆',
};

/**
 * 来源标签映射
 */
export const SOURCE_LABELS: Record<ContentSource, string> = {
  ai: 'AI',
  xiaohongshu: '小红书',
  user: '自定义',
};
