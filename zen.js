// CC Viewer Zen — hide composer + action menu, maximize read area
const VERSION = "1.0.4";
console.log(
  `%c[CC Viewer Zen v${VERSION}]%c loaded — hiding composer + action menu`,
  "color:#fff;background:#7c3aed;padding:2px 6px;border-radius:3px",
  "color:#7c3aed",
);

// ── 1. composer (textarea + wrapper flex-shrink-0) ──
function hideComposer() {
  const ta = document.querySelector(
    'textarea[data-slot="textarea"], textarea[aria-label*="Message input"], textarea[placeholder*="Type your message"]',
  );
  if (!ta) return false;
  let el = ta;
  for (let i = 0; i < 8 && el; i++) {
    if (el.classList && el.classList.contains("flex-shrink-0")) {
      el.style.setProperty("display", "none", "important");
      return true;
    }
    el = el.parentElement;
  }
  ta.style.setProperty("display", "none", "important");
  return true;
}

// ── 2. ChatActionMenu (footer: + New / ↑↓ / Default / Claude Code) ──
// source: <div className="w-full pt-3"><ChatActionMenu .../></div>
// ซ่อน div.w-full.pt-3 ที่เป็น sibling ก่อน composer footer
function hideActionMenu() {
  document.querySelectorAll("div.w-full.pt-3").forEach((el) => {
    // ยืนยันว่าเป็น action menu (มีปุ่ม/icon ข้างใน) แล้วอยู่ท้าย session
    if (el.querySelector("button")) {
      el.style.setProperty("display", "none", "important");
    }
  });
}

function run() {
  hideComposer();
  hideActionMenu();
}
run();
const obs = new MutationObserver(run);
obs.observe(document.documentElement, { childList: true, subtree: true });
