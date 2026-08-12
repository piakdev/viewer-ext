// รันใน page context (main world) — patch navigator.clipboard.writeText
// ให้มี fallback execCommand เมื่ออยู่บน HTTP (insecure context)
// ครอบทุกที่ที่ viewer เรียก clipboard: copy message/code/command/session-path
(function () {
  function fallbackCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.top = "-9999px";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (_) {
      ok = false;
    }
    document.body.removeChild(ta);
    return ok;
  }

  const nav = navigator;
  const orig = nav.clipboard && nav.clipboard.writeText
    ? nav.clipboard.writeText.bind(nav.clipboard)
    : null;

  const writeText = (text) => {
    // secure context → ใช้ของเดิม (ถ้า fail ค่อย fallback)
    if (orig) {
      return orig(text).catch(() => {
        return fallbackCopy(text)
          ? Promise.resolve()
          : Promise.reject(new Error("copy failed"));
      });
    }
    // ไม่มี clipboard API เลย (HTTP) → fallback ตรง
    return fallbackCopy(text)
      ? Promise.resolve()
      : Promise.reject(new Error("copy failed"));
  };

  try {
    if (nav.clipboard) {
      Object.defineProperty(nav.clipboard, "writeText", {
        configurable: true,
        writable: true,
        value: writeText,
      });
    } else {
      Object.defineProperty(nav, "clipboard", {
        configurable: true,
        value: { writeText },
      });
    }
  } catch (_) {
    // เผื่อ defineProperty ไม่ได้ — เงียบไว้
  }
})();
