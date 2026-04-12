import axios from 'axios';

const GLM_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const GLM_API_KEY = process.env.GLM_API_KEY || '';

console.log('[GLM Service] API Key configured:', GLM_API_KEY ? `Yes (${GLM_API_KEY.substring(0, 8)}...)` : 'No - using simulation');

export interface GLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GLMRequest {
  model: string;
  messages: GLMMessage[];
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface GLMResponse {
  id: string;
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
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface PanelModification {
  panelId: string;
  field: string;
  oldValue: any;
  newValue: any;
  description: string;
}

export interface AIResponse {
  success: boolean;
  message: string;
  modifications?: PanelModification[];
  code?: string;
}

const SYSTEM_PROMPT = `你是一个专业的报表模板配置助手，帮助用户通过自然语言修改报表模板。

## 核心能力
1. 理解用户的自然语言修改需求
2. 将需求转换为具体的配置修改操作
3. 保持配置格式一致，遵循最佳实践

## 支持的修改类型

### 1. 标题修改
用户输入: "将标题改为 XXX" / "修改标题为 XXX"
返回格式: 在回复中明确说明 "已将标题修改为「XXX」"

### 2. 描述修改
用户输入: "修改描述为 XXX" / "添加描述 XXX"
返回格式: 在回复中明确说明 "已将描述修改为「XXX」"

### 3. 数据源修改
用户输入: "修改数据源地址为 /api/xxx" / "更改 API 端点"
返回格式: 在回复中明确说明 "已将数据源地址修改为 /api/xxx"

### 4. 参数修改
用户输入: "添加参数 date" / "修改参数 systemId"
返回格式: 在回复中明确说明修改的参数

### 5. 删除面板
用户输入: "删除此面板" / "移除这个模块"
返回格式: 在回复中明确说明 "已删除面板「XXX」"

### 6. 样式修改
用户输入: "修改背景色为蓝色" / "调整宽度"
返回格式: 在回复中明确说明样式修改

## 回复规则
- 用简洁的中文回复
- 明确说明修改了什么
- 如果无法理解需求，询问用户具体要修改什么
- 如果需要更多信息，引导用户提供`;

export async function callGLM5(
  userMessage: string,
  selectedPanel?: {
    id: string;
    title: string;
    type: string;
  },
  conversationHistory: GLMMessage[] = []
): Promise<AIResponse> {
  if (!GLM_API_KEY) {
    return simulateAIResponse(userMessage, selectedPanel);
  }

  try {
    const messages: GLMMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory,
    ];

    if (selectedPanel) {
      messages.push({
        role: 'user',
        content: `用户选中了「${selectedPanel.title}」面板（类型：${selectedPanel.type}，ID：${selectedPanel.id}）。

用户需求：${userMessage}

请根据用户需求修改选中的面板，用简洁的中文说明修改内容。`,
      });
    } else {
      messages.push({
        role: 'user',
        content: userMessage,
      });
    }

    const request: GLMRequest = {
      model: 'GLM-5',
      messages,
      temperature: 0.7,
      max_tokens: 2000,
      stream: false,
    };

    console.log('[GLM Service] Sending request to GLM-5...');
    
    const response = await axios.post<GLMResponse>(GLM_API_URL, request, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GLM_API_KEY}`,
      },
    });

    const content = response.data.choices[0]?.message?.content || '';
    console.log('[GLM Service] Response:', content);

    return {
      success: true,
      message: content,
      modifications: parseModifications(content, selectedPanel?.id, selectedPanel?.title),
    };
  } catch (error: any) {
    console.error('GLM API error:', error.response?.data || error.message);
    return simulateAIResponse(userMessage, selectedPanel);
  }
}

function parseModifications(content: string, panelId?: string, panelTitle?: string): PanelModification[] {
  const modifications: PanelModification[] = [];
  
  if (!panelId) return modifications;

  const titleMatch = content.match(/标题[改为修改成设置]+[「"']?([^「"'"」\n]+)[」"']?/);
  if (titleMatch) {
    modifications.push({
      panelId,
      field: 'title',
      oldValue: panelTitle,
      newValue: titleMatch[1].trim(),
      description: `标题修改为「${titleMatch[1].trim()}」`,
    });
  }

  const descMatch = content.match(/描述[改为修改成设置]+[「"']?([^「"'"」\n]+)[」"']?/);
  if (descMatch) {
    modifications.push({
      panelId,
      field: 'description',
      oldValue: null,
      newValue: descMatch[1].trim(),
      description: `描述修改为「${descMatch[1].trim()}」`,
    });
  }

  const endpointMatch = content.match(/(?:数据源|API|端点|接口)[地址]*[改为修改成设置]+[「"']?([^「"'"」\s\n]+)[」"']?/);
  if (endpointMatch) {
    modifications.push({
      panelId,
      field: 'endpoint',
      oldValue: null,
      newValue: endpointMatch[1].trim(),
      description: `数据源地址修改为「${endpointMatch[1].trim()}」`,
    });
  }

  const deleteMatch = content.match(/已[删除移除]/);
  if (deleteMatch) {
    modifications.push({
      panelId,
      field: 'remove',
      oldValue: null,
      newValue: null,
      description: `删除面板「${panelTitle || panelId}」`,
    });
  }

  return modifications;
}

function simulateAIResponse(
  userMessage: string,
  selectedPanel?: {
    id: string;
    title: string;
    type: string;
  }
): AIResponse {
  const msg = userMessage.toLowerCase();

  if (msg.includes('标题') && selectedPanel) {
    const titleMatch = userMessage.match(/(?:改为|改成|修改为|设为|设置为|叫做)[「"']?([^「"'"」\n]+)/);
    const newTitle = titleMatch?.[1]?.trim();

    if (newTitle) {
      return {
        success: true,
        message: `已将「${selectedPanel.title}」的标题修改为「${newTitle}」，预览已实时更新。`,
        modifications: [
          {
            panelId: selectedPanel.id,
            field: 'title',
            oldValue: selectedPanel.title,
            newValue: newTitle,
            description: `标题 → ${newTitle}`,
          },
        ],
      };
    }

    return {
      success: true,
      message: `请告诉我您想将「${selectedPanel.title}」的标题修改为什么？例如："将标题改为 系统运行概览"`,
    };
  }

  if (msg.includes('描述') && selectedPanel) {
    const descMatch = userMessage.match(/(?:改为|改成|修改为|设为|设置为)[「"']?([^「"'"」\n]+)/);
    const newDesc = descMatch?.[1]?.trim();

    if (newDesc) {
      return {
        success: true,
        message: `已将「${selectedPanel.title}」的描述修改为「${newDesc}」。`,
        modifications: [
          {
            panelId: selectedPanel.id,
            field: 'description',
            oldValue: null,
            newValue: newDesc,
            description: `描述 → ${newDesc}`,
          },
        ],
      };
    }

    return {
      success: true,
      message: `请告诉我您想将「${selectedPanel.title}」的描述修改为什么？`,
    };
  }

  if (msg.includes('删除') || msg.includes('移除')) {
    if (selectedPanel) {
      return {
        success: true,
        message: `已将「${selectedPanel.title}」从报表中移除。如需恢复，可点击顶部的撤销按钮。`,
        modifications: [
          {
            panelId: selectedPanel.id,
            field: 'remove',
            oldValue: null,
            newValue: null,
            description: `移除面板「${selectedPanel.title}」`,
          },
        ],
      };
    }
    return {
      success: true,
      message: '请先选中要删除的面板，然后告诉我删除。',
    };
  }

  if (msg.includes('添加') || msg.includes('新增')) {
    let panelType = '自定义模块';
    if (msg.includes('图表')) panelType = '图表模块';
    else if (msg.includes('指标')) panelType = '指标卡模块';
    else if (msg.includes('表格')) panelType = '数据表模块';

    return {
      success: true,
      message: `已添加新的「${panelType}」。您可以在预览中拖拽调整位置，或选中后继续对话修改内容。`,
      modifications: [
        {
          panelId: `new-${Date.now()}`,
          field: 'add',
          oldValue: null,
          newValue: { type: panelType },
          description: `新增${panelType}`,
        },
      ],
    };
  }

  if (msg.includes('数据源') || msg.includes('api') || msg.includes('接口')) {
    if (selectedPanel) {
      const endpointMatch = userMessage.match(/(?:改为|改成|修改为|设为|设置为)[「"']?([^「"'"」\s\n]+)/);
      const newEndpoint = endpointMatch?.[1]?.trim();

      if (newEndpoint) {
        return {
          success: true,
          message: `已将「${selectedPanel.title}」的数据源地址修改为「${newEndpoint}」。`,
          modifications: [
            {
              panelId: selectedPanel.id,
              field: 'endpoint',
              oldValue: null,
              newValue: newEndpoint,
              description: `数据源 → ${newEndpoint}`,
            },
          ],
        };
      }

      return {
        success: true,
        message: `当前面板「${selectedPanel.title}」的数据源信息：
- 类型：${selectedPanel.type}
- 端点：/api/panel/${selectedPanel.type.replace('_', '-')}

您可以告诉我新的数据源地址，例如："修改数据源为 /api/custom-data"`,
      };
    }
    return {
      success: true,
      message: '请先选中要修改数据源的面板。',
    };
  }

  if (selectedPanel) {
    return {
      success: true,
      message: `您选中了「${selectedPanel.title}」面板。我可以帮您进行以下调整：

1. **修改标题** — 例如 "将标题改为 XXX"
2. **修改描述** — 例如 "修改描述为 XXX"
3. **修改数据源** — 例如 "修改数据源为 /api/xxx"
4. **删除面板** — 例如 "删除这个面板"

请描述您的修改需求，预览将实时更新。`,
    };
  }

  return {
    success: true,
    message: `您好！我是 GLM-5 报表助手，可以帮您实时调整报表模板：

1. **选中面板** — 在左侧预览中点击任意可编辑面板
2. **描述修改** — 告诉我您想调整的内容
3. **实时预览** — 修改会立即反映在左侧预览中

您也可以直接说：
- "添加一个图表模块"
- "添加一个指标卡"
- "添加一个数据表"

注意：「核心结论与风险」和「评估与计划」为固定模块，不可修改。`,
  };
}

export default {
  callGLM5,
};
