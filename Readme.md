# CC Viewer Zen

Browser extension เล็กๆ ซ่อน input composer ใน [claude-code-viewer](https://github.com/d-kimuson/claude-code-viewer) → maximize พื้นที่อ่าน chat history เต็มจอ

เหมาะกับคนที่ใช้ viewer **อ่านอย่างเดียว** (ส่งคำถามผ่าน editor อื่น) ไม่ต้องการกล่อง input มาบังพื้นที่

## ทำอะไร

- ซ่อน `textarea` composer (`Type your message...` / `Type your response here...`)
- **ไม่แตะ search** — search box ใช้ `<input>` คนละ element กับ composer

เป็น declarative CSS inject ล้วน (ไม่มี JavaScript)

## ติดตั้ง

### Chrome / Brave / Edge (แนะนำ)

```
brave://extensions  (หรือ chrome://extensions)
→ Developer mode (เปิด)
→ Load unpacked → เลือกโฟลเดอร์นี้
```

extension ค้างถาวร ไม่หายเมื่อปิด browser · ไม่ต้องตั้งค่าอะไรเพิ่ม

### Firefox / LibreWolf

```
about:debugging → This Firefox → Load Temporary Add-on → เลือก manifest.json
```

> ⚠️ Temporary add-on หายเมื่อปิด browser + เจอ gotcha (CSS `:has()` / reload
> ไม่ apply). แนะนำใช้ Brave/Chrome แทน

## ปรับ host

default match `:3400` (localhost, 127.0.0.1, tailnet IP, piak.dev)
ถ้า viewer อยู่ host/port อื่น แก้ `matches` ใน `manifest.json` เอง

## ไฟล์

| ไฟล์ | หน้าที่ |
|---|---|
| `manifest.json` | MV3 + content_scripts (match host + inject css) |
| `zen.css` | selector ซ่อน composer |
