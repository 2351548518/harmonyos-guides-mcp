# HarmonyOS 官方指南 MCP 服务器

把鸿蒙官方开发指南(5489 篇)封装成 MCP 检索服务,供 Claude Code / opencode / Cursor / Cline 等客户端在开发时查 API/Kit 用法。**文档(52MB)随包发布,装包即用、零配置。**

与 `harmonyos-best-practices-mcp` 分工:本服务管"**API 怎么用**"(接口参数、调用流程),best-practices 管"**场景怎么做最好 + 参考代码**"。两者可并列使用。

## 提供的工具

| 工具 | 作用 |
|------|------|
| `search_guides({query, limit?})` | 全文检索指南(中文友好),返回相关度排序的文档列表(含标题、分类路径) |
| `get_guide({name})` | 读取指定指南(docId)的完整 Markdown 正文 |
| `list_guides_by_topic({topic?})` | 按分类路径浏览;支持多级下钻(如 `媒体` → `媒体 / Audio Kit`) |

数据规模:5489 篇指南,顶级类含 基础入门(34)、应用框架(835)、系统(778)、媒体(295)、图形(182)、应用服务(710) 等。

## 安装(最终用户)

无需 clone 本仓库,直接配置客户端(以 Claude Code / opencode `.mcp.json` 为例):

```json
{
  "mcpServers": {
    "harmonyos-guides": {
      "command": "npx",
      "args": ["-y", "harmonyos-guides-mcp"]
    }
  }
}
```

或全局安装:`npm install -g harmonyos-guides-mcp`。任何支持 stdio 的 MCP 客户端(opencode / Cursor / Cline / Continue)同样配置。

### 环境变量

| 变量 | 默认 | 说明 |
|------|------|------|
| `BP_DOCS_DIR` | 包内 `data/docs` | 文档目录(一般无需改) |

## 与 best-practices 并列使用(opencode 示例)

```json
{
  "mcp": {
    "harmonyos-best-practices": {
      "type": "local",
      "command": ["npx", "-y", "harmonyos-best-practices-mcp"]
    },
    "harmonyos-guides": {
      "type": "local",
      "command": ["npx", "-y", "harmonyos-guides-mcp"]
    }
  }
}
```

搭配各自的 Skill(`harmonyos-best-practices` 与 `harmonyos-guides`),AI 可据需求选用:查 API 用法走 guides,查场景实践走 best-practices。

## 开发与发布(维护者)

```bash
cd harmonyos-guides-mcp
npm install
npm run build          # 编译
npm run prepack        # 拷文档到 data/ + 编译(发布前自动)
npm run selfcheck      # 自检三个工具
npm publish
```

包内含 `dist/` + `data/`(52MB 文档,压缩后约 13-15MB) + README。源码 `src/` 不随包。

## 验证

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

## 许可

指南文档源自华为 HarmonyOS 官方文档,版权归华为所有,此处仅作开发辅助检索用途。MCP 服务器代码(MIT)见 `package.json`。
