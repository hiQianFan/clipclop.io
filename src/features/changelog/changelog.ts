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

const date = (value: string) => new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en", { dateStyle: "medium" }).format(new Date(value));

// First change in the release, shown under the version like a clip row's snippet.
const snippet = (release: any) => {
  const line = languageBody(release.notes, locale).match(/^\s*-\s+(.+)$/m)?.[1];
  if (line) return line.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[`*]/g, "");
  const template = document.createElement("template");
  template.innerHTML = languageHtml(release.notesHtml, locale);
  return template.content.querySelector("li")?.textContent?.trim() || "";
};

let selected = decodeURIComponent(location.hash.slice(1));

const render = () => {
  if (!releases) {
    if (failed) list.innerHTML = `<p class="status" role="status">${copy.error}</p>`;
    return;
  }
  if (!releases.length) {
    list.innerHTML = `<p class="status" role="status">${copy.none}</p>`;
    return;
  }
  const items = releases;
  list.innerHTML = `<div class="log"><div class="versions" role="tablist" aria-orientation="vertical" aria-label="${esc(copy.versions)}">${items.map((release, index) => `<button type="button" role="tab" id="tab-${index}" aria-controls="release"><span class="row-top"><strong>${esc(release.version)}</strong>${index ? "" : `<span class="latest">${copy.latest}</span>`}<time datetime="${esc(release.publishedAt)}">${date(release.publishedAt)}</time></span><span class="snippet">${esc(snippet(release))}</span></button>`).join("")}</div><article class="release" id="release" role="tabpanel" tabindex="0"></article></div>`;
  const box = list.querySelector<HTMLElement>(".versions")!;
  const panel = list.querySelector<HTMLElement>("#release")!;
  const tabs = [...box.querySelectorAll<HTMLButtonElement>("[role=tab]")];
  const show = (index: number, user = false) => {
    const release = items[index];
    selected = release.version;
    tabs.forEach((tab, i) => { tab.setAttribute("aria-selected", String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
    panel.setAttribute("aria-labelledby", `tab-${index}`);
    panel.innerHTML = `<header><h2>${esc(release.version)}</h2><p><time datetime="${esc(release.publishedAt)}">${date(release.publishedAt)}</time><a href="${esc(release.url)}" target="_blank" rel="noopener noreferrer">GitHub ↗</a></p></header><div class="notes">${releaseNotes(release)}</div>`;
    // Keep the selected row visible inside the list without scrolling the page.
    const tab = tabs[index];
    if (tab.offsetTop < box.scrollTop) box.scrollTop = tab.offsetTop - 6;
    else if (tab.offsetTop + tab.offsetHeight > box.scrollTop + box.clientHeight) box.scrollTop = tab.offsetTop + tab.offsetHeight - box.clientHeight + 6;
    if (tab.offsetLeft < box.scrollLeft) box.scrollLeft = tab.offsetLeft - 6;
    else if (tab.offsetLeft + tab.offsetWidth > box.scrollLeft + box.clientWidth) box.scrollLeft = tab.offsetLeft + tab.offsetWidth - box.clientWidth + 6;
    if (!user) return;
    history.replaceState(null, "", `#${encodeURIComponent(release.version)}`);
    tab.focus();
    if (panel.getBoundingClientRect().top < 0) panel.scrollIntoView({ block: "start" });
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => show(index, true));
    tab.addEventListener("keydown", (event) => {
      const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
      const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : step === undefined ? -1 : Math.min(tabs.length - 1, Math.max(0, index + step));
      if (next < 0) return;
      event.preventDefault();
      show(next, true);
    });
  });
  show(Math.max(0, items.findIndex((release) => release.version === selected)));
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
