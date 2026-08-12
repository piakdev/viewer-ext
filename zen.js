// CC Viewer Zen — hide composer, maximize read area
const VERSION = "1.0.3";
console.log(
  `%c[CC Viewer Zen v${VERSION}]%c loaded — hiding composer`,
  "color:#fff;background:#7c3aed;padding:2px 6px;border-radius:3px",
  "color:#7c3aed",
);

// JS-based hide: หา composer textarea แล้วซ่อน wrapper ที่ใกล้ที่สุด
// (แน่กว่า CSS :has() ใน content_scripts เพราะควบคุมเองได้)
function hideComposer() {
  const ta = document.querySelector(
    'textarea[data-slot="textarea"], textarea[aria-label*="Message input"], textarea[placeholder*="Type your message"]',
  );
  if (!ta) return false;

  // ไต่ขึ้นหา wrapper flex-shrink-0 (footer) แล้วซ่อน
  let el = ta;
  for (let i = 0; i < 8 && el; i++) {
    if (el.classList && el.classList.contains("flex-shrink-0")) {
      el.style.setProperty("display", "none", "important");
      console.log("[CC Viewer Zen] hid composer wrapper:", el.className);
      return true;
    }
    el = el.parentElement;
  }
  // fallback: ซ่อน textarea + parent 2 ชั้น (เผื่อไม่เจอ flex-shrink-0)
  ta.style.setProperty("display", "none", "important");
  console.log("[CC Viewer Zen] fallback: hid textarea directly");
  return true;
}

// viewer เป็น client-render + SPA → textarea มา/ไปตาม route
// ใช้ MutationObserver ยิงซ้ำทุกครั้ง DOM เปลี่ยน
const run = () => hideComposer();
run();
const obs = new MutationObserver(run);
obs.observe(document.documentElement, { childList: true, subtree: true });
