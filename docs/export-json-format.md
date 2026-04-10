# 报表详情导出 JSON 格式规范

本文档定义了报表详情导出的 JSON 格式，借鉴了 Grafana Dashboard 的设计理念。

---

## 一、完整 JSON 结构示例

```json
{
  "dashboard": {
    "uid": "business-system-uid",
    "title": "统一日志平台日报",
    "description": "系统运行状态监控报表",
    "tags": ["运维报表", "日志分析", "unified-log"],
    "style": "dark",
    "timezone": "browser",
    "editable": true,
    "graphTooltip": 1,
    "refresh": "1d",
    "time": {
      "from": "now-24h",
      "to": "now"
    },
    "timepicker": {
      "refresh_intervals": ["5m", "15m", "30m", "1h", "2h", "1d"],
      "nowDelay": "1m"
    },
    "templating": {
      "list": [
        {
          "name": "date",
          "type": "custom",
          "label": "报表日期",
          "current": {
            "value": "2024-01-15",
            "text": "2024-01-15"
          },
          "options": []
        },
        {
          "name": "systemId",
          "type": "custom",
          "label": "系统ID",
          "current": {
            "value": "business-system-uid",
            "text": "统一日志平台"
          },
          "options": []
        },
        {
          "name": "reportId",
          "type": "custom",
          "label": "报表ID",
          "current": {
            "value": "${systemId}-${date}",
            "text": "动态生成"
          },
          "options": []
        }
      ]
    },
    "annotations": {
      "list": []
    },
    "links": [],
    "panels": [
      {
        "id": "panel-summary-status",
        "title": "核心结论与风险",
        "description": "Executive Summary & Risks",
        "type": "summary_status",
        "datasource": {
          "type": "api",
          "uid": "panel-api",
          "endpoint": "/api/panel/summary",
          "method": "GET",
          "params": {
            "date": "${date}",
            "systemId": "${systemId}"
          }
        },
        "gridPos": {
          "x": 0,
          "y": 0,
          "w": 24,
          "h": 6
        },
        "fieldConfig": {
          "defaults": {
            "unit": "none",
            "thresholds": {
              "mode": "absolute",
              "steps": [
                { "color": "green", "value": null },
                { "color": "yellow", "value": 0.7 },
                { "color": "red", "value": 0.9 }
              ]
            }
          }
        },
        "options": {
          "showInsight": true,
          "showClusterInfo": true
        }
      },
      {
        "id": "panel-sla-metrics",
        "title": "SLA 核心指标",
        "description": "SLA Core Metrics",
        "type": "sla_metrics",
        "datasource": {
          "type": "api",
          "uid": "panel-api",
          "endpoint": "/api/panel/sla-metrics",
          "method": "GET",
          "params": {
            "date": "${date}",
            "systemId": "${systemId}"
          }
        },
        "gridPos": {
          "x": 0,
          "y": 6,
          "w": 24,
          "h": 8
        },
        "fieldConfig": {
          "defaults": {
            "unit": "percent",
            "thresholds": {
              "mode": "absolute",
              "steps": [
                { "color": "green", "value": null },
                { "color": "yellow", "value": 80 },
                { "color": "red", "value": 95 }
              ]
            }
          }
        },
        "options": {
          "showHealthStatus": true,
          "showThreshold": true
        }
      },
      {
        "id": "panel-cluster-metrics",
        "title": "集群核心指标明细",
        "description": "Cluster Core Metrics Detail",
        "type": "cluster_metrics",
        "datasource": {
          "type": "api",
          "uid": "panel-api",
          "endpoint": "/api/panel/cluster-metrics",
          "method": "GET",
          "params": {
            "date": "${date}",
            "systemId": "${systemId}"
          }
        },
        "gridPos": {
          "x": 0,
          "y": 14,
          "w": 24,
          "h": 10
        },
        "fieldConfig": {
          "defaults": {
            "unit": "short",
            "custom": {
              "align": "left"
            }
          }
        },
        "options": {
          "showTrend": true,
          "clusterTabs": ["wx", "nf"]
        }
      },
      {
        "id": "panel-region-traffic",
        "title": "云区域流量态势",
        "description": "Cloud Region Traffic Situational Awareness",
        "type": "region_traffic",
        "datasource": {
          "type": "api",
          "uid": "panel-api",
          "endpoint": "/api/panel/region-traffic",
          "method": "GET",
          "params": {
            "date": "${date}",
            "systemId": "${systemId}"
          }
        },
        "gridPos": {
          "x": 0,
          "y": 24,
          "w": 24,
          "h": 8
        },
        "fieldConfig": {
          "defaults": {
            "unit": "short"
          }
        },
        "options": {
          "showTopRegions": 5,
          "clusterTabs": ["wx", "nf"]
        }
      },
      {
        "id": "panel-assessment-action",
        "title": "评估与计划",
        "description": "Assessment & Planning",
        "type": "assessment_action",
        "datasource": {
          "type": "api",
          "uid": "panel-api",
          "endpoints": {
            "assessment": {
              "type": "api",
              "endpoint": "/api/panel/assessment",
              "method": "GET",
              "params": {
                "reportId": "${reportId}"
              }
            },
            "actionPlan": {
              "type": "api",
              "endpoint": "/api/panel/action-plan",
              "method": "GET",
              "params": {
                "reportId": "${reportId}"
              }
            }
          }
        },
        "gridPos": {
          "x": 0,
          "y": 32,
          "w": 24,
          "h": 10
        },
        "options": {
          "showInsight": true,
          "showPriority": true
        }
      }
    ],
    "clusters": {
      "wx_cluster": {
        "name": "威新集群",
        "name_en": "WX CLUSTER",
        "type": "wx",
        "description": "主要生产集群"
      },
      "nf_cluster": {
        "name": "南方集群",
        "name_en": "NF CLUSTER",
        "type": "nf",
        "description": "备用生产集群"
      }
    },
    "version": 1,
    "schemaVersion": 36
  },
  "overwrite": false
}
```

