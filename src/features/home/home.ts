import chrome from "./assets/source-google-chrome.png";
import safari from "./assets/source-safari.png";
import edge from "./assets/source-edge.svg";
import codex from "./assets/source-codex.svg";
import claude from "./assets/source-claude.svg";
import folder from "./assets/source-finder.png";
import image from "./assets/source-preview.png";
import terminal from "./assets/source-terminal.png";

const data = JSON.parse(document.querySelector("#demo-data")!.textContent!);
const clips = data.clips;
const words = data.words;
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
const sourceImages: Record<string, string> = { chrome: chrome.src, safari: safari.src, edge: edge.src, codex: codex.src, claude: claude.src, folder: folder.src, image: image.src, terminal: terminal.src };
const pad = (value: number) => String(value).padStart(2, "0");
const escapeHtml = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const randomDate = (min: number, max: number) => {
  const date = new Date(Date.now() - (min + Math.random() * (max - min)) * 86_400_000);
  return `${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};
const times = Array.from({ length: 10 }, () => [randomDate(10, 45), randomDate(1, 9)]);
const favoriteIndexes = new Set([0, 2, 4]);

let selected = 0;
let visible = clips.map((_: unknown, index: number) => index);
let favoriteOnly = false;
const stories = [
  { title: words.historyTitle, copy: words.historyCopy, clipIndex: 0, favorites: false },
  { title: words.favoritesTitle, copy: words.favoritesCopy, clipIndex: 0, favorites: true },
  ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => ({
    title: clips[index].title, copy: clips[index].copy, clipIndex: index, favorites: false,
  })),
];
let activeStory = 0;
let pendingStory: number | null = null;

const openShortcut = document.querySelector<HTMLElement>("#open-shortcut");
const list = document.querySelector<HTMLElement>("#clip-list")!;
const preview = document.querySelector<HTMLElement>("#preview")!;
const pathSlot = document.querySelector<HTMLElement>("#path-slot")!;
const facts = document.querySelector<HTMLElement>("#facts")!;
const search = document.querySelector<HTMLInputElement>("#search")!;
const steps = document.querySelector<HTMLElement>("#steps")!;
const hero = document.querySelector<HTMLElement>(".hero-inner")!;
const heroCopy = document.querySelector<HTMLElement>(".hero-copy")!;
const logo = document.querySelector<HTMLElement>(".logo")!;
const heroActions = document.querySelector<HTMLElement>(".hero-actions")!;
const showcase = document.querySelector<HTMLElement>(".showcase")!;
const stage = document.querySelector<HTMLElement>(".showcase-stage")!;
const appFrame = document.querySelector<HTMLElement>(".app-frame")!;
const storyTrack = document.querySelector<HTMLElement>("#story-track")!;
const releaseContext = document.querySelector<HTMLElement>("#release-context")!;
const fileIcon = document.querySelector<HTMLTemplateElement>("#icon-file")?.innerHTML ?? "";
const starIcon = document.querySelector<HTMLTemplateElement>("#icon-star")?.innerHTML ?? "";

if (openShortcut && !/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) {
  openShortcut.textContent = "Ctrl+Alt+C";
}

function sourceIcon(name: string) {
  return sourceImages[name] ? `<img src="${sourceImages[name]}" alt="">` : document.querySelector<HTMLTemplateElement>(`#icon-${name}`)?.innerHTML ?? "";
}

function leadIcon(clip: any) {
  if (clip.type === "color") return `<span class="lead color" style="background:${clip.text}"></span>`;
  if (clip.type === "image") return '<span class="lead media"><img src="/hero-logo.webp" alt=""></span>';
  return `<span class="lead${clip.type === "file" ? " media" : ""}">${clip.type === "file" ? fileIcon : ""}</span>`;
}

function applyFilters() {
  const query = search.value.trim().toLocaleLowerCase();
  visible = clips
    .map((clip: any, index: number) => (!favoriteOnly || favoriteIndexes.has(index)) && clip.text.toLocaleLowerCase().includes(query) ? index : -1)
    .filter((index: number) => index >= 0);
  if (!visible.includes(selected)) selected = visible[0] ?? -1;
}

