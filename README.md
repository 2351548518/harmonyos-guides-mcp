# HarmonyOS 官方指南 MCP 知识库

将华为鸿蒙(HarmonyOS)官方开发指南封装成 MCP 检索服务,供 Claude Code / opencode / Cursor / Cline 等 AI 编程客户端在开发时调用——**调用某个鸿蒙 API/Kit 前,先检索官方指南确认用法与参数,避免凭空编造 `@ohos.*` 接口**。

## 这是什么

| 组成 | 内容 | 分发方式 |
|------|------|---------|
| **① MCP 服务器** | 检索引擎,3 个工具:指南全文检索 / 读指南 / 按分类路径浏览 | npm 包(`npx` 即用) |
| **② Skill** | 引导 AI"查 API 用法先检索官方指南"的流程说明 | 复制到 skills 目录 |
| **数据源** | 官方指南 + `_crawl_log.txt`(分类) + `INDEX.md`(目录树) | 文档随包(52MB,压缩后 8.8MB) |

与姊妹项目 [`harmonyos-best-practices-mcp`](https://github.com/2351548518/harmonyos-best-practices-mcp) 分工互补:

| | 本项目(guides) | best-practices |
|---|---|---|
| 查什么 | **API/Kit 用法**——接口参数、调用流程、生命周期 | **场景最佳实践 + 参考代码** |
| 数据 | 5489 篇官方指南 | 452 篇 + 186 代码仓库 |
| 工具 | 3 个 | 4 个(多代码读取) |
| 适用 | "AVPlayer 怎么初始化""Audio Kit 录音接口" | "长列表丢帧怎么优化""组件复用范例" |

两者可并列使用:先 guides 查清 API 用法,再 best-practices 看该场景怎么做最好。

## 快速开始(最终用户)

### 1. 装 MCP 服务器

无需 clone 本仓库。客户端配置(以 Claude Code / opencode 为例):

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

> 包名以实际发布为准。任何支持 stdio 的 MCP 客户端(opencode / Cursor / Cline / Continue)同样配置。

### 2. 装 Skill

将 `skills/harmonyos-guides/SKILL.md` 复制到 Claude Code 的 skills 目录(如 `~/.claude/skills/`)。这让 AI 在查鸿蒙 API/Kit 用法时自动走"先检索官方指南"的流程。

## 更新

指南文档和 MCP 服务器会持续更新。更新方式:

**更新 MCP 服务器**(npm 包):

```bash
# npx 方式:加 -y 会自动拉最新版,无需手动操作
# 若用全局安装,手动更新:
npm update -g harmonyos-guides-mcp
# 或指定版本:
npm install -g harmonyos-guides-mcp@latest
```

更新后**重启 AI 客户端**(Claude Code / Cursor 等)让新进程加载新版 MCP。

**更新文档**(随 npm 包内置,无需单独操作):更新 MCP 包即同步更新 5489 篇指南。guides 为纯文档,无代码包,无需额外下载。

**查看当前版本**:`npm view harmonyos-guides-mcp version`(最新发布版)或看客户端 MCP 面板里服务器的 version 字段。

## 三个 MCP 工具

| 工具 | 作用 |
|------|------|
| `search_guides({query, limit?})` | 全文检索指南(中文友好),返回相关度排序的文档列表(含标题、分类路径) |
| `get_guide({name})` | 读取指定指南(docId)的完整 Markdown 正文 |
| `list_guides_by_topic({topic?})` | 按分类路径浏览;支持多级下钻(如 `媒体` → `媒体 / Audio Kit`) |

数据规模:5489 篇指南,20 个顶级类——应用框架(1047)、系统(1001)、AI(947)、应用服务(883)、媒体(365)、图形(233)、NDK开发(141) 等。

## 工作流程(开发时)

```
用户:"AVPlayer 怎么播放视频?"
   │
   ▼  Skill 触发
search_guides("AVPlayer 播放视频 初始化")
   │  → 命中 video-playback / using-ndk-avplayer-for-video-playback 等(含分类路径)
   ▼
get_guide("video-playback")              ← 读官方接口签名、参数、示例
   │
   ▼
依据官方用法编码(接口名/参数以指南为准,不凭空编造)
```

## 目录结构

```
Harmonyos_Guides_MCP/
├── harmonyos-guides_docs/               # 数据源(5489 篇,52MB,不推 git)
│   ├── *.md                             # 指南正文
│   ├── _crawl_log.txt                   # 分类(status / docId / 多级路径)
│   └── INDEX.md                         # 目录树
│
├── harmonyos-guides-mcp/                # ① MCP 服务器(npm 包)
│   ├── src/                             # TS 源码
│   ├── data/                            # 文档(prepack 拷入,随包)
│   ├── dist/                            # 编译产物
│   ├── scripts/
│   │   ├── copy-data.mjs                # prepack 拷数据
│   │   └── selfcheck.mjs                # 自检
│   └── README.md                        # MCP 详细文档
│
└── skills/harmonyos-guides/             # ② Skill
    └── SKILL.md
```

## 维护者:开发与发布

详见 [`harmonyos-guides-mcp/README.md`](harmonyos-guides-mcp/README.md)。要点:

```bash
cd harmonyos-guides-mcp
npm install
npm run build        # 编译
npm run prepack      # 拷数据到 data/ + 编译(发布前自动)
npm run selfcheck    # 自检三个工具
npm publish          # 发布到 npm
```

## 设计说明

- **为什么独立 MCP 而非合并进 best-practices**:两类资料体量、结构、用途不同(指南 5489 篇纯文档查 API;最佳实践 452 篇带代码查场景)。独立服务职责清晰,各自的 Skill 触发不重叠。
- **多级分类路径**:指南的分类是深层路径(`媒体 / Audio Kit / 音频编创 / 实时`),`list_guides_by_topic` 支持前缀下钻,便于从大类逐层缩小。
- **文档随包**:52MB 指南压缩后 8.8MB,适合随 npm 包,装包即用、零配置。无代码关联,故不需要 Release 附件。
- **与 best-practices 配合**:两者 Skill 的 description 已刻意区分(guides 查"API 怎么用"、best-practices 查"怎么做最好"),并列挂载时 AI 能据需求选用。

## 许可

指南文档源自华为 HarmonyOS 官方文档,版权归华为所有,此处仅作开发辅助检索用途。MCP 服务器代码(MIT)见 `harmonyos-guides-mcp/package.json`。
