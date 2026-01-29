/**
 * AI 服务配置
 */
const AI_CONFIG = {
  baseUrl: 'https://cerebras-proxy.brain.loocaa.com:1443/v1',
  apiKey: 'DlJYSkMVj1x4zoe8jZnjvxfHG6z5yGxK',
  model: 'qwen-3-235b-a22b-instruct-2507',
};

/**
 * AI 消息接口
 */
interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * AI 响应接口
 */
interface ChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
}

/**
 * 调用 AI 接口
 */
export async function chat(messages: ChatMessage[]): Promise<string> {
  const response = await fetch(`${AI_CONFIG.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${AI_CONFIG.apiKey}`,
    },
    body: JSON.stringify({
      model: AI_CONFIG.model,
      messages,
    }),
  });

  if (!response.ok) {
    throw new Error(`AI 请求失败: ${response.status}`);
  }

  const data: ChatResponse = await response.json();
  return data.choices[0]?.message?.content || '';
}

/**
 * 孕周内容结构
 */
export interface WeekContentData {
  fetalSize: string;
  fetalWeight: string;
  fetalLength: string;
  fetalDevelopment: string;
  keyPoints: string[];
  checkups: { name: string; important: boolean }[];
  shopping: { name: string; reason: string }[];
  nutrition: string[];
  warnings: string[];
}

/**
 * 生成孕周内容
 */
export async function generateWeekContent(week: number): Promise<WeekContentData> {
  const systemPrompt = `你是一个专业的孕期顾问。请根据用户提供的孕周数，生成该周的完整指南。

请严格使用以下 JSON 格式返回（不要添加任何其他文字）：
{
  "fetalSize": "宝宝大小比喻（如：木瓜、柚子等）",
  "fetalWeight": "体重数字（克，纯数字）",
  "fetalLength": "身长数字（厘米，纯数字）",
  "fetalDevelopment": "胎儿发育描述（80-120字，描述本周宝宝的发育重点）",
  "keyPoints": ["本周注意事项1", "注意事项2", "注意事项3", "注意事项4"],
  "checkups": [
    { "name": "产检项目名称", "important": true或false }
  ],
  "shopping": [
    { "name": "建议购买物品", "reason": "购买理由" }
  ],
  "nutrition": ["饮食建议1", "饮食建议2", "饮食建议3"],
  "warnings": ["需要警惕的症状1", "症状2"]
}

注意：
1. 内容必须准确、专业，基于医学常识
2. keyPoints 提供 4 条最重要的本周注意事项
3. checkups 只列出本周需要做的产检，没有就返回空数组
4. shopping 推荐 2-3 个本周适合购买的物品
5. nutrition 提供 3 条饮食建议
6. warnings 列出需要警惕就医的症状`;

  const userPrompt = `请生成孕期第 ${week} 周的详细指南。`;

  const response = await chat([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]);

  // 解析 JSON 响应
  try {
    // 尝试提取 JSON 部分（处理可能的 markdown 代码块）
    let jsonStr = response;
    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) || 
                      response.match(/```\s*([\s\S]*?)\s*```/) ||
                      response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1] || jsonMatch[0];
    }
    return JSON.parse(jsonStr);
  } catch {
    // 如果解析失败，返回默认数据
    console.error('AI 响应解析失败:', response);
    return {
      fetalSize: '未知',
      fetalWeight: '0',
      fetalLength: '0',
      fetalDevelopment: 'AI 生成内容解析失败，请重试。',
      keyPoints: ['请重新生成内容'],
      checkups: [],
      shopping: [],
      nutrition: [],
      warnings: [],
    };
  }
}

/**
 * 提取小红书内容
 */
export async function extractXiaohongshuContent(content: string): Promise<string> {
  const systemPrompt = `你是一个内容提取助手。请从用户提供的小红书文章内容中提取孕期相关信息。
请使用 JSON 格式返回，包含以下字段：
{
  "title": "文章标题",
  "stage": "所属阶段（early/middle/late/hospital）",
  "targetWeek": 具体孕周数（如果能识别，否则为 null）,
  "products": [
    { "name": "产品名称", "description": "产品描述" }
  ],
  "tips": ["注意事项1", "注意事项2"],
  "experiences": ["经验分享1", "经验分享2"],
  "tags": ["标签1", "标签2"]
}
请准确提取信息，不要编造内容。`;

  const userPrompt = `请从以下小红书文章中提取孕期相关信息：

${content}`;

  return chat([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]);
}

/**
 * 生成 AI 购物推荐
 */
export async function generateShoppingRecommendation(
  week: number,
  stage: string
): Promise<string> {
  const systemPrompt = `你是一个孕期购物顾问。请根据当前孕周和阶段，推荐需要购买的物品。
请使用 JSON 格式返回，包含以下字段：
{
  "items": [
    { "name": "物品名称", "reason": "推荐理由", "priority": "high/medium/low" }
  ]
}
请推荐 3-5 个最重要的物品。`;

  const userPrompt = `当前孕期第 ${week} 周，处于${stage}，请推荐需要购买的物品。`;

  return chat([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]);
}