---

## 二、字段详解

### 2.1 Dashboard 顶层配置

| 字段 | 类型 | 必填 | 说明 | 示例值 |
|------|------|------|------|--------|
| `uid` | string | 是 | Dashboard 唯一标识符 | `"business-system-uid"` |
| `title` | string | 是 | Dashboard 标题 | `"统一日志平台日报"` |
| `description` | string | 否 | Dashboard 描述 | `"系统运行状态监控报表"` |
| `tags` | string[] | 否 | 标签数组，用于分类和搜索 | `["运维报表", "日志分析"]` |
| `style` | string | 否 | 主题风格：`dark` 或 `light` | `"dark"` |
| `timezone` | string | 否 | 时区设置：`browser` 或 `utc` | `"browser"` |
| `editable` | boolean | 否 | 是否可编辑 | `true` |
| `graphTooltip` | number | 否 | 提示行为：0/1/2 | `1` |
| `refresh` | string | 否 | 自动刷新间隔 | `"1d"` |
| `time` | object | 否 | 默认时间范围 | `{"from": "now-24h", "to": "now"}` |
| `timepicker` | object | 否 | 时间选择器配置 | 见下表 |
| `templating` | object | 否 | 模板变量配置 | 见下表 |
| `annotations` | object | 否 | 注释配置 | 见下表 |
| `links` | array | 否 | 外部链接数组 | 见下表 |
| `panels` | array | 是 | 面板配置数组 | 见下表 |
| `clusters` | object | 否 | 集群配置（自定义扩展） | 见下表 |
| `version` | number | 否 | Dashboard 版本号 | `1` |
| `schemaVersion` | number | 否 | Grafana Schema 版本 | `36` |

### 2.2 时间选择器 (`timepicker`)

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `refresh_intervals` | string[] | 否 | 刷新间隔选项 |
| `nowDelay` | string | 否 | 时间偏移，避免数据延迟 |

```json
{
  "timepicker": {
    "refresh_intervals": ["5m", "15m", "30m", "1h", "2h", "1d"],
    "nowDelay": "1m"
  }
}
```

