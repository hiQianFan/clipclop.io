import assert from "node:assert/strict";
import test from "node:test";
import worker from "./worker.js";

const object = (value, type = "application/json") => ({
  body: typeof value === "string" ? value : JSON.stringify(value),
  httpEtag: '"etag"',
  text: async () => typeof value === "string" ? value : JSON.stringify(value),
  writeHttpMetadata: headers => headers.set("content-type", type),
});
const env = (objects = {}) => ({
  RELEASES: { get: async key => objects[key] ?? null },
  ASSETS: { fetch: async request => new Response(`asset:${new URL(request.url).pathname}`) },
});
const request = (path, method = "GET") => new Request(`https://clipclop.io${path}`, { method });

test("redirects validated platform downloads", async () => {
  const runtime = env({ "downloads.json": object({ macos: "/releases/v1/ClipClop.dmg" }) });
  const response = await worker.fetch(request("/download/macos"), runtime);
  assert.equal(response.status, 302);
  assert.equal(response.headers.get("location"), "https://clipclop.io/releases/v1/ClipClop.dmg");
  assert.equal(response.headers.get("cache-control"), "no-cache");
  assert.equal((await worker.fetch(request("/download/macos", "POST"), runtime)).status, 405);
});

test("rejects unsafe or missing download metadata", async () => {
  for (const value of [{ macos: "https://example.com/file.dmg" }, {}, null]) {
    const runtime = env(value ? { "downloads.json": object(value) } : {});
    assert.equal((await worker.fetch(request("/download/macos"), runtime)).status, 503);
  }
});

test("serves updater and immutable releases from R2", async () => {
  const runtime = env({
    "latest.json": object("{}"),
    "releases/v1/ClipClop.dmg": object("binary", "application/x-apple-diskimage"),
  });
  const latest = await worker.fetch(request("/latest.json"), runtime);
  assert.equal(latest.headers.get("cache-control"), "no-cache");
  assert.equal(await latest.text(), "{}");
  const release = await worker.fetch(request("/releases/v1/ClipClop.dmg", "HEAD"), runtime);
  assert.equal(release.headers.get("cache-control"), "public, max-age=31536000, immutable");
  assert.equal(release.headers.get("content-type"), "application/x-apple-diskimage");
  assert.equal(await release.text(), "");
  assert.equal((await worker.fetch(request("/releases/missing"), runtime)).status, 404);
});

test("delegates website routes to Static Assets", async () => {
  for (const path of ["/zh", "/en/download", "/zh/privacy", "/en/changelog", "/favicon.svg", "/unknown"]) {
    assert.equal(await (await worker.fetch(request(path), env())).text(), `asset:${path}`);
  }
});

test("redirects bare pages to the preferred supported language", async () => {
  const cases = [
    ["/", "zh-CN,zh;q=0.9,en;q=0.8", "/zh"],
    ["/privacy", "en;q=0.7,zh;q=0.9", "/zh/privacy"],
    ["/changelog", "fr-FR, en;q=0.5", "/en/changelog"],
    ["/download", "", "/en/download"],
  ];
  for (const [path, language, target] of cases) {
    const response = await worker.fetch(new Request(`https://clipclop.io${path}?from=test`, { headers: { "accept-language": language } }), env());
    assert.equal(response.status, 302);
    assert.equal(response.headers.get("location"), `https://clipclop.io${target}?from=test`);
    assert.equal(response.headers.get("vary"), "Accept-Language");
    assert.equal(response.headers.get("cache-control"), "no-store");
  }
});