function renderList() {
  document.querySelectorAll<HTMLElement>("[data-scope]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.scope === (favoriteOnly ? "favorites" : "all")));
  });
  const rows = [...list.querySelectorAll<HTMLElement>(".clip-row")];
  if (visible.length && rows.length === visible.length && rows.every((row, position) => Number(row.dataset.index) === visible[position])) {
    rows.forEach((row) => {
      const index = Number(row.dataset.index);
      const saved = favoriteIndexes.has(index);
      row.setAttribute("aria-selected", String(index === selected));
      const favorite = row.querySelector<HTMLElement>(".favorite")!;
      favorite.classList.toggle("saved", saved);
      favorite.setAttribute("aria-pressed", String(saved));
      favorite.setAttribute("aria-label", saved ? words.unfavorite : words.favorite);
      const snippet = row.querySelector<HTMLElement>(".snippet");
      if (snippet) snippet.textContent = clips[index].text;
      const swatch = row.querySelector<HTMLElement>(".lead.color");
      if (swatch) swatch.style.background = clips[index].text;
    });
    return;
  }
  list.innerHTML = visible.length
    ? visible.map((index: number, position: number) => {
      const clip = clips[index];
      const saved = favoriteIndexes.has(index);
      return `<button class="clip-row" role="option" aria-selected="${index === selected}" data-index="${index}">
        <span class="num">${(position + 1) % 10}</span>${leadIcon(clip)}
        ${clip.type === "image" ? "" : `<span class="snippet">${escapeHtml(clip.text)}</span>`}
        <span class="favorite${saved ? " saved" : ""}" role="button" aria-pressed="${saved}" aria-label="${saved ? words.unfavorite ?? words.favorites : words.favorites}">${starIcon}</span>
      </button>`;
    }).join("") + Array.from({ length: Math.max(0, 10 - visible.length) }, () => '<div class="list-slot" aria-hidden="true"></div>').join("")
    : `<span class="empty">${words.empty}</span>`;
}

function renderStory() {
  storyTrack.style.setProperty("--story-count", String(stories.length));
  storyTrack.innerHTML = stories.map((story: any, index: number) => `<div class="story-panel${index === activeStory ? " is-current" : ""}" aria-hidden="${index !== activeStory}"><h2>${escapeHtml(story.title)}</h2><p>${escapeHtml(story.copy)}</p></div>`).join("");
}

function activateStory(index: number) {
  if (index === activeStory) return;
  activeStory = index;
  const story = stories[index];
  favoriteOnly = story.favorites;
  applyFilters();
  selected = visible.includes(story.clipIndex) ? story.clipIndex : visible[0] ?? -1;
  refreshSelection();
  closeMenus();
  [...storyTrack.children].forEach((panel, panelIndex) => {
    panel.classList.toggle("is-current", panelIndex === index);
    panel.setAttribute("aria-hidden", String(panelIndex !== index));
  });
}

function navigateStory(index: number) {
  if (index < 0) return;
  pendingStory = index;
  activateStory(index);
  steps.querySelector<HTMLElement>(`[data-index="${index}"]`)?.scrollIntoView({ behavior: reduceMotion.matches ? "instant" : "smooth", block: "center" });
}

function followScrollStory(index: number) {
  if (pendingStory !== null) {
    if (index !== pendingStory) return;
    pendingStory = null;
  }
  activateStory(index);
}

for (const event of ["wheel", "touchstart", "keydown"]) {
  window.addEventListener(event, () => { pendingStory = null; }, { passive: true });
}

function pathParts(path: string) {
  const trimmed = path.replace(/[\\/]+$/, "") || path;
  const index = Math.max(trimmed.lastIndexOf("/"), trimmed.lastIndexOf("\\"));
  return { name: trimmed.slice(index + 1) || trimmed, directory: index < 0 ? "" : trimmed.slice(0, index + 1) };
}

