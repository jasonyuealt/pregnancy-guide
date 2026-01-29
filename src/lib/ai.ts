import { WeekItem, ItemType } from '@/types';

const API_URL = 'https://cerebras-proxy.brain.loocaa.com:1443/v1/chat/completions';
const API_KEY = 'DlJYSkMVj1x4zoe8jZnjvxfHG6z5yGxK';
const MODEL = 'qwen-3-235b-a22b-instruct-2507';

/**
 * AI 聊天接口
 */
async function chat(messages: { role: string; content: string }[]): Promise<string> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({ model: MODEL, messages }),
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

/**
 * AI 生成的周内容结构
 */
export interface AIWeekContent {
  todos: string[];      // 待办事项
  shopping: { item: string; reason: string }[];  // 购物清单
  tips: string[];       // 注意事项
  forWife: string[];    // 为老婆做的事
}

/**
 * 生成指定周的内容
 */
export async function generateWeekContent(week: number): Promise<AIWeekContent> {
  const stage = week < 13 ? '孕早期' : week < 28 ? '孕中期' : '孕晚期';
  
  const systemPrompt = `你是一个专业的孕期顾问，帮助准爸爸了解每周该做什么。
请根据孕${week}周（${stage}）的实际情况，生成以下内容。

要求：
1. 内容必须准确、实用、可执行
2. 语言简洁，每条不超过20字
3. 针对准爸爸的角度，告诉他该做什么

请严格返回以下 JSON 格式：
{
  "todos": ["待办1", "待办2", "待办3"],
  "shopping": [
    { "item": "物品名", "reason": "购买理由" }
  ],
  "tips": ["注意事项1", "注意事项2"],
  "forWife": ["为老婆做的事1", "为老婆做的事2"]
}

具体要求：
- todos: 3-5 条本周必做的事（产检、准备、学习等）
- shopping: 2-4 个本周建议购买的物品
- tips: 2-4 条本周需要注意的事项
- forWife: 2-3 条可以为老婆做的贴心小事`;

  const response = await chat([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `请生成孕${week}周的内容` },
  ]);

  try {
    let jsonStr = response;
    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) ||
                      response.match(/```\s*([\s\S]*?)\s*```/) ||
                      response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1] || jsonMatch[0];
    }
    return JSON.parse(jsonStr);
  } catch {
    // 返回默认内容
    return {
      todos: ['完成本周产检', '记录胎动情况', '准备待产物品'],
      shopping: [{ item: '叶酸', reason: '补充营养' }],
      tips: ['保持良好作息', '适当运动'],
      forWife: ['陪伴散步', '准备营养餐'],
    };
  }
}

/**
 * 将 AI 内容转换为 WeekItem 数组
 */
export function convertToWeekItems(content: AIWeekContent, week: number): Omit<WeekItem, 'id' | 'createdAt'>[] {
  const items: Omit<WeekItem, 'id' | 'createdAt'>[] = [];

  // 待办
  content.todos.forEach((todo) => {
    items.push({
      type: 'todo',
      content: todo,
      source: 'ai',
      completed: false,
      week,
    });
  });

  // 购物
  content.shopping.forEach((s) => {
    items.push({
      type: 'shopping',
      content: s.item,
      note: s.reason,
      source: 'ai',
      completed: false,
      week,
    });
  });

  // 注意
  content.tips.forEach((tip) => {
    items.push({
      type: 'tip',
      content: tip,
      source: 'ai',
      completed: false,
      week,
    });
  });

  // 为老婆
  content.forWife.forEach((item) => {
    items.push({
      type: 'forWife',
      content: item,
      source: 'ai',
      completed: false,
      week,
    });
  });

  return items;
}

/**
 * 解析小红书内容
 */
export interface ParsedXHSContent {
  summary: string;
  suggestedWeek: number | null;
  items: {
    type: ItemType;
    content: string;
    note?: string;
  }[];
}

export async function parseXiaohongshuContent(text: string, currentWeek: number): Promise<ParsedXHSContent> {
  const systemPrompt = `你是一个孕期内容分析助手。用户会粘贴从小红书复制的孕期相关内容。
请分析内容，提取有用的信息。

当前用户处于孕${currentWeek}周。

请返回以下 JSON 格式：
{
  "summary": "内容摘要（20字以内）",
  "suggestedWeek": 建议归类到哪一周（数字，如果无法判断则为 null），
  "items": [
    { "type": "todo/shopping/tip/forWife", "content": "提取的内容", "note": "备注（可选）" }
  ]
}

type 说明：
- todo: 需要做的事情
- shopping: 需要买的东西
- tip: 需要注意的事项
- forWife: 为老婆做的事

要求：
1. 只提取有价值的、可执行的内容
2. 每条内容简洁，不超过20字
3. 如果内容和孕期无关，返回空的 items 数组`;

  const response = await chat([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `请分析：\n\n${text}` },
  ]);

  try {
    let jsonStr = response;
    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) ||
                      response.match(/```\s*([\s\S]*?)\s*```/) ||
                      response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1] || jsonMatch[0];
    }
    return JSON.parse(jsonStr);
  } catch {
    return {
      summary: '解析失败',
      suggestedWeek: null,
      items: [],
    };
  }
}
