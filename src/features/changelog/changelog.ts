"use strict";

const data = JSON.parse(document.querySelector("#changelog-data")!.textContent!);
const copy = data;
const list = document.querySelector("#release-list")!;
const cacheKey = "clipclop-releases-v1";
let locale: "zh" | "en";
let releases: any[] | null;
let failed = false;

const esc = (value: unknown) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

const languageBody = (body: unknown, language: "zh" | "en") => {
  const parts = String(body || "").split(/^> 安装提示 \/ Installation note\s*$/m)[0].split(/^## (中文|English)\s*$/m);
  const label = language === "zh" ? "中文" : "English";
  const index = parts.indexOf(label);
  return index < 0 ? "" : parts[index + 1].trim();
};

const languageHtml = (html: unknown, language: "zh" | "en") => {
  if (typeof html !== "string" || !html.trim()) return "";
  const template = document.createElement("template");
  template.innerHTML = html;
  const label = language === "zh" ? "中文" : "English";
  const heading = [...template.content.querySelectorAll("h2")].find((node) => node.textContent?.trim() === label);
  if (!heading) return "";
  const nodes: Node[] = [];
  for (let node = heading.nextSibling; node; node = node.nextSibling) {
    if (node instanceof HTMLElement && (node.tagName === "H2" || node.tagName === "HR" || node.tagName === "BLOCKQUOTE")) break;
    nodes.push(node.cloneNode(true));
  }
  const wrapper = document.createElement("div");
  wrapper.append(...nodes);
  return wrapper.innerHTML.trim();
};

const inline = (value: string) => esc(value)
  .replace(/`([^`]+)`/g, "<code>$1</code>")
  .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
  .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

const markdown = (body: string) => {
  const out: string[] = [];
  let listTag = "";
  let items: string[] = [];
  const flush = () => {
    if (items.length) out.push(`<${listTag}>${items.map((item) => `<li>${inline(item)}</li>`).join("")}</${listTag}>`);
    items = [];
    listTag = "";
  };
  for (const line of body.split("\n")) {
    const item = line.match(/^\s*(-|\d+\.)\s+(.+)/);
    if (item) {
      const nextTag = item[1] === "-" ? "ul" : "ol";
      if (listTag && listTag !== nextTag) flush();
      listTag = nextTag;
      items.push(item[2]);
      continue;
    }
    flush();
    if (/^###\s+/.test(line)) out.push(`<h3>${inline(line.slice(4))}</h3>`);
    else if (line.trim() && !/^---+$/.test(line.trim())) out.push(`<p>${inline(line)}</p>`);
  }
  flush();
  return out.join("");
};

const releaseNotes = (release: any) => {
  const body = languageBody(release.notes, locale);
  return (body ? markdown(body) : languageHtml(release.notesHtml, locale)) || `<p>${copy.noNotes}</p>`;
};

const render = () => {
  if (releases) {
    list.innerHTML = releases.map((release, index) => `<article class="release"><aside class="version"><strong>${esc(release.version)}</strong><time datetime="${esc(release.publishedAt)}">${new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en", { dateStyle: "medium" }).format(new Date(release.publishedAt))}</time>${index ? "" : `<span class="latest">${copy.latest}</span>`}</aside><div><h2><a href="${esc(release.url)}" target="_blank" rel="noopener noreferrer">${esc(release.name || release.version)}</a></h2><div class="notes">${releaseNotes(release)}</div></div></article>`).join("") || `<p class="status">${copy.none}</p>`;
  } else if (failed) {
    list.innerHTML = `<p class="status">${copy.error}</p>`;
  }
};

console.assert(languageBody(`## 中文\n\n### 新增\n- 中文\n\n## English\n\n### Added\n- English\n\n> 安装提示 / Installation note\n> hidden`, "en") === "### Added\n- English" && markdown("### Added\n- `safe`") === "<h3>Added</h3><ul><li><code>safe</code></li></ul>", "Changelog locale/Markdown rendering failed");

try {
  const cached = JSON.parse(localStorage.getItem(cacheKey)!);
  releases = Array.isArray(cached) ? cached : (cached?.schemaVersion === 1 && Array.isArray(cached.releases) ? cached.releases : null);
} catch {}
locale = data.locale;
render();
fetch("/releases.json")
  .then((response) => {
    if (!response.ok) throw new Error();
    return response.json();
  })
  .then((feed) => {
    if (feed?.schemaVersion !== 1 || !Array.isArray(feed.releases)) throw new Error();
    releases = feed.releases;
    try { localStorage.setItem(cacheKey, JSON.stringify(feed)); } catch {}
    render();
  })
  .catch(() => {
    failed = true;
    render();
  });