function select(index: number, focus = false) {
  if (!visible.includes(index)) return;
  selected = index;
  const clip = clips[index];
  const [first, recent] = times[index];
  renderList();
  updateActionMenu();
  preview.innerHTML = clip.type === "color"
    ? `<div class="color-preview"><div class="color-swatch" style="background:${clip.text}"></div><pre class="preview-text">${clip.text}</pre></div>`
    : clip.type === "image"
      ? '<div class="image-preview"><img src="/hero-logo.webp" alt="ClipClop app icon preview"></div>'
      : clip.type === "file"
        ? `<pre class="file-path">${escapeHtml(clip.path)}</pre>`
        : `<pre class="preview-text">${escapeHtml(clip.text)}</pre>`;
  pathSlot.innerHTML = clip.type === "file" ? (() => {
    const path = pathParts(clip.path);
    return `<div class="path-bar" title="${escapeHtml(clip.path)}"><strong>${escapeHtml(path.name)}</strong><span>${escapeHtml(path.directory)}</span></div>`;
  })() : "";
  facts.innerHTML = `<div class="meta-summary"><div class="meta-source"><span class="source-icon source-icon-${clip.icon}" aria-hidden="true">${sourceIcon(clip.icon)}</span><div class="source-details"><span>${escapeHtml(clip.source)}</span><time>${words.first} ${first}</time><time>${words.recent} ${recent}</time></div></div><dl class="meta-facts">${clip.facts.map(([label, value]: [string, string]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("")}</dl></div>`;
  if (focus) list.querySelector<HTMLElement>(`[data-index="${index}"]`)?.focus();
}

function refreshSelection() {
  applyFilters();
  renderList();
  if (selected >= 0) select(selected);
  else { preview.innerHTML = ""; pathSlot.innerHTML = ""; facts.innerHTML = ""; updateActionMenu(); closeMenus(); }
}

list.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;
  const row = target.closest<HTMLElement>(".clip-row");
  if (!row) return;
  const index = Number(row.dataset.index);
  if (target.closest(".favorite")) {
    favoriteIndexes.has(index) ? favoriteIndexes.delete(index) : favoriteIndexes.add(index);
    refreshSelection();
    return;
  }
  select(index);
  if (!favoriteOnly) navigateStory(stories.findIndex((story, storyIndex) => storyIndex >= 2 && story.clipIndex === index));
});

list.addEventListener("keydown", (event) => {
  if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key) || !visible.length) return;
  event.preventDefault();
  const current = Math.max(0, visible.indexOf(selected));
  const next = event.key === "Home" ? 0 : event.key === "End" ? visible.length - 1 : Math.max(0, Math.min(visible.length - 1, current + (event.key === "ArrowDown" ? 1 : -1)));
  select(visible[next], true);
});

search.addEventListener("input", refreshSelection);
document.querySelectorAll<HTMLElement>("[data-scope]").forEach((button) => button.addEventListener("click", () => {
  favoriteOnly = button.dataset.scope === "favorites";
  refreshSelection();
  navigateStory(favoriteOnly ? 1 : 0);
}));

function updateActionMenu() {
  const clip = clips[selected];
  const menu = document.querySelector<HTMLElement>("#action-menu")!;
  const canPreview = clip?.type === "image" || clip?.type === "file";
  menu.querySelectorAll<HTMLElement>("[data-action]").forEach((item) => {
    const action = item.dataset.action;
    item.hidden = action === "plain" ? !clip || ["image", "file"].includes(clip.type)
      : action === "link" ? clip?.type !== "link"
      : action === "preview" ? !canPreview
      : action === "preview-separator" ? !canPreview && clip?.type !== "link" : false;
    if (action === "favorite") item.querySelector("span")!.textContent = favoriteIndexes.has(selected) ? words.unfavorite : words.favorite;
  });
  document.querySelector<HTMLButtonElement>("#action-menu-trigger")!.disabled = !clip;
}