### 2.3 模板变量 (`templating`)

模板变量允许创建动态的、可复用的 Dashboard。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | 是 | 变量名称，使用 `${name}` 引用 |
| `type` | string | 是 | 变量类型：`custom`、`query`、`constant`、`datasource`、`interval` |
| `label` | string | 否 | 变量显示名称 |
| `current` | object | 是 | 当前选中值 |
| `options` | array | 是 | 可选项列表 |

```json
{
  "templating": {
    "list": [
      {
        "name": "date",
        "type": "custom",
        "label": "报表日期",
        "current": {
          "value": "2024-01-15",
          "text": "2024-01-15"
        },
        "options": []
      },
      {
        "name": "systemId",
        "type": "custom",
        "label": "系统ID",
        "current": {
          "value": "business-system-uid",
          "text": "统一日志平台"
        },
        "options": []
      },
      {
        "name": "reportId",
        "type": "custom",
        "label": "报表ID",
        "current": {
          "value": "${systemId}-${date}",
          "text": "动态生成"
        },
        "options": []
      }
    ]
  }
}
```

### 2.4 面板配置 (`panels`)

每个面板是一个独立的图表或表格。

#### 通用字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | 是 | 面板唯一标识符 |
| `title` | string | 是 | 面板标题 |
| `description` | string | 否 | 面板描述 |
| `type` | string | 是 | 面板类型 |
| `datasource` | object | 是 | 数据源配置 |
| `gridPos` | object | 是 | 网格位置和大小 |
| `fieldConfig` | object | 否 | 字段配置 |
| `options` | object | 否 | 面板特定选项 |

#### 网格位置 (`gridPos`)

Grafana 使用 24 列网格系统。

| 字段 | 类型 | 说明 |
|------|------|------|
| `x` | number | 横向位置（0-23） |
| `y` | number | 纵向位置 |
| `w` | number | 宽度（1-24） |
| `h` | number | 高度（单位格） |

```json
{
  "gridPos": {
    "x": 0,
    "y": 0,
    "w": 24,
    "h": 6
  }
}
```

#### 数据源配置 (`datasource`)

**单一数据源：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `type` | string | 是 | 数据源类型：`api`、`prometheus`、`postgres` 等 |
| `uid` | string | 是 | 数据源唯一标识符 |
| `endpoint` | string | 是 | API 端点路径 |
| `method` | string | 否 | HTTP 方法：`GET` 或 `POST` |
| `params` | object | 否 | 查询参数，支持模板变量 |

```json
{
  "datasource": {
    "type": "api",
    "uid": "panel-api",
    "endpoint": "/api/panel/sla-metrics",
    "method": "GET",
    "params": {
      "date": "${date}",
      "systemId": "${systemId}"
    }
  }
}
```

**多数据源（复合面板）：**

```json
{
  "datasource": {
    "type": "api",
    "uid": "panel-api",
    "endpoints": {
      "assessment": {
        "type": "api",
        "endpoint": "/api/panel/assessment",
        "method": "GET",
        "params": {
          "reportId": "${reportId}"
        }
      },
      "actionPlan": {
        "type": "api",
        "endpoint": "/api/panel/action-plan",
        "method": "GET",
        "params": {
          "reportId": "${reportId}"
        }
      }
    }
  }
}
```

#### 字段配置 (`fieldConfig`)

| 字段 | 类型 | 说明 |
|------|------|------|
| `defaults.unit` | string | 单位：`percent`、`short`、`bytes`、`none` 等 |
| `defaults.thresholds` | object | 阈值配置 |
| `defaults.custom` | object | 自定义配置 |

```json
{
  "fieldConfig": {
    "defaults": {
      "unit": "percent",
      "thresholds": {
        "mode": "absolute",
        "steps": [
          { "color": "green", "value": null },
          { "color": "yellow", "value": 80 },
          { "color": "red", "value": 95 }
        ]
      },
      "custom": {
        "align": "left"
      }
    }
  }
}
```

### 2.5 集群配置 (`clusters`)

