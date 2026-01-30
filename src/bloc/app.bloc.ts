import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserSettings, ShoppingItem, XhsNote, WeekKnowledge } from '@/types';

/**
 * 应用全局状态接口
 */
interface AppState {
  // 用户设置
  settings: UserSettings;
  
  // 小红书笔记收藏
  xhsNotes: XhsNote[];
  
  // 孕周聚合知识
  weekKnowledgeCache: Record<number, WeekKnowledge>;
  
  // 购物清单
  shoppingList: ShoppingItem[];
  
  // 加载状态
  isLoading: boolean;
}

/**
 * 应用状态操作接口
 */
interface AppActions {
  // 设置相关
  updateSettings: (settings: Partial<UserSettings>) => void;
  
  // 笔记相关
  addXhsNote: (note: XhsNote) => void;
  updateXhsNote: (id: string, updates: Partial<XhsNote>) => void;
  removeXhsNote: (id: string) => void;
  toggleNoteFavorite: (id: string) => void;
  getNotesByWeek: (week: number) => XhsNote[];
  getNotesByCategory: (category: string) => XhsNote[];
  
  // 购物清单相关
  addShoppingItem: (item: ShoppingItem) => void;
  toggleShoppingItem: (id: string) => void;
  removeShoppingItem: (id: string) => void;
  
  // 孕周知识相关
  setWeekKnowledge: (week: number, knowledge: WeekKnowledge) => void;
  getWeekKnowledge: (week: number) => WeekKnowledge | undefined;
  aggregateWeekKnowledge: (week: number) => void;
  
  // 工具方法
  setLoading: (loading: boolean) => void;
  getCurrentWeekInfo: () => { week: number; day: number; totalDays: number; stage: string; daysUntilDue: number };
}

/**
 * 应用全局状态管理
 */
