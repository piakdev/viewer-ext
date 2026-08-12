// CC Viewer Zen — hide composer + action menu + session header, maximize read area
const VERSION = "1.0.6";
console.log(
  `%c[CC Viewer Zen v${VERSION}]%c loaded`,
  "color:#fff;background:#7c3aed;padding:2px 6px;border-radius:3px",
  "color:#7c3aed",
);

// ── 1. composer (textarea + wrapper flex-shrink-0) ──
function hideComposer() {
  const ta = document.querySelector(
    'textarea[data-slot="textarea"], textarea[aria-label*="Message input"], textarea[placeholder*="Type your message"]',
  );
  if (!ta) return;
  let el = ta;
  for (let i = 0; i < 8 && el; i++) {
    if (el.classList && el.classList.contains("flex-shrink-0")) {
      el.style.setProperty("display", "none", "important");
      return;
    }
    el = el.parentElement;
  }
  ta.style.setProperty("display", "none", "important");
}

// ── 2. ChatActionMenu (footer: + New / ↑↓ / Default / Claude Code) ──
function hideActionMenu() {
  document.querySelectorAll("div.w-full.pt-3").forEach((el) => {
    if (el.querySelector("button")) {
      el.style.setProperty("display", "none", "important");
    }
  });
}

// ── 3. session header (sticky bar: ← / "001" / ⋮) ──
// source: <header className="... sticky top-0 z-10 ... border-b border-border/40">
// เจาะจง header.sticky ที่มี border-b (ไม่โดน app header หลัก)
function hideSessionHeader() {
  document.querySelectorAll("header").forEach((h) => {
    const c = h.className || "";
    if (
      typeof c === "string" &&
      c.includes("sticky") &&
      c.includes("top-0")
    ) {
      h.style.setProperty("display", "none", "important");
    }
  });
}

// ── 4. app header (breadcrumb bar บนสุด: project path / session id) ──
// source AppLayout.tsx: <header className="h-(--spacing-header-height) ... bg-muted/30 ...">
// ไม่ซ่อน — แค่บีบให้เตี้ยลง 25% (nav ยังใช้ได้)
function slimAppHeader() {
  document.querySelectorAll("header").forEach((h) => {
    const c = h.className || "";
    if (typeof c === "string" && c.includes("bg-muted/30")) {
      // อ่านความสูงจริงครั้งแรก แล้วบีบเหลือ 75% (เตี้ยลง 25%, ตัวหนังสือคงเดิม)
      if (!h.dataset.zenSlim) {
        const full = h.getBoundingClientRect().height;
        if (full > 0) {
          h.style.setProperty("height", `${full * 0.75}px`, "important");
          h.style.setProperty("min-height", "0", "important");
          h.style.setProperty("overflow", "hidden", "important");
          h.dataset.zenSlim = "1";
        }
      }
    }
  });
}

function run() {
  hideComposer();
  hideActionMenu();
  hideSessionHeader();
  slimAppHeader();
}
run();
const obs = new MutationObserver(run);
obs.observe(document.documentElement, { childList: true, subtree: true });
