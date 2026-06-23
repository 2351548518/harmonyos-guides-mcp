// prepack: copy bundled guides docs (52MB) into harmonyos-guides-mcp/data/ for the npm package.
// Source: ../harmonyos-guides_docs/*.md + _crawl_log.txt + INDEX.md
// Target: ./data/docs/*.md + _crawl_log.txt + INDEX.md
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(here, "..");
const projectRoot = path.resolve(pkgRoot, "..");

const srcDocs = path.join(projectRoot, "harmonyos-guides_docs");
const dstDocs = path.join(pkgRoot, "data", "docs");

function rmrf(p) {
  fs.rmSync(p, { recursive: true, force: true });
}

if (!fs.existsSync(srcDocs)) {
  // 数据源已删除但 data/ 已有产物 -> 跳过, 保证 publish 不中断.
  if (fs.existsSync(dstDocs) && fs.existsSync(path.join(dstDocs, "_crawl_log.txt"))) {
    console.log(`[copy-data] 数据源不存在(${srcDocs}), 但 data/ 已有产物, 跳过拷贝。`);
    process.exit(0);
  }
  console.error(`[copy-data] 源文档目录不存在且 data/ 无产物: ${srcDocs}`);
  process.exit(1);
}

rmrf(path.join(pkgRoot, "data"));
fs.mkdirSync(dstDocs, { recursive: true });

let count = 0;
for (const entry of fs.readdirSync(srcDocs, { withFileTypes: true })) {
  if (!entry.isFile()) continue;
  // 只拷 .md 和 _crawl_log.txt
  if (entry.name.endsWith(".md") || entry.name === "_crawl_log.txt") {
    fs.copyFileSync(path.join(srcDocs, entry.name), path.join(dstDocs, entry.name));
    count++;
  }
}

console.log(`[copy-data] 已拷贝 ${count} 个文件到 ${path.relative(projectRoot, dstDocs)}`);
