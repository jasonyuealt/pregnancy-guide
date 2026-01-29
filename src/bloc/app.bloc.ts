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
  removeImportedItem: (id: string) => void;
  
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

      removeImportedItem: (id) => {
        set((state) => ({
          importedItems: state.importedItems.filter((item) => item.id !== id),
        }));
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
        todos: state.todos,
        shoppingList: state.shoppingList,
        weekDataCache: state.weekDataCache,
        importedItems: state.importedItems,
      }),
    }
  )
);
