import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserSettings, TodoItem, ShoppingItem, WeekData, ImportedItem } from '@/types';

/**
 * 应用全局状态接口
 */
interface AppState {
  // 用户设置
  settings: UserSettings;
  
  // 待办事项
  todos: TodoItem[];
  
  // 购物清单
  shoppingList: ShoppingItem[];
  
  // 孕周数据缓存
  weekDataCache: Record<number, WeekData>;
  
  // 导入的内容
  importedItems: ImportedItem[];
  
  // 加载状态
  isLoading: boolean;
}

/**
 * 应用状态操作接口
 */
interface AppActions {
  // 设置相关
  updateSettings: (settings: Partial<UserSettings>) => void;
  
  // 待办相关
  addTodo: (todo: TodoItem) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
  
  // 购物清单相关
  addShoppingItem: (item: ShoppingItem) => void;
  toggleShoppingItem: (id: string) => void;
  removeShoppingItem: (id: string) => void;
  
  // 孕周数据相关
  setWeekData: (week: number, data: WeekData) => void;
  getWeekData: (week: number) => WeekData | undefined;
  
  // 导入内容相关
  addImportedItem: (item: ImportedItem) => void;
  markAsIntegrated: (id: string) => void;
  
  // 工具方法
  setLoading: (loading: boolean) => void;
  getCurrentWeekInfo: () => { week: number; day: number; stage: string; daysUntilDue: number };
}

/**
 * 应用全局状态管理
 */
export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      // 初始状态
      settings: new UserSettings({ dueDate: '2024-10-05', currentWeek: 24, currentDay: 3 }),
      todos: [
        new TodoItem({ title: '服用叶酸和钙片', completed: true, category: 'health' }),
        new TodoItem({ title: '记录今日体重', completed: false, category: 'health' }),
        new TodoItem({ title: '30分钟散步 🚶‍♀️', completed: false, category: 'exercise' }),
        new TodoItem({ title: '晚间胎动记录', completed: false, category: 'health' }),
        new TodoItem({ title: '听胎教音乐 🎵', completed: false, category: 'other' }),
      ],
      shoppingList: [
        new ShoppingItem({ name: '孕妇枕 🛏️', stage: 'middle', week: 24, source: 'xiaohongshu' }),
        new ShoppingItem({ name: '叶酸 💊', stage: 'early', checked: true, source: 'ai' }),
        new ShoppingItem({ name: '哺乳内衣 × 3 👙', stage: 'hospital', checked: true, source: 'user' }),
        new ShoppingItem({ name: '婴儿推车 🚼', stage: 'late', week: 32, source: 'ai' }),
        new ShoppingItem({ name: '纸尿裤 NB码 👶', stage: 'hospital', source: 'xiaohongshu' }),
      ],
      weekDataCache: {},
      importedItems: [
        new ImportedItem({
          sourceTitle: '待产包最全清单！别漏买',
          targetStage: 'hospital',
          contentType: 'product',
          isIntegrated: true,
        }),
        new ImportedItem({
          sourceTitle: '孕中期这样吃，宝宝长得好',
          targetWeek: 24,
          contentType: 'nutrition',
          isIntegrated: true,
        }),
      ],
      isLoading: false,

      // 设置相关操作
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: new UserSettings({ ...state.settings, ...newSettings }),
        }));
      },

      // 待办相关操作
      addTodo: (todo) => {
        set((state) => ({
          todos: [...state.todos, todo],
        }));
      },

      toggleTodo: (id) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          ),
        }));
      },

      removeTodo: (id) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        }));
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

      // 孕周数据操作
      setWeekData: (week, data) => {
        set((state) => ({
          weekDataCache: { ...state.weekDataCache, [week]: data },
        }));
      },

      getWeekData: (week) => {
        return get().weekDataCache[week];
      },

      // 导入内容操作
      addImportedItem: (item) => {
        set((state) => ({
          importedItems: [...state.importedItems, item],
        }));
      },

      markAsIntegrated: (id) => {
        set((state) => ({
          importedItems: state.importedItems.map((item) =>
            item.id === id ? { ...item, isIntegrated: true } : item
          ),
        }));
      },

      // 工具方法
      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      /**
       * 获取当前孕周信息（使用本地日期避免时区问题）
       */
      getCurrentWeekInfo: () => {
        const { settings } = get();
        
        let week = settings.currentWeek || 1;
        let day = settings.currentDay || 1;
        let daysUntilDue = 0;
        
        if (settings.dueDate) {
          // 使用本地日期字符串解析，避免时区问题
          const [dueYear, dueMonth, dueDay] = settings.dueDate.split('-').map(Number);
          const now = new Date();
          const nowYear = now.getFullYear();
          const nowMonth = now.getMonth() + 1;
          const nowDay = now.getDate();
          
          // 计算从今天到预产期的天数（使用 UTC 避免夏令时问题）
          const dueDate = Date.UTC(dueYear, dueMonth - 1, dueDay);
          const nowDate = Date.UTC(nowYear, nowMonth - 1, nowDay);
          const diffMs = dueDate - nowDate;
          daysUntilDue = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
          
          // 孕期总天数 = 280 - 距预产期天数
          const totalDays = 280 - daysUntilDue;
          
          // 孕周计算：第1天是第1周第1天
          if (totalDays >= 1) {
            week = Math.floor((totalDays - 1) / 7) + 1;
            day = ((totalDays - 1) % 7) + 1;
          } else {
            week = 1;
            day = 1;
          }
          
          if (week > 40) week = 40;
        }
        
        // 获取阶段名称
        let stage = '孕早期';
        if (week > 28) stage = '孕晚期';
        else if (week > 12) stage = '孕中期';
        
        return { week, day, stage, daysUntilDue };
      },
    }),
    {
      name: 'pregnancy-guide-storage',
      partialize: (state) => ({
        settings: state.settings,
        todos: state.todos,
        shoppingList: state.shoppingList,
        weekDataCache: state.weekDataCache,
        importedItems: state.importedItems,
      }),
    }
  )
);
