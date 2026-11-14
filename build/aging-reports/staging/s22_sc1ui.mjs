// s22_sc1ui.mjs — 14 Nov 2026: is customer C (special characters, invoice S2-40375 dated today, not yet due) on the A/R Summary when it is the only customer ticked (page address with customerIds)? Same for vendor C on A/P. Also reads which names the 3-customer chip holds. Read-only.
import { stgStart } from './stglib.mjs'; import fs from 'fs';
const OUT = new URL('./s22/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await stgStart(OUT); const p = s.page; const o = {}; const rows = () => p.evaluate(() => [...document.querySelectorAll('main tbody tr, main tfoot tr')].map((t) => t.innerText.replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 6));
const calls = []; p.on('response', (r) => { if (/reporting\/reports\/a[rp]-aging-summary/.test(r.url())) calls.push(r.url().replace(/^https:\/\/[^/]+/, '').slice(0, 300)); });
await s.go('/reports/ar-aging-summary?customerIds=a15d8732-3a9e-4929-862c-5eda3483e26f'); await p.waitForTimeout(5000); o.arRows = await rows(); o.arPic = await s.shot('ar-sc1-only'); o.arCalls = [...calls]; calls.length = 0;
await s.go('/reports/ap-aging-summary?vendorIds=4e8c9878-4a81-4d61-b546-dcbbcab00a59'); await p.waitForTimeout(5000); o.apRows = await rows(); o.apPic = await s.shot('ap-sv1-only'); o.apCalls = [...calls];
await s.go('/reports/ar-aging-detail?customerIds=a15d8732-3a9e-4929-862c-5eda3483e26f'); await p.waitForTimeout(5000); o.ardRows = await rows();
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log(JSON.stringify(o).slice(0, 2500)); await s.close(); process.exit(0);
