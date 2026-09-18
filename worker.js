const DOWNLOADS = { "/download/macos": "macos", "/download/windows": "windows" };
const LOCALIZED = new Set(["/", "/download", "/changelog", "/privacy"]);
const NO_CACHE = "no-cache";
const IMMUTABLE = "public, max-age=31536000, immutable";
const PUBLIC_JSON = "public, max-age=300";

function preferredLocale(header) {
  const supported = (header ?? "").split(",").map((entry, order) => {
    const [tag, ...parameters] = entry.trim().toLowerCase().split(";");
    const locale = tag.split("-")[0];
    const quality = Number(parameters.find(value => value.trim().startsWith("q="))?.trim().slice(2) ?? 1);
    return { locale, order, quality: Number.isFinite(quality) ? quality : 0 };
  }).filter(({ locale, quality }) => (locale === "zh" || locale === "en") && quality > 0)
    .sort((a, b) => b.quality - a.quality || a.order - b.order);
  return supported[0]?.locale === "zh" ? "zh" : "en";
}

function localizedRedirect(request, pathname) {
  const url = new URL(request.url);
  url.pathname = `/${preferredLocale(request.headers.get("accept-language"))}${pathname === "/" ? "" : pathname}`;
  return new Response(null, { status: 302, headers: { "cache-control": "no-store", location: url, vary: "Accept-Language" } });
}

function objectResponse(object, request, cacheControl, cors = false) {
  const headers = new Headers();
  object.writeHttpMetadata?.(headers);
  if (object.httpEtag) headers.set("etag", object.httpEtag);
  headers.set("cache-control", cacheControl);
  if (cors) headers.set("access-control-allow-origin", "*");
  return new Response(request.method === "HEAD" ? null : object.body, { headers });
}

async function download(request, env, platform) {
  if (request.method !== "GET" && request.method !== "HEAD") return new Response("Method Not Allowed", { status: 405 });
  try {
    const object = await env.RELEASES.get("downloads.json");
    if (!object) throw new Error("missing downloads.json");
    const target = JSON.parse(await object.text())[platform];
    if (typeof target !== "string" || !target.startsWith("/releases/")) throw new Error("invalid download target");
    return new Response(null, { status: 302, headers: { "cache-control": NO_CACHE, location: new URL(target, request.url) } });
  } catch {
    return new Response("Download temporarily unavailable", { status: 503 });
  }
}

function corsResponse(body, init = {}) {
  const headers = new Headers(init.headers);
  headers.set("access-control-allow-origin", "*");
  headers.set("access-control-allow-methods", "GET, HEAD, OPTIONS");
  return new Response(body, { ...init, headers });
}

async function releaseObject(request, env, key, cacheControl, cors = false) {
  if (request.method === "OPTIONS" && cors) return corsResponse(null, { status: 204 });
  if (request.method !== "GET" && request.method !== "HEAD") return cors ? corsResponse("Method Not Allowed", { status: 405 }) : new Response("Method Not Allowed", { status: 405 });
  let object;
  try {
    object = await env.RELEASES.get(key);
  } catch {
    return cors ? corsResponse("Unavailable", { status: 503, headers: { "cache-control": "no-store", "content-type": "application/json" } }) : new Response("Unavailable", { status: 503 });
  }
  if (object) return objectResponse(object, request, cacheControl, cors);
  return cors ? corsResponse("Not Found", { status: 404, headers: { "cache-control": "no-store", "content-type": "application/json" } }) : new Response("Not Found", { status: 404 });
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (DOWNLOADS[pathname]) return download(request, env, DOWNLOADS[pathname]);
    if (LOCALIZED.has(pathname)) return localizedRedirect(request, pathname);
    if (pathname === "/latest.json") return releaseObject(request, env, "latest.json", NO_CACHE);
    if (pathname === "/releases.json") return releaseObject(request, env, "releases.json", PUBLIC_JSON, true);
    if (pathname.startsWith("/releases/")) return releaseObject(request, env, pathname.slice(1), IMMUTABLE);
    return env.ASSETS.fetch(request);
  },
};
