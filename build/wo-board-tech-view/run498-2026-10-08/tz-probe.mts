/** Which time zone does the shop use, and which does this test browser use? (Schedule cases drop on an hour column.) */
import { open } from './session.mts';
const { browser, page } = await open('/schedule');
const r = await page.evaluate(`(() => { const out = { browserTZ: Intl.DateTimeFormat().resolvedOptions().timeZone, now: new Date().toString() };
  for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); const v = localStorage.getItem(k) || ''; const m = v.match(/"(workplace_)?time_?zone"\\s*:\\s*"([^"]+)"/i); if (m) out['ls_' + k] = m[2]; } return out; })()`);
console.log('TZ', JSON.stringify(r));
await Promise.race([browser.close(), new Promise((r) => setTimeout(r, 8000))]); process.exit(0);