export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      // 初始状态
      settings: new UserSettings({ dueDate: '2024-10-05', currentWeek: 24, currentDay: 3 }),
      xhsNotes: [],
      weekKnowledgeCache: {},
      shoppingList: [],
      isLoading: false,

      // 设置相关操作
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: new UserSettings({ ...state.settings, ...newSettings }),
        }));
      },

      // 笔记相关操作
      addXhsNote: (note) => {
        set((state) => {
          const newNotes = [...state.xhsNotes, note];
          
          // 如果笔记有AI分析结果，触发知识聚合
          if (note.aiAnalysis?.weeks) {
            note.aiAnalysis.weeks.forEach(week => {
              // 将在 aggregateWeekKnowledge 中处理
              setTimeout(() => get().aggregateWeekKnowledge(week), 0);
            });
          }
          
          return { xhsNotes: newNotes };
        });
      },

      updateXhsNote: (id, updates) => {
        set((state) => ({
          xhsNotes: state.xhsNotes.map((note) =>
            note.id === id ? { ...note, ...updates } : note
          ),
        }));
      },

      removeXhsNote: (id) => {
        set((state) => ({
          xhsNotes: state.xhsNotes.filter((note) => note.id !== id),
        }));
      },

      toggleNoteFavorite: (id) => {
        set((state) => ({
          xhsNotes: state.xhsNotes.map((note) =>
            note.id === id ? { ...note, isFavorite: !note.isFavorite } : note
          ),
        }));
      },

      getNotesByWeek: (week) => {
        const { xhsNotes } = get();
        return xhsNotes.filter(
          (note) => note.aiAnalysis?.weeks.includes(week)
        );
      },

      getNotesByCategory: (category) => {
        const { xhsNotes } = get();
        return xhsNotes.filter(
          (note) => note.aiAnalysis?.category === category
        );
      },

      // 购物清单操作
      addShoppingItem: (item) => {
        set((state) => ({
          shoppingList: [...state.shoppingList, item],
        }));
      },

      toggleShoppingItem: (id) => {
        set((state) => ({
          shoppingList: state.shoppingList.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item
          ),
        }));
      },

      removeShoppingItem: (id) => {
        set((state) => ({
          shoppingList: state.shoppingList.filter((item) => item.id !== id),
        }));
      },

      // 孕周知识操作
      setWeekKnowledge: (week, knowledge) => {
        set((state) => ({
          weekKnowledgeCache: { ...state.weekKnowledgeCache, [week]: knowledge },
        }));
      },

      getWeekKnowledge: (week) => {
        return get().weekKnowledgeCache[week];
      },

      /**
       * 辅助函数：简单的文本相似度检测和去重
       * 移除完全重复和高度相似的内容
       */
      deduplicateAndMerge: (items: string[]): string[] => {
        if (items.length === 0) return [];
        
        // 第一步：去除完全重复的项
        const uniqueItems = [...new Set(items)];
        
        // 第二步：简单的相似度检测
        // 移除包含关系（如果A完全包含B，则保留较长的A）
        const filtered: string[] = [];
        
        for (const item of uniqueItems) {
          const isDuplicate = filtered.some(existing => {
            // 如果当前项是已有项的子串，跳过
            if (existing.includes(item) && existing.length > item.length) {
              return true;
            }
            // 如果已有项是当前项的子串，替换已有项
            if (item.includes(existing) && item.length > existing.length) {
              const index = filtered.indexOf(existing);
              filtered[index] = item;
              return true;
            }
            return false;
          });
          
          if (!isDuplicate) {
            filtered.push(item);
          }
        }
        
        return filtered;
      },

      /**
       * 聚合指定孕周的知识
       * 从所有笔记中提取该周相关内容，按类别整理
       * 优化：去重、合并相似内容、统计来源
       */
      aggregateWeekKnowledge: (week) => {
        const { xhsNotes, deduplicateAndMerge } = get();
        
        // 获取该周所有笔记
        const weekNotes = xhsNotes.filter(
          (note) => note.aiAnalysis?.weeks.includes(week)
        );
        
        if (weekNotes.length === 0) {
          // 如果没有笔记，清除该周的知识缓存
          const cache = { ...get().weekKnowledgeCache };
          delete cache[week];
          set({ weekKnowledgeCache: cache });
          return;
        }
        
        // 按类别分组
        const notesByCategory = {
          nutrition: weekNotes.filter(n => n.aiAnalysis?.category === 'nutrition'),
          checkup: weekNotes.filter(n => n.aiAnalysis?.category === 'checkup'),
          exercise: weekNotes.filter(n => n.aiAnalysis?.category === 'exercise'),
          product: weekNotes.filter(n => n.aiAnalysis?.category === 'product'),
          symptom: weekNotes.filter(n => n.aiAnalysis?.category === 'symptom'),
          experience: weekNotes.filter(n => n.aiAnalysis?.category === 'experience'),
        };
        
        const now = new Date();
        
        // 聚合营养建议 - 使用去重和合并
        const nutritionPoints = notesByCategory.nutrition.flatMap(n => n.aiAnalysis?.keyPoints || []);
        const nutritionSummary = {
          content: deduplicateAndMerge(nutritionPoints),
          sourceNotes: notesByCategory.nutrition.map(n => n.id),
          lastUpdated: now,
        };
        
        // 聚合产检项目 - 按标题去重
        const checkupMap = new Map<string, any>();
        notesByCategory.checkup.forEach(note => {
          if (note.aiAnalysis?.keyPoints && note.aiAnalysis.keyPoints.length > 0) {
            const title = note.title;
            if (!checkupMap.has(title)) {
              checkupMap.set(title, {
                name: title,
                timing: `第${week}周`,
                process: note.aiAnalysis.keyPoints,
                preparation: note.aiAnalysis.warnings || [],
                notes: [],
              });
            } else {
              // 合并相同标题的项目
              const existing = checkupMap.get(title);
              existing.process = deduplicateAndMerge([
                ...existing.process,
                ...note.aiAnalysis.keyPoints
              ]);
            }
          }
        });
        
        const checkupSummary = {
          items: Array.from(checkupMap.values()),
          sourceNotes: notesByCategory.checkup.map(n => n.id),
          lastUpdated: now,
        };
        
        // 聚合运动建议 - 使用去重和合并
        const exercisePoints = notesByCategory.exercise.flatMap(n => n.aiAnalysis?.keyPoints || []);
        const exerciseSummary = {
          content: deduplicateAndMerge(exercisePoints),
          sourceNotes: notesByCategory.exercise.map(n => n.id),
          lastUpdated: now,
        };
        
        // 聚合推荐物品 - 按名称去重
        const productMap = new Map<string, any>();
        notesByCategory.product.forEach(note => {
          if (note.aiAnalysis?.products) {
            note.aiAnalysis.products.forEach(product => {
              if (!productMap.has(product)) {
                productMap.set(product, {
                  name: product,
                  reason: note.aiAnalysis?.keyPoints[0] || '',
                  recommendedBrands: [],
                  isPurchased: false,
                });
              }
            });
          }
        });
        
        const productSummary = {
          items: Array.from(productMap.values()),
          sourceNotes: notesByCategory.product.map(n => n.id),
          lastUpdated: now,
        };
        
        // 聚合症状说明 - 使用去重和合并
        const symptomPoints = notesByCategory.symptom.flatMap(n => n.aiAnalysis?.keyPoints || []);
        const symptomSummary = {
          content: deduplicateAndMerge(symptomPoints),
          sourceNotes: notesByCategory.symptom.map(n => n.id),
          lastUpdated: now,
        };
        
        // 聚合经验分享 - 使用去重和合并
        const experiencePoints = notesByCategory.experience.flatMap(n => n.aiAnalysis?.keyPoints || []);
        const experienceSummary = {
          content: deduplicateAndMerge(experiencePoints),
          sourceNotes: notesByCategory.experience.map(n => n.id),
          lastUpdated: now,
        };
        
        // 提取重点提醒 - 使用去重和合并
        const allWarnings = weekNotes.flatMap(note => note.aiAnalysis?.warnings || []);
        const highlightPoints = deduplicateAndMerge(allWarnings);
        
        // 创建或更新 WeekKnowledge
        const weekKnowledge = new WeekKnowledge({
          week,
          nutritionSummary,
          checkupSummary,
          exerciseSummary,
          productSummary,
          symptomSummary,
          experienceSummary,
          totalNotes: weekNotes.length,
          highlightPoints,
        });
        
        get().setWeekKnowledge(week, weekKnowledge);
      },

      // 工具方法
      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      /**
       * 获取当前孕周信息（中国标准：从0开始计数）
       * 优先使用末次月经(LMP)计算，更准确
       * 显示格式：X+Y（如 19+1 表示孕19周+1天）
       */
      getCurrentWeekInfo: () => {
        const { settings } = get();
        
        let week = 0;
        let day = 0;
        let totalDays = 1;
        let daysUntilDue = 280;
        
        const now = new Date();
        const nowYear = now.getFullYear();
        const nowMonth = now.getMonth() + 1;
        const nowDay = now.getDate();
        const nowDateUTC = Date.UTC(nowYear, nowMonth - 1, nowDay);
        
        // 优先使用末次月经日期计算（更准确）
        if (settings.lmpDate) {
          const [lmpYear, lmpMonth, lmpDay] = settings.lmpDate.split('-').map(Number);
          const lmpDateUTC = Date.UTC(lmpYear, lmpMonth - 1, lmpDay);
          
          // 从末次月经到今天的天数（包括末次月经当天）
          totalDays = Math.floor((nowDateUTC - lmpDateUTC) / (1000 * 60 * 60 * 24)) + 1;
          daysUntilDue = Math.max(0, 280 - totalDays);
        } else if (settings.dueDate) {
          // 没有 LMP 时，用预产期反推
          const [dueYear, dueMonth, dueDay] = settings.dueDate.split('-').map(Number);
          const dueDateUTC = Date.UTC(dueYear, dueMonth - 1, dueDay);
          daysUntilDue = Math.max(0, Math.floor((dueDateUTC - nowDateUTC) / (1000 * 60 * 60 * 24)));
          totalDays = 280 - daysUntilDue;
        }
        
        // 中国标准孕周计算
        // 末次月经第1天 = 孕0周0天，第7天 = 孕0周6天，第8天 = 孕1周0天
        if (totalDays >= 1) {
          week = Math.floor((totalDays - 1) / 7);
          day = (totalDays - 1) % 7;
        }
        
        if (week < 0) week = 0;
        if (week > 40) week = 40;
        
        // 获取阶段名称
        let stage = '孕早期';
        if (week >= 28) stage = '孕晚期';
        else if (week >= 13) stage = '孕中期';
        
        return { week, day, totalDays, stage, daysUntilDue };
      },
    }),
    {
      name: 'pregnancy-guide-storage',
      partialize: (state) => ({
        settings: state.settings,
        xhsNotes: state.xhsNotes,
        weekKnowledgeCache: state.weekKnowledgeCache,
        shoppingList: state.shoppingList,
      }),
    }
  )
);