自定义扩展字段，用于存储集群信息。

```json
{
  "clusters": {
    "wx_cluster": {
      "name": "威新集群",
      "name_en": "WX CLUSTER",
      "type": "wx",
      "description": "主要生产集群"
    },
    "nf_cluster": {
      "name": "南方集群",
      "name_en": "NF CLUSTER",
      "type": "nf",
      "description": "备用生产集群"
    }
  }
}
```

### 2.6 导入控制 (`overwrite`)

`overwrite` 字段用于控制导入时的行为：

| 值 | 说明 |
|------|------|
| `false` 或不设置 | 如果 UID 已存在，则报错或提示 |
| `true` | 如果 UID 已存在，则覆盖现有 Dashboard |

**重要说明：**
- 导出的 JSON **不包含** `overwrite` 字段
- 用户在导入时通过界面选择是否覆盖
- 前端会根据用户选择动态设置 `overwrite` 字段并发送给后端

**导入流程：**
```
1. 用户上传 JSON 文件
   ↓
2. 前端解析 JSON，检测 UID 是否存在
   ↓
3. 显示导入选项：
   - 创建新副本（删除 UID，创建新报表）
   - 覆盖更新（保留 UID，更新现有报表）
   ↓
4. 用户选择后，前端设置 overwrite 字段
   ↓
5. 发送请求到后端执行导入
```

---

## 三、面板类型定义

### 3.1 summary_status - 核心结论与风险面板

显示系统整体状态和关键结论。

```json
{
  "id": "panel-summary-status",
  "title": "核心结论与风险",
  "description": "Executive Summary & Risks",
  "type": "summary_status",
  "datasource": {
    "type": "api",
    "uid": "panel-api",
    "endpoint": "/api/panel/summary",
    "method": "GET",
    "params": {
      "date": "${date}",
      "systemId": "${systemId}"
    }
  },
  "gridPos": { "x": 0, "y": 0, "w": 24, "h": 6 },
  "options": {
    "showInsight": true,
    "showClusterInfo": true
  }
}
```

### 3.2 sla_metrics - SLA 核心指标面板

显示 SLA 相关的核心指标。

```json
{
  "id": "panel-sla-metrics",
  "title": "SLA 核心指标",
  "description": "SLA Core Metrics",
  "type": "sla_metrics",
  "datasource": {
    "type": "api",
    "uid": "panel-api",
    "endpoint": "/api/panel/sla-metrics",
    "method": "GET",
    "params": {
      "date": "${date}",
      "systemId": "${systemId}"
    }
  },
  "gridPos": { "x": 0, "y": 6, "w": 24, "h": 8 },
  "fieldConfig": {
    "defaults": {
      "unit": "percent",
      "thresholds": {
        "mode": "absolute",
        "steps": [
          { "color": "green", "value": null },
          { "color": "yellow", "value": 80 },
          { "color": "red", "value": 95 }
        ]
      }
    }
  },
  "options": {
    "showHealthStatus": true,
    "showThreshold": true
  }
}
```

### 3.3 cluster_metrics - 集群核心指标面板

显示各集群的详细指标数据。

```json
{
  "id": "panel-cluster-metrics",
  "title": "集群核心指标明细",
  "description": "Cluster Core Metrics Detail",
  "type": "cluster_metrics",
  "datasource": {
    "type": "api",
    "uid": "panel-api",
    "endpoint": "/api/panel/cluster-metrics",
    "method": "GET",
    "params": {
      "date": "${date}",
      "systemId": "${systemId}"
    }
  },
  "gridPos": { "x": 0, "y": 14, "w": 24, "h": 10 },
  "options": {
    "showTrend": true,
    "clusterTabs": ["wx", "nf"]
  }
}
```

### 3.4 region_traffic - 云区域流量面板

显示各云区域的流量分布情况。

