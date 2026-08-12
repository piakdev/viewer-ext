// CC Viewer Zen — maximize read area ใน claude-code-viewer
// ซ่อน composer + action menu + session header, บีบ app header เตี้ยลง
//
// DOM refs (verify 12 ส.ค. 2026):
//   composer      : textarea[data-slot="textarea"] ใน wrapper .flex-shrink-0
//   action menu   : div.w-full.pt-3 (+ New / Default / Claude Code)
//   session header: <header class="... sticky top-0 ..."> (← / title / ⋮)
//   app header    : <header class="... bg-muted/30 ..."> (breadcrumb บนสุด)

const APP_HEADER_SCALE = 0.6; // app header เหลือ 60% ของความสูงเดิม

function hide(el) {
  el?.style.setProperty("display", "none", "important");
}

// composer: ไต่จาก textarea ขึ้นหา wrapper .flex-shrink-0 แล้วซ่อน
function hideComposer() {
  const ta = document.querySelector(
    'textarea[data-slot="textarea"], textarea[aria-label*="Message input"], textarea[placeholder*="Type your message"]',
  );
  if (!ta) return;
  let el = ta;
  for (let i = 0; i < 8 && el; i++, el = el.parentElement) {
    if (el.classList?.contains("flex-shrink-0")) return hide(el);
  }
  hide(ta);
}

// action menu footer
function hideActionMenu() {
  document.querySelectorAll("div.w-full.pt-3").forEach((el) => {
    if (el.querySelector("button")) hide(el);
  });
}

// session header (sticky bar)
function hideSessionHeader() {
  document.querySelectorAll("header").forEach((h) => {
    const c = h.className;
    if (typeof c === "string" && c.includes("sticky") && c.includes("top-0")) {
      hide(h);
    }
  });
}

// app header: บีบเตี้ยลง (ไม่ซ่อน — nav ยังใช้ได้)
function slimAppHeader() {
  document.querySelectorAll("header").forEach((h) => {
    const c = h.className;
    if (typeof c !== "string" || !c.includes("bg-muted/30")) return;
    if (h.dataset.zenSlim) return;
    const full = h.getBoundingClientRect().height;
    if (full <= 0) return;
    h.style.setProperty("height", `${full * APP_HEADER_SCALE}px`, "important");
    h.style.setProperty("min-height", "0", "important");
    h.style.setProperty("overflow", "hidden", "important");
    h.dataset.zenSlim = "1";
  });
}

function run() {
  hideComposer();
  hideActionMenu();
  hideSessionHeader();
  slimAppHeader();
}

run();
new MutationObserver(run).observe(document.documentElement, {
  childList: true,
  subtree: true,
});

// clipboard fix: inject page-context script เพื่อ patch navigator.clipboard
// (content_script อยู่ isolated world แก้ clipboard ของ page ตรงๆ ไม่ได้)
// ทำให้ปุ่ม Copy ทำงานบน HTTP (navigator.clipboard = secure-context only)
(function injectClipboardFix() {
  const s = document.createElement("script");
  s.src = chrome.runtime.getURL("clipboard-fix.js");
  s.onload = () => s.remove();
  (document.head || document.documentElement).appendChild(s);
})();
