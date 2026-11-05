// usage: node split.mjs <tag> -> Lines tab: tick the parts line, bulk menu > "Split work order" (clicked twice), records the new WO id into seed json as split_wo
import {sess} from './common.mjs'; import fs from 'fs';
const F=`/tmp/sv11006/seed-branch-${process.argv[2]}.json`; const S=JSON.parse(fs.readFileSync(F,'utf8')); const s=await sess({dpr:1}); const p=s.page;
await s.go('/workorders/'+S.wo+'/lines'); await p.waitForTimeout(4000);
await p.locator(`[data-test-id="line_number_${S.line}"]`).hover(); await p.waitForTimeout(500); await p.locator(`[data-test-id="line_checkbox_${S.line}"]`).click(); await p.waitForTimeout(800);
await p.locator('[data-test-id="button_bulk_more"]').click(); await p.waitForTimeout(1200);
const it=p.locator('.q-menu .q-item',{hasText:'Split work order'}).first(); const n=s.writes.length; await it.click(); await p.waitForTimeout(900); await p.screenshot({path:'../ev/branch-split-armed.png'});
if(await it.count()){ await it.click(); } await p.waitForTimeout(5000);
console.log('SENT',JSON.stringify(s.writes.slice(n).map(w=>w.slice(0,220)))); console.log('URL',p.url()); const m=p.url().match(/workorders\/([0-9a-f-]{36})/); if(m&&m[1]!==S.wo){ S.split_wo=m[1]; fs.writeFileSync(F,JSON.stringify(S,null,1)); }
console.log('newWO',S.split_wo, await p.locator('[data-test-id="text_wo_number"]').innerText().catch(()=>'')); await p.screenshot({path:'../ev/branch-split-after.png'}); await s.close(); process.exit(0);