```json
{
  "id": "panel-region-traffic",
  "title": "云区域流量态势",
  "description": "Cloud Region Traffic Situational Awareness",
  "type": "region_traffic",
  "datasource": {
    "type": "api",
    "uid": "panel-api",
    "endpoint": "/api/panel/region-traffic",
    "method": "GET",
    "params": {
      "date": "${date}",
      "systemId": "${systemId}"
    }
  },
  "gridPos": { "x": 0, "y": 24, "w": 24, "h": 8 },
  "options": {
    "showTopRegions": 5,
    "clusterTabs": ["wx", "nf"]
  }
}
```

### 3.5 assessment_action - 评估与计划面板

显示系统评估和行动计划。

```json
{
  "id": "panel-assessment-action",
  "title": "评估与计划",
  "description": "Assessment & Planning",
  "type": "assessment_action",
  "datasource": {
    "type": "api",
    "uid": "panel-api",
    "endpoints": {
      "assessment": {
        "type": "api",
        "endpoint": "/api/panel/assessment",
        "method": "GET",
        "params": {
          "reportId": "${reportId}"
        }
      },
      "actionPlan": {
        "type": "api",
        "endpoint": "/api/panel/action-plan",
        "method": "GET",
        "params": {
          "reportId": "${reportId}"
        }
      }
    }
  },
  "gridPos": { "x": 0, "y": 32, "w": 24, "h": 10 },
  "options": {
    "showInsight": true,
    "showPriority": true
  }
}
```

---

## 四、模板变量使用

### 4.1 支持的模板变量

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `${date}` | 当前选择的日期 | `2024-01-15` |
| `${systemId}` | 当前系统ID | `business-system-uid` |
| `${reportId}` | 报表ID（格式：`${systemId}-${date}`） | `business-system-uid-2024-01-15` |

### 4.2 使用示例

```json
{
  "datasource": {
    "type": "api",
    "endpoint": "/api/panel/sla-metrics",
    "method": "GET",
    "params": {
      "date": "${date}",
      "systemId": "${systemId}"
    }
  }
}
```

前端在渲染时会自动替换这些变量：

```typescript
const resolvedParams = {
  date: "2024-01-15",
  systemId: "business-system-uid",
  reportId: "business-system-uid-2024-01-15"
};
```

---

## 五、配置与数据分离原则

### 5.1 核心原则

**导出的 JSON 只包含配置，不包含实际数据。**

- ✅ **包含**：面板布局、数据源引用、查询参数、样式配置
- ❌ **不包含**：实际的数据快照、查询结果

### 5.2 数据获取流程

```
1. 导入 JSON 配置
   ↓
2. 创建 Dashboard（新 UID 或更新现有）
   ↓
3. 保存配置：
   - 面板布局
   - 数据源引用
   - 查询参数
   ↓
4. 用户打开 Dashboard
   ↓
5. 前端执行查询：
   - 读取数据源配置
   - 替换模板变量
   - 发送 API 请求
   ↓
6. 渲染面板显示数据
```

### 5.3 数据源引用示例

```json
{
  "datasource": {
    "type": "api",
    "uid": "panel-api",
    "endpoint": "/api/panel/sla-metrics",
    "method": "GET",
    "params": {
      "date": "${date}",
      "systemId": "${systemId}"
    }
  }
}
```

**说明：**
- `endpoint`：API 端点路径
- `params`：查询参数（支持模板变量）
- 实际数据在打开 Dashboard 时通过 API 实时获取

---

## 六、导入导出机制

### 6.1 导出流程

```
用户点击导出
   ↓
后端构建 JSON：
   - 读取系统信息
   - 读取集群配置
   - 生成面板配置
   ↓
返回 JSON 给前端
   ↓
前端显示预览
   ↓
用户下载 JSON 文件
```

### 6.2 导入流程

```
用户上传 JSON
   ↓
后端解析 JSON：
   - 验证格式
   - 检查 schema 版本
   ↓
检查 UID 是否存在
   ↓
┌─────────────────────────────────────┐
│  UID 存在 + overwrite=false         │ → 报错/提示已存在
│  UID 存在 + overwrite=true          │ → 覆盖更新
│  UID 不存在                          │ → 创建新 Dashboard
│  JSON 中无 UID                       │ → 自动生成新 UID，创建新 Dashboard
└─────────────────────────────────────┘
   ↓
保存到数据库：
   - 创建/更新 business_systems 记录
   - 创建/更新 clusters 记录
   - 保存面板配置到 datasource_reference
   ↓
返回导入结果
```

