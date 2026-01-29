import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserSettings, WeekItem, WeekData, ItemType, ContentSource } from '@/types';

/**
 * 应用状态
 */
interface AppState {
  // 用户设置
  settings: UserSettings;
  
  // 每周数据缓存 (key: 周数)
  weekDataMap: Record<number, WeekData>;
  
  // 加载状态
  isLoading: boolean;
}

/**
 * 应用操作
 */
interface AppActions {
  // 设置
  updateSettings: (settings: Partial<UserSettings>) => void;
  
  // 获取当前孕周信息
  getCurrentWeekInfo: () => {
    week: number;
    day: number;
    totalDays: number;
    stage: string;
    daysUntilDue: number;
  };
  
  // 周数据操作
  getWeekData: (week: number) => WeekData;
  setWeekData: (week: number, data: Partial<WeekData>) => void;
  
  // 内容项操作
  addItem: (week: number, item: Omit<WeekItem, 'id' | 'createdAt'>) => void;
  updateItem: (week: number, itemId: string, updates: Partial<WeekItem>) => void;
  deleteItem: (week: number, itemId: string) => void;
  toggleItem: (week: number, itemId: string) => void;
  
  // 批量添加（AI 生成时用）
  addItems: (week: number, items: Omit<WeekItem, 'id' | 'createdAt'>[]) => void;
  
  // 工具
  setLoading: (loading: boolean) => void;
}

/**
 * 创建空的周数据
 */
const createEmptyWeekData = (week: number): WeekData => ({
  week,
  items: [],
  aiGenerated: false,
  lastUpdated: new Date().toISOString(),
});

/**
 * 应用状态管理
 */
export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      // 初始状态
      settings: new UserSettings(),
      weekDataMap: {},
      isLoading: false,

      // 更新设置
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      /**
       * 获取当前孕周信息（中国标准：从0开始）
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
        
        // 优先使用末次月经计算
        if (settings.lmpDate) {
          const [lmpYear, lmpMonth, lmpDay] = settings.lmpDate.split('-').map(Number);
          const lmpDateUTC = Date.UTC(lmpYear, lmpMonth - 1, lmpDay);
          totalDays = Math.floor((nowDateUTC - lmpDateUTC) / (1000 * 60 * 60 * 24)) + 1;
          daysUntilDue = Math.max(0, 280 - totalDays);
        } else if (settings.dueDate) {
          const [dueYear, dueMonth, dueDay] = settings.dueDate.split('-').map(Number);
          const dueDateUTC = Date.UTC(dueYear, dueMonth - 1, dueDay);
          daysUntilDue = Math.max(0, Math.floor((dueDateUTC - nowDateUTC) / (1000 * 60 * 60 * 24)));
          totalDays = 280 - daysUntilDue;
        }
        
        // 中国标准：末次月经第1天 = 孕0周0天
        if (totalDays >= 1) {
          week = Math.floor((totalDays - 1) / 7);
          day = (totalDays - 1) % 7;
        }
        
        if (week < 0) week = 0;
        if (week > 40) week = 40;
        
        let stage = '孕早期';
        if (week >= 28) stage = '孕晚期';
        else if (week >= 13) stage = '孕中期';
        
        return { week, day, totalDays, stage, daysUntilDue };
      },

      // 获取周数据
      getWeekData: (week) => {
        const { weekDataMap } = get();
        return weekDataMap[week] || createEmptyWeekData(week);
      },

      // 设置周数据
      setWeekData: (week, data) => {
        set((state) => ({
          weekDataMap: {
            ...state.weekDataMap,
            [week]: {
              ...createEmptyWeekData(week),
              ...state.weekDataMap[week],
              ...data,
              lastUpdated: new Date().toISOString(),
            },
          },
        }));
      },

      // 添加单个内容项
      addItem: (week, itemData) => {
        const item = new WeekItem({ ...itemData, week });
        set((state) => {
          const existing = state.weekDataMap[week] || createEmptyWeekData(week);
          return {
            weekDataMap: {
              ...state.weekDataMap,
              [week]: {
                ...existing,
                items: [...existing.items, item],
                lastUpdated: new Date().toISOString(),
              },
            },
          };
        });
      },

      // 批量添加内容项（AI 生成用）
      addItems: (week, itemsData) => {
        const items = itemsData.map((data) => new WeekItem({ ...data, week }));
        set((state) => {
          const existing = state.weekDataMap[week] || createEmptyWeekData(week);
          return {
            weekDataMap: {
              ...state.weekDataMap,
              [week]: {
                ...existing,
                items: [...existing.items, ...items],
                aiGenerated: true,
                lastUpdated: new Date().toISOString(),
              },
            },
          };
        });
      },

      // 更新内容项
      updateItem: (week, itemId, updates) => {
        set((state) => {
          const existing = state.weekDataMap[week];
          if (!existing) return state;
          
          return {
            weekDataMap: {
              ...state.weekDataMap,
              [week]: {
                ...existing,
                items: existing.items.map((item) =>
                  item.id === itemId ? { ...item, ...updates } : item
                ),
                lastUpdated: new Date().toISOString(),
              },
            },
          };
        });
      },

      // 删除内容项
      deleteItem: (week, itemId) => {
        set((state) => {
          const existing = state.weekDataMap[week];
          if (!existing) return state;
          
          return {
            weekDataMap: {
              ...state.weekDataMap,
              [week]: {
                ...existing,
                items: existing.items.filter((item) => item.id !== itemId),
                lastUpdated: new Date().toISOString(),
              },
            },
          };
        });
      },

      // 切换完成状态
      toggleItem: (week, itemId) => {
        set((state) => {
          const existing = state.weekDataMap[week];
          if (!existing) return state;
          
          return {
            weekDataMap: {
              ...state.weekDataMap,
              [week]: {
                ...existing,
                items: existing.items.map((item) =>
                  item.id === itemId ? { ...item, completed: !item.completed } : item
                ),
                lastUpdated: new Date().toISOString(),
              },
            },
          };
        });
      },

      // 设置加载状态
      setLoading: (loading) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'pregnancy-guide-v2',
      partialize: (state) => ({
        settings: state.settings,
        weekDataMap: state.weekDataMap,
      }),
    }
  )
);
