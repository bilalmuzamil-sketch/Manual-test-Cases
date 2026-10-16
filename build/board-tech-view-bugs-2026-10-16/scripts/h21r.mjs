import {session,toView} from './rec.mjs'; import fs from 'fs';
const s=await session({vp:{width:1440,height:900},dpr:1}); const p=s.page; const W=[];
p.on('request',r=>{ if(/preferences/.test(r.url())&&r.method()!=='GET') W.push({m:r.method(),u:r.url().replace(/^https:\/\/[^/]+/,''),b:r.postData()}); });
await s.go('/workorders?tab=all'); await p.waitForTimeout(4000); await toView(p,'tech_view'); await p.waitForTimeout(2000);
await p.click('[data-test-id=button_tech_view_column_selection]'); await p.waitForTimeout(1200);
const st=()=>p.evaluate(()=>[...document.querySelectorAll('[data-test-id^=toggle_tech_view_column_]')].map(t=>t.getAttribute('data-test-id').slice(24)+':'+t.getAttribute('aria-checked')+':'+t.className.slice(0,60)));
console.log(JSON.stringify(await st()));
for(const k of ['days_open','part_requests_count','part_return_requests_count']){ await p.locator(`[data-test-id=toggle_tech_view_column_${k}]`).scrollIntoViewIfNeeded(); await p.click(`[data-test-id=toggle_tech_view_column_${k}]`); await p.waitForTimeout(900);} 
console.log(JSON.stringify(await st())); await p.keyboard.press('Escape'); await p.waitForTimeout(2500);
console.log('WRITES',JSON.stringify(W.slice(-2)));
const pa=await s.api('/api/users/me/preferences/work-orders-list'); console.log('NOW',JSON.stringify(pa.json.data.value.techViewColumns)); await s.close();
