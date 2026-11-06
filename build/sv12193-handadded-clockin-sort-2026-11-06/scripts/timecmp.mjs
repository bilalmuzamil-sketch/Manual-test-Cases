// same open entry: Reports > Timesheet Activities row vs the work order's Timesheets page row (NUM = WO number, WO = id, WHO = name part)
import {sess} from './common.mjs'; const s=await sess(); const p=s.page; const caps=[]; const E=process.env.ENV||'branch';
p.on('response',async r=>{ if(/technician-tasks|timesheet|punch/.test(r.url())&&r.request().method()==='GET'){ try{ const t=await r.text(); const m=t.match(/"start[A-Za-z_]*":"[^"]*"/g); if(m) caps.push(r.url().replace(/^https:\/\/[^/]+/,'').slice(0,70)+' '+[...new Set(m)].slice(0,4).join(' ')); }catch{} } });
await s.go('/reports/punch-clock-activities'); await p.waitForTimeout(9000);
const a=await p.evaluate(([n,w])=>[...document.querySelectorAll('tbody tr')].filter(r=>r.innerText.includes(n)&&r.innerText.includes(w)).map(r=>r.innerText.replace(/\s+/g,' ').slice(0,220)),[process.env.NUM,process.env.WHO]);
console.log('ACTIVITIES',JSON.stringify(a)); await p.screenshot({path:`../ev/${E}-time-activities.png`});
const box=await p.locator('tbody tr',{hasText:process.env.NUM}).filter({hasText:process.env.WHO}).first().boundingBox().catch(()=>null); console.log('act row box',JSON.stringify(box));
await s.go('/workorders/'+process.env.WO+'/timesheets'); await p.waitForTimeout(9000);
const b=await p.evaluate(w=>[...document.querySelectorAll('tbody tr')].filter(r=>r.innerText.includes(w)).map(r=>r.innerText.replace(/\s+/g,' ').slice(0,220)),process.env.WHO);
console.log('WO TIMESHEETS',JSON.stringify(b)); const box2=await p.locator('tbody tr',{hasText:process.env.WHO}).first().boundingBox().catch(()=>null); console.log('wo row box',JSON.stringify(box2)); await p.screenshot({path:`../ev/${E}-time-wo.png`});
const me=await s.api('/api/auth/me'); console.log('me tz',JSON.stringify(me.json).match(/"[a-z_]*time_?zone[a-z_]*":"[^"]*"/gi));
console.log('browser tz',await p.evaluate(()=>Intl.DateTimeFormat().resolvedOptions().timeZone)); console.log('raw',JSON.stringify(caps.slice(0,6))); await s.close(); process.exit(0);