### 6.3 UID 作用

**UID 是 Dashboard 的主键标识符。**

- 相同 UID + `overwrite=false` → 报错
- 相同 UID + `overwrite=true` → 覆盖
- 不同 UID 或无 UID → 新增

**通过控制 UID，可以实现：**
1. 从同一个模板创建多个相似的 Dashboard
2. 版本管理和回滚
3. 环境迁移

---

## 七、最佳实践

### 7.1 导出前检查

- [ ] 确保所有面板都有正确的数据源配置
- [ ] 验证模板变量引用是否正确
- [ ] 检查集群配置是否完整

### 7.2 导入前检查

- [ ] 验证 JSON 格式是否正确
- [ ] 检查 schema 版本兼容性
- [ ] 确认数据源 UID 是否存在
- [ ] 评估是否需要覆盖现有 Dashboard

### 7.3 版本管理

- 将导出的 JSON 纳入版本控制系统
- 使用有意义的文件命名：`dashboard-{name}-{date}.json`
- 保留历史版本以便回滚

### 7.4 模板化建议

- 使用模板变量提高复用性
- 为常用配置创建模板库
- 文档化模板的使用方法

---

## 八、TypeScript 类型定义

```typescript
/**
 * Dashboard 配置
 */
export interface GrafanaDashboard {
  uid: string;
  title: string;
  description?: string;
  tags?: string[];
  style?: 'dark' | 'light';
  timezone?: 'browser' | 'utc';
  editable?: boolean;
  graphTooltip?: 0 | 1 | 2;
  refresh?: string;
  time?: {
    from: string;
    to: string;
  };
  timepicker?: {
    refresh_intervals?: string[];
    nowDelay?: string;
  };
  templating?: {
    list: GrafanaTemplatingVariable[];
  };
  annotations?: {
    list: GrafanaAnnotation[];
  };
  links?: GrafanaLink[];
  panels: GrafanaPanel[];
  clusters?: {
    wx_cluster: ExportClusterConfig | null;
    nf_cluster: ExportClusterConfig | null;
  };
  version?: number;
  schemaVersion?: number;
}

/**
 * 模板变量
 */
export interface GrafanaTemplatingVariable {
  name: string;
  type: 'custom' | 'query' | 'constant' | 'datasource' | 'interval';
  label?: string;
  current: {
    value: string;
    text: string;
  };
  options: any[];
}

/**
 * 注释配置
 */
export interface GrafanaAnnotation {
  name: string;
  type: 'dashboard' | 'alert' | 'annotation';
  datasource?: {
    type: string;
    uid: string;
  };
  expr?: string;
  step?: string;
  titleFormat?: string;
  textFormat?: string;
}

/**
 * 链接配置
 */
export interface GrafanaLink {
  title: string;
  url: string;
  type: 'link' | 'dashboards';
  targetBlank?: boolean;
}

/**
 * 面板配置
 */
export interface GrafanaPanel {
  id: string;
  title: string;
  description?: string;
  type: 'summary_status' | 'sla_metrics' | 'cluster_metrics' | 'region_traffic' | 'assessment_action';
  datasource: GrafanaPanelDatasource;
  gridPos: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  fieldConfig?: {
    defaults?: {
      unit?: string;
      thresholds?: {
        mode: 'absolute' | 'percentage';
        steps: Array<{
          color: string;
          value: number | null;
        }>;
      };
      custom?: Record<string, any>;
    };
    overrides?: any[];
  };
  options?: Record<string, any>;
  targets?: any[];
  transparent?: boolean;
}

/**
 * 面板数据源配置
 */
export interface GrafanaPanelDatasource {
  type: 'api' | 'prometheus' | 'postgres' | 'mysql';
  uid: string;
  endpoint?: string;
  method?: 'GET' | 'POST';
  params?: Record<string, any>;
  endpoints?: {
    assessment?: GrafanaPanelDatasource;
    actionPlan?: GrafanaPanelDatasource;
  };
}

/**
 * 集群配置
 */
export interface ExportClusterConfig {
  name: string;
  name_en: string;
  type: 'wx' | 'nf';
  description?: string;
}

/**
 * 完整的导出 JSON 结构
 */
export interface ExportJSON {
  dashboard: GrafanaDashboard;
  overwrite?: boolean;
}
```