function closeMenus() {
  document.querySelectorAll<HTMLElement>(".demo-menu").forEach((menu) => menu.hidden = true);
  document.querySelectorAll<HTMLElement>(".menu-trigger").forEach((trigger) => trigger.setAttribute("aria-expanded", "false"));
}

function wireMenu(triggerId: string, menuId: string) {
  const trigger = document.querySelector<HTMLButtonElement>(triggerId)!;
  const menu = document.querySelector<HTMLElement>(menuId)!;
  menu.addEventListener("click", (event) => { event.stopPropagation(); closeMenus(); trigger.focus(); });
  menu.addEventListener("keydown", (event) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End", "Escape"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "Escape") { closeMenus(); trigger.focus(); return; }
    const items = [...menu.querySelectorAll<HTMLButtonElement>("[role='menuitem']:not([hidden])")];
    const current = items.indexOf(document.activeElement as HTMLButtonElement);
    const next = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : (current + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
    items[next]?.focus();
  });
  trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    const open = menu.hidden;
    closeMenus();
    menu.hidden = !open;
    trigger.setAttribute("aria-expanded", String(open));
    if (open) menu.querySelector<HTMLElement>("[role='menuitem']:not([hidden])")?.focus();
  });
}
wireMenu("#app-menu-trigger", "#app-menu");
wireMenu("#action-menu-trigger", "#action-menu");
document.addEventListener("click", closeMenus);
document.addEventListener("keydown", (event) => {
  if (event.key === "/" && document.activeElement !== search) {
    event.preventDefault();
    search.focus();
  }
  if (event.key === "Escape") closeMenus();
});

function applyThemeColor() {
  const theme = document.documentElement.dataset.theme;
  const color = theme === "light" || (!theme && matchMedia("(prefers-color-scheme: light)").matches) ? "#1C1E20" : "#ECEEF0";
  clips.find((clip: any) => clip.type === "color").text = color;
  selected >= 0 && clips[selected].type === "color" ? select(selected) : renderList();
}
window.addEventListener("clipclop:theme", applyThemeColor);
matchMedia("(prefers-color-scheme: light)").addEventListener("change", applyThemeColor);

const sectionLinks = [...document.querySelectorAll<HTMLElement>("[data-section]")];
const sectionTargets = sectionLinks.map((link) => document.querySelector<HTMLElement>(`#${link.dataset.section}`)!);
const sectionObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) sectionLinks.forEach((link) => link.dataset.section === entry.target.id ? link.setAttribute("aria-current", "location") : link.removeAttribute("aria-current"));
}), { rootMargin: "-35% 0px -55%", threshold: 0 });
sectionTargets.forEach((target) => sectionObserver.observe(target));
sectionLinks.forEach((link, index) => link.addEventListener("click", (event) => {
  event.preventDefault();
  scrollTo({ top: sectionTargets[index].offsetTop - (innerWidth <= 600 ? 70 : 76), behavior: reduceMotion.matches ? "instant" : "smooth" });
}));
if (location.hash) history.replaceState(null, "", location.pathname + location.search);

