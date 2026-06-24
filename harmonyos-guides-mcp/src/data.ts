import * as fs from "node:fs";
import * as path from "node:path";

/** Metadata for a single guide doc. No code association (pure docs). */
export interface DocMeta {
  docId: string;
  title: string;    // last segment of path, or docId
  path: string;     // full multi-level path, e.g. "媒体 / Audio Kit / 录音"
  topic: string;    // first segment of path (top-level category)
  headings: string; // all markdown heading texts joined (for search scoring)
}

export interface DataStore {
  docs: Map<string, DocMeta>;
  topics: Map<string, string[]>;   // top-level topic -> docId[]
  docsDir: string;
}

/** Resolve package root: directory containing dist/ (where this file compiles to). */
function pkgRoot(): string {
  const here = path.dirname(new URL(import.meta.url).pathname.replace(/^\//, ""));
  return path.resolve(here, "..");
}

function defaultPaths() {
  const root = pkgRoot();
  const dataDir = path.join(root, "data");
  return {
    // Bundled docs (shipped in the npm package under data/docs).
    docsDir: process.env.BP_DOCS_DIR || path.join(dataDir, "docs"),
    // Crawler log (status \t docId \t "Lvl1 / ... / leaf"), drives categorization.
    // Lives at data/ root (sibling of INDEX.md), not under docs/.
    logFile: process.env.BP_LOG || path.join(dataDir, "index_log.txt"),
  };
}

const SEP = " / ";

/** Parse index_log.txt: status \t docId \t "Lvl1 / Lvl2 / ... / leaf" */
function parseCrawlLog(logFile: string): Map<string, DocMeta> {
  const docs = new Map<string, DocMeta>();
  if (!fs.existsSync(logFile)) return docs;
  const text = fs.readFileSync(logFile, "utf8");
  for (const raw of text.split(/\r?\n/)) {
    if (!raw.trim()) continue;
    const parts = raw.split("\t");
    if (parts.length < 3) continue;
    const docId = parts[1].trim();
    const fullPath = parts.slice(2).join("\t").trim();
    const segs = fullPath.split(SEP).map((s) => s.trim()).filter(Boolean);
    const topic = segs[0] || "未分类";
    const title = segs.length ? segs[segs.length - 1] : docId;
    docs.set(docId, { docId, title, path: fullPath, topic, headings: "" });
  }
  return docs;
}

let _store: DataStore | null = null;

export function getStore(): DataStore {
  if (_store) return _store;
  const { docsDir, logFile } = defaultPaths();
  if (!fs.existsSync(docsDir)) {
    throw new Error(
      `文档目录不存在: ${docsDir}\n` +
        `若从源码运行,请先执行 npm run prepack 拷贝数据到 data/;\n` +
        `或通过环境变量 BP_DOCS_DIR 指向资料目录。`
    );
  }
  if (!fs.existsSync(logFile)) {
    throw new Error(
      `分类日志不存在: ${logFile}\n` +
        `该文件驱动文档分类,缺失会导致全部文档落入"未分类"。\n` +
        `若从源码运行,请先执行 npm run prepack 拷贝数据到 data/;\n` +
        `或通过环境变量 BP_LOG 指向 index_log.txt。`
    );
  }
  const docs = parseCrawlLog(logFile);

  const topics = new Map<string, string[]>();
  for (const meta of docs.values()) {
    const arr = topics.get(meta.topic) || [];
    arr.push(meta.docId);
    topics.set(meta.topic, arr);
  }

  // Preload all markdown headings — section-level signal for search (covers full doc).
  for (const meta of docs.values()) {
    meta.headings = extractHeadings(docsDir, meta.docId);
  }

  _store = { docs, topics, docsDir };
  return _store;
}

/** Extract all markdown heading texts from a doc, joined by space. Light & full-text. */
export function extractHeadings(docsDir: string, docId: string): string {
  const file = path.join(docsDir, `${docId}.md`);
  let text: string;
  try {
    text = fs.readFileSync(file, "utf8");
  } catch {
    return "";
  }
  const heads: string[] = [];
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^#{1,6}\s+(.+?)\s*#*\s*$/);
    if (m) {
      const clean = m[1]
        .replace(/\*\*/g, "")
        .replace(/`([^`]+)`/g, "$1")
        .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
        .trim();
      if (clean) heads.push(clean);
    }
  }
  return heads.join("  ");
}

/** Read a guide's full markdown body. Returns null if missing. */
export function readDoc(docsDir: string, docId: string): string | null {
  const file = path.join(docsDir, `${docId}.md`);
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, "utf8");
}