---

## 九、API 端点规范

### 9.1 Panel 数据 API

所有 Panel 数据 API 应遵循统一的响应格式：

**请求：**
```
GET /api/panel/{panel-type}?date={date}&systemId={systemId}
```

**响应：**
```json
{
  "success": true,
  "data": {
    // 面板数据
  }
}
```

### 9.2 已实现的 API 端点

| 端点 | 方法 | 参数 | 说明 |
|------|------|------|------|
| `/api/panel/summary` | GET | `date`, `systemId` | 核心结论与风险 |
| `/api/panel/sla-metrics` | GET | `date`, `systemId` | SLA 核心指标 |
| `/api/panel/cluster-metrics` | GET | `date`, `systemId` | 集群核心指标明细 |
| `/api/panel/region-traffic` | GET | `date`, `systemId` | 云区域流量态势 |
| `/api/panel/assessment` | GET | `reportId` | 系统评估 |
| `/api/panel/action-plan` | GET | `reportId` | 行动计划 |

---

## 十、常见问题

### Q1: 为什么导出的 JSON 没有包含实际数据？

**A:** 遵循配置与数据分离原则。导出的 JSON 只包含配置信息（面板布局、数据源引用、查询参数），实际数据在打开 Dashboard 时通过 API 实时获取。这样做的好处是：
- JSON 文件体积小
- 数据始终是最新的
- 可以从同一个模板创建多个 Dashboard

### Q2: 如何从同一个模板创建多个 Dashboard？

**A:** 导出 JSON 后，修改 `uid` 字段为新的值，然后导入。系统会认为这是一个新的 Dashboard。

### Q3: 导入时提示 UID 已存在怎么办？

**A:** 有两种选择：
1. 修改 JSON 中的 `uid` 为新的值
2. 设置 `overwrite: true` 来覆盖现有 Dashboard

### Q4: 模板变量如何使用？

**A:** 在数据源配置的 `params` 中使用 `${variableName}` 格式引用模板变量。前端在渲染时会自动替换这些变量为实际值。

### Q5: 如何添加新的面板类型？

**A:** 
1. 在 TypeScript 类型定义中添加新的面板类型
2. 创建对应的 Panel 组件
3. 在导出 API 中添加面板配置
4. 在前端渲染逻辑中添加对应的 case

---

## 十一、与 Grafana 的差异

### 11.1 借鉴的设计理念

我们从 Grafana 借鉴了以下设计理念：

✅ **UID 标识机制** - 使用 UID 作为唯一标识符  
✅ **配置与数据分离** - JSON 只包含配置，数据实时获取  
✅ **模板变量** - 支持 `${variable}` 语法  
✅ **网格布局** - 使用 `gridPos` 进行面板定位  
✅ **字段配置** - 使用 `fieldConfig` 定义单位和阈值  
✅ **时间选择器** - 支持 `timepicker` 和 `time` 配置  
✅ **导入导出机制** - 通过 `overwrite` 控制覆盖行为  

### 11.2 自定义扩展

我们根据业务需求做了以下自定义扩展：

🔧 **自定义面板类型** - 针对报表场景的面板类型  
🔧 **API 数据源** - 简化的 REST API 数据源配置  
🔧 **集群配置** - 业务特定的集群信息  
🔧 **模板变量简化** - 只保留必要的变量类型  

---

## 十二、更新日志

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| 2.0.0 | 2024-01-15 | 移除 `__meta` 字段，简化 JSON 结构 |
| 1.0.0 | 2024-01-01 | 初始版本，借鉴 Grafana 设计理念 |
