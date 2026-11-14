import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess({dir:'/tmp/qa83'}); const p=s.page;
await s.go('/reports/ap-aging-summary?asOfDate=2026-12-31'); await p.waitForTimeout(6000);
const chip=await p.locator('[data-test-id=filter_chip_asOfDate]').first().evaluate(e=>{const r=e.getBoundingClientRect(); return [r.x,r.y,r.width,r.height]});
await p.screenshot({path:'../ev/cap/F-ap-summary-link.png'}); fs.writeFileSync('../ev/cap/F-ap-summary-link.json',JSON.stringify({url:p.url(),g:{chip}}));
console.log(p.url(),(await p.locator('[data-test-id=filter_chip_asOfDate]').innerText()).replace(/\s+/g,' '));
await s.close(); process.exit(0);
