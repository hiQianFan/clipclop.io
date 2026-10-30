// Renders promo/index.html frame by frame with the real app frontend embedded.
// Needs the main repo frontend: (cd ../ClipClop && pnpm dev --host 127.0.0.1 --port 1420)
// node promo/render.mjs --ar 16x9 [--fps 30] [--still 1.5,4.8]   (stills → promo/out/*.png, otherwise → promo/out/*.mp4 via ffmpeg)
import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import { webkit } from "playwright-core";
import { installFixture } from "./fixture.js";
import zh from "../src/features/home/i18n/zh.ts";

const { values: opts } = parseArgs({ options: {
  ar: { type: "string", default: "16x9" },
  fps: { type: "string", default: "30" },
  still: { type: "string" },
  theme: { type: "string", default: "dark" },
} });
const origin = "http://127.0.0.1:1420";
const root = new URL("../", import.meta.url);
const out = new URL("promo/out/", root);
await mkdir(out, { recursive: true });

const dataUrl = async (path, type) => `data:${type};base64,${(await readFile(new URL(path, root))).toString("base64")}`;
const assets = "src/features/home/assets/";
const icons = {
  chrome: await dataUrl(`${assets}source-google-chrome.png`, "image/png"),
  safari: await dataUrl(`${assets}source-safari.png`, "image/png"),
  folder: await dataUrl(`${assets}source-finder.png`, "image/png"),
  image: await dataUrl(`${assets}source-preview.png`, "image/png"),
  codex: await dataUrl(`${assets}source-codex.svg`, "image/svg+xml"),
  claude: await dataUrl(`${assets}source-claude.svg`, "image/svg+xml"),
  edge: await dataUrl(`${assets}source-edge.svg`, "image/svg+xml"),
  device: await dataUrl("public/icon.png", "image/png"),
};
const fixture = { origin, clips: zh.demo.clips, icons, imageUrl: icons.device, theme: opts.theme, language: "zh-CN" };

const [w, h] = opts.ar === "9x16" ? [540, 960] : [960, 540];
const fps = Number(opts.fps);
// WebKit, because the app ships in WKWebView on macOS: same fonts (ui-monospace → SF Mono) and rendering.
const browser = await webkit.launch({ headless: true });
try {
  const context = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 3, locale: "zh-CN", colorScheme: opts.theme });
  await context.addInitScript(installFixture, fixture);
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(new URL(`promo/index.html?ar=${opts.ar}`, root).href);
  await page.evaluate((init) => window.PROMO.init(init), { appUrl: origin, scene: zh.summon.scenes[0] });
  const app = page.frames().find((frame) => frame.url().startsWith(origin));
  await app.getByRole("option").first().waitFor();
  await app.getByRole("listbox").focus(); // keyboard input goes to the app, as when the panel opens

  const { duration, app: events } = await page.evaluate(() => ({ duration: window.PROMO.duration, app: window.PROMO.app }));
  const stills = opts.still?.split(",").map((s) => Math.round(Number(s) * fps));
  const total = Math.round(duration * fps);
  const name = `promo-${opts.ar}`;
  const ffmpeg = stills ? null : spawn("ffmpeg", ["-y", "-f", "image2pipe", "-framerate", String(fps), "-i", "-",
    "-vf", `scale=${w * 2}:${h * 2}:flags=lanczos`, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "16", "-preset", "slow", "-movflags", "+faststart", new URL(`${name}.silent.mp4`, out).pathname],
    { stdio: ["pipe", "inherit", "inherit"] });
  let next = 0;
  for (let frame = 0; frame < total; frame++) {
    const t = frame / fps;
    let acted = false;
    while (next < events.length && events[next].t <= t) {
      await page.keyboard.press(events[next++].press); // goes to the focused iframe
      acted = true;
    }
    if (acted) await page.waitForTimeout(250); // app search debounces 120ms; let it and the IPC settle before the frame
    await page.evaluate((t) => window.PROMO.seek(t), t);
    if (stills && !stills.includes(frame)) continue;
    const png = await page.screenshot({ type: "png" });
    if (stills) await writeFile(new URL(`${name}-${t.toFixed(2)}s.png`, out), png);
    else if (!ffmpeg.stdin.write(png)) await new Promise((resolve) => ffmpeg.stdin.once("drain", resolve));
    if (stills && frame >= Math.max(...stills)) break;
  }
  if (ffmpeg) {
    ffmpeg.stdin.end();
    await new Promise((resolve, reject) => ffmpeg.on("close", (code) => code ? reject(new Error(`ffmpeg exited ${code}`)) : resolve()));
  }
  if (ffmpeg) await mixClops(name, await page.evaluate(() => window.PROMO.clops), duration);
  const unknown = await app.evaluate(() => [...new Set(window.__promoUnknown)]);
  const pasted = await page.evaluate(() => window.PROMO.pastedAt);
  console.log(`done: ${name}; paste at ${pasted ?? "NEVER"}s; unmocked commands: ${unknown.join(", ") || "none"}; page errors: ${errors.length}`);
  if (pasted === null) process.exitCode = 1; // the timeline must reach a real paste_clip, or the story is fake
} finally {
  await browser.close();
}

// ponytail: synthesized woodblock "clop" as a placeholder; swap in recorded hoof foley when available.
function mixClops(name, clops, duration) {
  const clop = "0.55*sin(2*PI*1150*t)*exp(-85*t)+0.5*sin(2*PI*240*t)*exp(-32*t)+0.18*(random(0)*2-1)*exp(-220*t)";
  const split = `[1]asplit=${clops.length}${clops.map((_, i) => `[s${i}]`).join("")}`;
  const delayed = clops.map((at, i) => `[s${i}]adelay=${Math.round(at * 1000)}:all=1[c${i}]`).join(";");
  const mix = `${clops.map((_, i) => `[c${i}]`).join("")}amix=inputs=${clops.length}:normalize=0,apad=whole_dur=${duration}[aud]`;
  const args = ["-y", "-i", new URL(`${name}.silent.mp4`, out).pathname,
    "-f", "lavfi", "-i", `aevalsrc=${clop}:d=0.3:s=48000`,
    "-filter_complex", `${split};${delayed};${mix}`,
    "-map", "0:v", "-map", "[aud]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", new URL(`${name}.mp4`, out).pathname];
  return new Promise((resolve, reject) => spawn("ffmpeg", args, { stdio: ["ignore", "ignore", "inherit"] })
    .on("close", (code) => code ? reject(new Error(`ffmpeg mux exited ${code}`)) : resolve()));
}
