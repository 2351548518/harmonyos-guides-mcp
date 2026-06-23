#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getStore, readDoc, type DocMeta } from "./data.js";
import { search } from "./search.js";

const store = getStore();

const server = new McpServer({
  name: "harmonyos-guides",
  version: "0.1.0",
});

const SEP = " / ";

/* ------------------------------------------------------------------ *
 * Tool 1: search_guides
 * ------------------------------------------------------------------ */
server.tool(
  "search_guides",
  "检索鸿蒙官方开发指南(Full-text search over 5489 HarmonyOS official dev guides). " +
    "用于查 API/Kit 用法、接口参数、调用流程. 输入要用的 API/Kit + 功能关键词(中英文均可, " +
    "如 'AVPlayer 播放视频 初始化'、'Audio Kit 录音'、'ArkUI List 滑动'). " +
    "返回最相关的指南列表(含标题、分类路径). 拿到 docId 后用 get_guide 读全文.",
  {
    query: z.string().describe("检索关键词,描述你要用的 API/Kit 或功能"),
    limit: z.number().int().positive().max(30).default(8).describe("返回条数,默认 8"),
  },
  async ({ query, limit }) => {
    const hits = search(store, query, limit);
    if (hits.length === 0) {
      return text(`未找到与 "${query}" 相关的指南。可尝试更换关键词,或用 list_guides_by_topic 浏览分类。`);
    }
    const lines = hits.map((h, i) => `${i + 1}. ${h.docId} — ${h.title}\n   路径: ${h.path}`);
    return text(
      `命中 ${hits.length} 篇(按相关度排序):\n\n${lines.join("\n\n")}\n\n` +
        `提示: 用 get_guide({name:"<docId>"}) 读全文.`
    );
  }
);

/* ------------------------------------------------------------------ *
 * Tool 2: get_guide
 * ------------------------------------------------------------------ */
server.tool(
  "get_guide",
  "读取指定官方指南的完整 Markdown 正文(Read full markdown of a guide by its docId/fileName). " +
    "docId 即文件名(不含 .md),如 avplayer-overview、audio-recorder.",
  {
    name: z.string().describe("文档标识 docId(即文件名,不含 .md)"),
  },
  async ({ name }) => {
    const body = readDoc(store.docsDir, name);
    if (body === null) {
      return text(`指南 "${name}" 不存在。请确认 docId,可通过 search_guides 或 list_guides_by_topic 获取。`);
    }
    return text(body);
  }
);

/* ------------------------------------------------------------------ *
 * Tool 3: list_guides_by_topic (支持多级下钻)
 * ------------------------------------------------------------------ */
server.tool(
  "list_guides_by_topic",
  "按分类路径浏览鸿蒙指南(Browse guides by topic path, supports drilling down). " +
    "不传 topic 时返回所有顶级类及文档数; 传入 topic 时返回该路径下所有文档(支持前缀匹配下钻, " +
    "如 '媒体' 返回媒体类全部, '媒体 / Audio Kit' 进一步下钻). " +
    "顶级类: 基础入门、应用框架、系统、媒体、图形、应用服务 等.",
  {
    topic: z
      .string()
      .optional()
      .describe("分类路径(顶级或任意前缀),如 '媒体'、'媒体 / Audio Kit'。省略则返回所有顶级类。"),
  },
  async ({ topic }) => {
    if (!topic) {
      const rows = [...store.topics.entries()]
        .map(([t, ids]) => ({ t, n: ids.length }))
        .sort((a, b) => b.n - a.n || a.t.localeCompare(b.t));
      return text(
        `共 ${store.topics.size} 个顶级类,${store.docs.size} 篇指南:\n\n` +
          rows.map((r) => `- ${r.t} (${r.n})`).join("\n") +
          `\n\n用 list_guides_by_topic({topic:"<类名>"}) 下钻查看该类下文档.`
      );
    }
    // Prefix match: path === topic OR path startsWith "topic / "
    const prefix = topic.trim();
    const matched: DocMeta[] = [];
    for (const meta of store.docs.values()) {
      if (meta.path === prefix || meta.path.startsWith(prefix + SEP)) {
        matched.push(meta);
      }
    }
    if (matched.length === 0) {
      return text(
        `未找到路径 "${prefix}"。顶级类: ${[...store.topics.keys()].sort().join("、")}`
      );
    }
    matched.sort((a, b) => a.path.localeCompare(b.path));
    const rows = matched.map((m) => `- ${m.docId} — ${m.path}`);
    return text(`路径 "${prefix}" 下 ${matched.length} 篇:\n\n${rows.join("\n")}`);
  }
);

/* ------------------------------------------------------------------ */
function text(content: string) {
  return { content: [{ type: "text" as const, text: content }] };
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("[harmonyos-guides-mcp] fatal:", err);
  process.exit(1);
});
