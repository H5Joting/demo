# 运维报表平台

## 项目概述

本系统是一个企业级运维报表平台，支持自定义巡检模板、生成巡检报表。。系统采用前后端分离架构，使用现代化的技术栈构建。

### 主要功能

- **SLA 核心指标监控**: 实时监控 Collector EPS、Kafka 写入流量、磁盘使用率、CPU 使用率等关键指标
- **集群核心指标明细**: 支持威新集群和南方集群的详细指标对比分析
- **云区域流量态势**: 可视化展示各云区域的流量分布和健康状态

## 技术栈

### 后端

- **Node.js** + **Express** - Web 服务框架
- **TypeScript** - 类型安全的 JavaScript
- **Supabase** - PostgreSQL 数据库服务
- **Zod** - 数据验证

### 前端

- **React 18** - UI 框架
- **Vite** - 构建工具
- **Ant Design 5** - UI 组件库
- **TypeScript** - 类型安全
- **React Router** - 路由管理
- **Axios** - HTTP 客户端
- **ECharts** - 图表库
- **Day.js** - 日期处理
- **SCSS** - 样式预处理

### 数据库

- **PostgreSQL** (via Supabase)
- **Row Level Security** - 数据安全

## 项目结构

```
demo/
├── backend/                    # 后端服务
│   ├── src/
│   │   ├── index.ts           # 入口文件
│   │   ├── database/          # 数据库配置
│   │   ├── routes/            # API 路由
│   │   └── types/             # 类型定义
│   ├── supabase/
│   │   └── migrations/        # 数据库迁移脚本
│   ├── package.json
│   └── tsconfig.json
├── frontend/                   # 前端应用
│   ├── src/
│   │   ├── main.tsx           # 入口文件
│   │   ├── App.tsx            # 应用组件
│   │   ├── api/               # API 接口
│   │   ├── components/        # 组件
│   │   │   ├── Dashboard/     # 仪表盘组件
│   │   │   └── Header.tsx     # 头部组件
│   │   ├── context/           # React Context
│   │   ├── pages/             # 页面组件
│   │   ├── styles/            # 全局样式
│   │   └── types/             # 类型定义
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── package.json               # 根 package.json (workspaces)
└── README.md
```

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装依赖

```bash
# 安装所有依赖
npm install
```

### 环境配置

1. 在 `backend/` 目录下创建 `.env` 文件:

```env
PORT=3001
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

1. 在 Supabase 中执行数据库迁移脚本:
   - 依次执行 `backend/supabase/migrations/` 目录下的 SQL 文件

### 启动开发服务器

```bash
# 同时启动前后端开发服务器
npm run dev

# 或者分别启动
npm run dev:backend   # 启动后端 (http://localhost:3001)
npm run dev:frontend  # 启动前端 (http://localhost:5173)
```

### 构建生产版本

```bash
npm run build
```

## API 接口

### 获取仪表盘数据

```
GET /api/dashboard/:date
```

### 获取可用日期列表

```
GET /api/dates
```

## 数据库表结构

- **clusters** - 集群信息表
- **daily\_reports** - 日报表
- **log\_metrics** - 日志指标表
- **cloud\_regions** - 云区域表
- **assessments** - 评估表
- **action\_plans** - 行动计划表

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request。
