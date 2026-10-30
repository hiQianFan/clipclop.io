// Injected into every frame; only activates inside the real app frontend (main repo `pnpm dev` on :1420).
// Stands in for the Tauri backend with the website's demo items, so the panel is the real UI, not a replica.
export function installFixture({ origin, clips, icons, imageUrl, theme, language }) {
  if (location.origin !== origin) return;
  const now = "2026-09-29T04:12:00Z";
  const items = clips.map((clip, index) => ({
    id: `demo-${index}`,
    content_type: clip.type,
    preview: clip.type === "image" ? "" : clip.text,
    plain_text: clip.type === "file" ? clip.path : clip.text,
    source_app: { id: clip.icon, name: clip.source },
    created_at: now,
    last_used_at: now,
    is_favorite: index === 0,
    byte_size: new TextEncoder().encode(clip.text).length,
    metadata: clip.type === "image" ? { width: 1024, height: 1024 }
      : clip.type === "file" ? { files: [clip.path], file_sizes: [null] }
      : { char_count: [...clip.text].length },
    flavors: [],
  }));
  const settings = { retention_days: 30, history_limit: 500, move_used_to_top: false, restore_browse_position: false, preserve_search_conditions: false, trim_whitespace: false, file_preview_enabled: false, launch_at_login: false, hotkey: "Control+Super+C", theme, language, tray_click_action: "recent", check_updates: false, last_update_check: null, skipped_update_version: null };
  const resource = (data_url) => ({ data_url, byte_size: null, access_denied: false, is_directory: false });
  const tell = (message) => window.parent.postMessage({ promo: true, ...message }, "*");
  window.__promoUnknown = [];
  window.__TAURI_INTERNALS__ = {
    metadata: { currentWindow: { label: "main" }, currentWebview: { label: "main" } },
    transformCallback: () => 1,
    invoke: async (command, args = {}) => {
      switch (command) {
        case "get_settings": return settings;
        case "get_runtime_mode": return "real";
        case "get_startup_failure": return null;
        case "get_onboarding_state": return { completed_revision: 1, current_step: "overview", visited_steps: ["overview"], selected_example: "image" };
        case "get_preview_capability": return { provider: "unavailable", reason: "detection_failed", version: null };
        case "get_auto_paste_permission_status": return "granted";
        case "query_history": {
          const { query = "", page = 1, favorites_only, content_type } = args.request ?? {};
          const matching = items.filter((item) => (item.preview + item.plain_text).toLowerCase().includes(query.toLowerCase())
            && (!favorites_only || item.is_favorite)
            && (!content_type || item.content_type === content_type));
          return { items: matching.slice((page - 1) * 10, page * 10), page, page_size: 10, total: matching.length, total_pages: Math.ceil(matching.length / 10) };
        }
        case "get_history_facets": return { type_total: items.length, type_counts: items.reduce((counts, item) => ({ ...counts, [item.content_type]: (counts[item.content_type] ?? 0) + 1 }), {}), sources: [] };
        case "get_clip": return items.find((item) => item.id === args.id);
        case "get_clip_asset":
        case "get_clip_thumbnail": return resource(imageUrl);
        case "get_clip_file_asset": return resource(null);
        case "get_source_app_icon": return resource(icons[items.find((item) => item.id === args.id)?.source_app.id] ?? null);
        case "paste_clip": tell({ type: "paste", item: items.find((item) => item.id === args.id), plainText: args.plainText }); return "pasted";
        case "hide_panel": tell({ type: "hide" }); return null;
        case "plugin:event|listen":
        case "plugin:event|unlisten": return 1;
        default:
          window.__promoUnknown.push(command);
          return null;
      }
    },
  };
}
