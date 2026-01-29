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
 * 生成孕周内容
 */
export async function generateWeekContent(week: number): Promise<string> {
  const systemPrompt = `你是一个专业的孕期顾问。请根据用户提供的孕周数，生成该周的详细指南。
请使用 JSON 格式返回，包含以下字段：
{
  "fetalSize": "宝宝大小比喻（如：像一个木瓜）",
  "fetalWeight": "体重（克）",
  "fetalLength": "身长（厘米）",
  "fetalEmoji": "代表宝宝大小的 emoji",
  "fetalDevelopment": "胎儿发育描述（100-150字）",
  "bodyChanges": ["身体变化1", "身体变化2", "身体变化3", "身体变化4"],
  "tips": ["注意事项1", "注意事项2", "注意事项3", "注意事项4"],
  "nutrition": ["饮食建议1", "饮食建议2", "饮食建议3", "饮食建议4"],
  "exercise": ["运动建议1", "运动建议2"],
  "checkups": ["需要做的产检项目"]
}
请确保内容准确、专业、温馨。`;

  const userPrompt = `请生成孕期第 ${week} 周的详细指南。`;

  return chat([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]);
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