let frameRaf = 0;
function updateMobileOverlap() {
  const bottom = Math.max(heroCopy.getBoundingClientRect().bottom, logo.getBoundingClientRect().bottom, heroActions.getBoundingClientRect().bottom);
  const room = hero.closest<HTMLElement>(".hero")!.getBoundingClientRect().bottom - bottom - 32;
  showcase.style.setProperty("--mobile-showcase-overlap", `${innerWidth <= 768 ? Math.max(0, Math.min(innerHeight * .48, room)) : 0}px`);
}
function updateFrame() {
  frameRaf = 0;
  const top = stage.getBoundingClientRect().top;
  const tablet = innerWidth <= 1100;
  const mobile = innerWidth <= 768;
  const viewport = tablet ? stage.clientHeight + 76 : innerHeight;
  const progress = Math.max(0, Math.min(1, (top - 76) / Math.max(1, viewport - 76)));
  const smooth = progress * progress * (3 - 2 * progress);
  const eased = mobile ? smooth : smooth * smooth * (3 - 2 * smooth);
  const baseScale = mobile ? Math.min(.78, Math.max(0, viewport - 170) / 585) : Math.min(1, appFrame.clientWidth / 1040, Math.max(0, viewport - 124) / 585);
  const introScale = tablet ? Math.min(1, stage.clientWidth / 1040) : hero.clientWidth / 1040;
  const scale = mobile ? baseScale : baseScale + (introScale - baseScale) * eased;
  const x = tablet ? 0 : (hero.getBoundingClientRect().right - appFrame.getBoundingClientRect().right) * eased;
  const heroBottom = Math.max(heroCopy.getBoundingClientRect().bottom, logo.getBoundingClientRect().bottom, heroActions.getBoundingClientRect().bottom);
  const y = mobile ? 0 : top > 76 ? Math.max(-viewport * (tablet ? .46 : .4) * eased, heroBottom + 32 - (top + appFrame.offsetTop)) : 0;
  appFrame.style.setProperty("--app-scale", String(scale));
  appFrame.style.setProperty("--app-height", `${585 * (mobile ? scale : baseScale)}px`);
  appFrame.style.setProperty("--app-intro-x", `${x}px`);
  appFrame.style.setProperty("--app-intro-offset", `${y}px`);
}
function requestFrameUpdate() {
  if (!frameRaf) frameRaf = requestAnimationFrame(updateFrame);
}
addEventListener("scroll", requestFrameUpdate, { passive: true });
addEventListener("resize", () => { updateMobileOverlap(); requestFrameUpdate(); });

let storyRaf = 0;
function storyPosition() {
  const first = steps.firstElementChild as HTMLElement | null;
  if (!first) return null;
  const step = first.offsetHeight;
  return { raw: (stage.getBoundingClientRect().top + stage.clientHeight / 2 - first.getBoundingClientRect().top - step / 2) / step, step };
}
function updateStory() {
  storyRaf = 0;
  const position = storyPosition();
  if (!position) return;
  if (position.raw < 0 || position.raw > stories.length - 1) return;
  const raw = position.raw;
  storyTrack.style.setProperty("--story-offset", `${-(reduceMotion.matches ? Math.round(raw) : raw) * storyTrack.parentElement!.clientHeight}px`);
  const next = Math.round(raw);
  followScrollStory(next);
}
function requestStoryUpdate() {
  if (!storyRaf) storyRaf = requestAnimationFrame(updateStory);
}
addEventListener("scroll", requestStoryUpdate, { passive: true });
addEventListener("resize", requestStoryUpdate);
steps.innerHTML = stories.map((_: unknown, index: number) => `<div class="scroll-step" data-index="${index}"></div>`).join("");

renderStory();
refreshSelection();
applyThemeColor();
updateMobileOverlap();
updateFrame();
updateStory();

const releaseCacheKey = "clipclop-latest-release-v1";
const releaseMaxAge = 21_600_000;
let cachedRelease: { tag?: string; time?: number } | undefined;
try { cachedRelease = JSON.parse(localStorage.getItem(releaseCacheKey) || "null"); } catch {}
if (cachedRelease?.tag) releaseContext.textContent = data.locale === "zh" ? `当前稳定版 ${cachedRelease.tag}，版本说明见` : `Current stable release ${cachedRelease.tag}. See the`;
if (!cachedRelease || Date.now() - Number(cachedRelease.time) > releaseMaxAge) {
  fetch("/releases.json")
    .then((response) => { if (!response.ok) throw new Error(); return response.json(); })
    .then((feed) => {
      const releaseTag = feed?.releases?.[0]?.version;
      if (typeof releaseTag !== "string") throw new Error();
      releaseContext.textContent = data.locale === "zh" ? `当前稳定版 ${releaseTag}，版本说明见` : `Current stable release ${releaseTag}. See the`;
      try { localStorage.setItem(releaseCacheKey, JSON.stringify({ tag: releaseTag, time: Date.now() })); } catch {}
    })
    .catch(() => {});
}
