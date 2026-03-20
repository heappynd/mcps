# Agent 开发指南

本文档为在此代码库中工作的 Agent 提供指导规范。

## 项目概述

这是一个基于 xmcp（Model Context Protocol）的应用程序，提供字符集转换工具。项目使用 TypeScript 和 xmcp 框架。

## 构建、运行和测试命令

### 安装依赖
```bash
pnpm install
# 或 npm install
```

### 开发模式
```bash
pnpm run dev
```
以热重载模式启动 MCP 服务器。

### 构建生产版本
```bash
pnpm run build
```
使用 `xmcp build` 将 TypeScript 编译到 `dist/` 目录。

### 运行生产版本
```bash
pnpm run start
```
运行编译后的 STDIO 服务器：`node dist/stdio.js`

### 运行单个测试
本项目未配置测试命令。如需测试，需添加测试框架（如 Vitest、Jest）。

### 代码检查
未配置 lint 命令。如有需要可添加 ESLint。

## 代码风格规范

### 语言和编译
- 语言：TypeScript（tsconfig.json 已启用 strict 模式）
- 目标：ES2017
- 模块：CommonJS
- 强制严格类型检查

### 导入规则
- 使用 `import { type X }` 或 `import type { X }` 进行类型导入
- 使用命名导入以提高可读性
- 顺序：外部库优先，内部模块次之

```typescript
// 推荐
import { z } from "zod";
import { type ToolMetadata, type InferSchema } from "xmcp";

// 不推荐（不必要的类型导入）
import { ToolMetadata, InferSchema } from "xmcp";
```

### 命名规范
- 文件名：kebab-case（如 `greet.ts`、`charset-converter.ts`）
- 导出：camelCase（函数/变量），PascalCase（类型/类）
- 常量：SCREAMING_SNAKE_CASE（编译时常量）

### TypeScript 规范
- 所有新代码启用 strict 模式
- 使用 xmcp 的 `InferSchema<T>` 工具类型处理工具参数类型
- 避免使用 `any`；类型未知时使用 `unknown`
- 导出函数使用明确的返回类型

### xmcp 框架模式

#### 工具（位于 `src/tools/`）
每个工具文件导出：
1. `schema` - 定义参数的 Zod schema
2. `metadata` - 包含名称、描述、注解的 ToolMetadata 对象
3. 默认函数 - 工具实现

```typescript
import { z } from "zod";
import { type ToolMetadata, type InferSchema } from "xmcp";

export const schema = {
  param: z.string().describe("参数描述"),
};

export const metadata: ToolMetadata = {
  name: "tool-name",
  description: "工具功能描述",
  annotations: {
    title: "显示标题",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
};

export default function toolName({ param }: InferSchema<typeof schema>) {
  // 实现逻辑
  return result;
}
```

#### 提示词（位于 `src/prompts/`）
结构与工具类似，使用 `PromptMetadata`。

#### 资源（位于 `src/resources/`）
使用文件夹路由：`(folder)/[param].ts` 映射为 `folder://{param}`。

### 错误处理
- 异步操作使用 try-catch
- 返回有意义的错误信息
- 让 Zod 处理验证错误（会自动进行 schema 验证）

### 格式化
- 使用 2 空格缩进
- 添加尾随逗号
- 使用分号
- 最大行长度：100 字符（软限制）
- 逻辑区块之间添加空行

### 注释
- 避免不必要的注释；代码应自解释
- 公共 API 可使用 JSDoc
- 勿提交已注释的代码

### Git 规范
- 提交信息简洁（祈使语气）
- 保持提交专注和原子化
- 代码中不包含密钥或凭据

## 项目结构

```
charset-converter-mcp/
├── src/
│   └── tools/           # 工具定义（自动发现）
│       └── greet.ts     # 示例工具
├── dist/                # 编译输出
├── xmcp.config.ts       # xmcp 配置
├── tsconfig.json        # TypeScript 配置
├── package.json         # 依赖和脚本
└── AGENTS.md            # 本文件
```

## 关键依赖
- `xmcp` (0.6.5) - MCP 框架
- `zod` (^4.0.0) - Schema 验证
- Node.js >= 20.0.0

## 常见任务

### 添加新工具
1. 创建 `src/tools/<tool-name>.ts`
2. 使用 Zod 定义 schema
3. 添加带注解的 metadata
4. 实现默认函数

### 修改配置
编辑 `xmcp.config.ts` 更改：
- 传输方式（stdio、http）
- 工具/提示词/资源路径
- 服务器选项

### 调试
运行 `pnpm run dev` 进入开发模式查看详细输出。