/**
 * 孕期阶段枚举
 */
export type PregnancyStage = 'early' | 'middle' | 'late' | 'hospital';

/**
 * 内容来源枚举
 */
export type ContentSource = 'ai' | 'user' | 'xiaohongshu';

/**
 * 内容类型枚举
 */
export type ContentType = 'tip' | 'product' | 'experience' | 'nutrition' | 'exercise';

/**
 * 产检项目
 */
export class CheckupItem {
  id: string;
  name: string;
  description: string;
  week: number;
  isCompleted: boolean;
  appointmentDate?: Date;

  constructor(data: Partial<CheckupItem> = {}) {
    this.id = data.id || crypto.randomUUID();
    this.name = data.name || '';
    this.description = data.description || '';
    this.week = data.week || 0;
    this.isCompleted = data.isCompleted || false;
    this.appointmentDate = data.appointmentDate;
  }
}

/**
 * 购物项目
 */
export class ShoppingItem {
  id: string;
  name: string;
  category: string;
  stage: PregnancyStage;
  week: number | null;
  checked: boolean;
  source: ContentSource;
  sourceUrl?: string;
  note?: string;
  createdAt: Date;

  constructor(data: Partial<ShoppingItem> = {}) {
    this.id = data.id || crypto.randomUUID();
    this.name = data.name || '';
    this.category = data.category || '';
    this.stage = data.stage || 'middle';
    this.week = data.week ?? null;
    this.checked = data.checked || false;
    this.source = data.source || 'user';
    this.sourceUrl = data.sourceUrl;
    this.note = data.note;
    this.createdAt = data.createdAt || new Date();
  }
}

/**
 * 导入的小红书内容
 */
export class ImportedItem {
  id: string;
  sourceUrl: string;
  sourceTitle: string;
  extractedAt: Date;
  targetWeek: number | null;
  targetStage: PregnancyStage | null;
  contentType: ContentType;
  content: string;
  tags: string[];
  isIntegrated: boolean;

  constructor(data: Partial<ImportedItem> = {}) {
    this.id = data.id || crypto.randomUUID();
    this.sourceUrl = data.sourceUrl || '';
    this.sourceTitle = data.sourceTitle || '';
    this.extractedAt = data.extractedAt || new Date();
    this.targetWeek = data.targetWeek ?? null;
    this.targetStage = data.targetStage ?? null;
    this.contentType = data.contentType || 'tip';
    this.content = data.content || '';
    this.tags = data.tags || [];
    this.isIntegrated = data.isIntegrated || false;
  }
}

/**
 * 每日待办
 */
export class TodoItem {
  id: string;
  title: string;
  completed: boolean;
  date: string; // YYYY-MM-DD 格式
  week: number;
  category: 'health' | 'nutrition' | 'exercise' | 'checkup' | 'other';

  constructor(data: Partial<TodoItem> = {}) {
    this.id = data.id || crypto.randomUUID();
    this.title = data.title || '';
    this.completed = data.completed || false;
    this.date = data.date || new Date().toISOString().split('T')[0];
    this.week = data.week || 0;
    this.category = data.category || 'other';
  }
}

/**
 * 孕周数据
 */
export class WeekData {
  week: number;
  fetalSize: string;
  fetalWeight: string;
  fetalLength: string;
  fetalEmoji: string;
  fetalDevelopment: string;
  bodyChanges: string[];
  tips: string[];
  nutrition: string[];
  exercise: string[];
  checkups: CheckupItem[];
  shopping: ShoppingItem[];
  importedContent: ImportedItem[];
  customNotes: string[];

  constructor(data: Partial<WeekData> = {}) {
    this.week = data.week || 1;
    this.fetalSize = data.fetalSize || '';
    this.fetalWeight = data.fetalWeight || '';
    this.fetalLength = data.fetalLength || '';
    this.fetalEmoji = data.fetalEmoji || '👶';
    this.fetalDevelopment = data.fetalDevelopment || '';
    this.bodyChanges = data.bodyChanges || [];
    this.tips = data.tips || [];
    this.nutrition = data.nutrition || [];
    this.exercise = data.exercise || [];
    this.checkups = data.checkups || [];
    this.shopping = data.shopping || [];
    this.importedContent = data.importedContent || [];
    this.customNotes = data.customNotes || [];
  }
}

/**
 * 用户设置
 */
export class UserSettings {
  dueDate: string | null; // 预产期 YYYY-MM-DD
  currentWeek: number;
  currentDay: number;

  constructor(data: Partial<UserSettings> = {}) {
    this.dueDate = data.dueDate ?? null;
    this.currentWeek = data.currentWeek || 24;
    this.currentDay = data.currentDay || 3;
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
