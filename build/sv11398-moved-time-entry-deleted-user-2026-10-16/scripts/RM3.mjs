import {start,labor,apiTasks,moveEntry,clock,shot,J} from './drv.mjs'; import fs from 'fs';
const W=JSON.parse(fs.readFileSync('wo1.json')); const s=await start(); const out={};
await labor(s,W.wid); await clock(s,W.lines[1].id,'ZZAUTOTEST M3 own time on line 2');
out.before=await labor(s,W.wid); out.apiBefore=await apiTasks(s,W.wid); await shot(s,'ev/m3-0-before.png');
out.move=await moveEntry(s,W.wid,{who:'Admin ShopView',fromText:'1 - Service',toText:'2 Replace',cap:async n=>shot(s,`ev/m3-${n}.png`)});
out.after=await labor(s,W.wid); out.api=await apiTasks(s,W.wid); await shot(s,'ev/m3-1-after-reload.png');
await s.go(`/workorders/${W.wid}/timesheets`); await s.page.waitForTimeout(3000); out.timesheets=(await s.page.locator('tbody tr').allInnerTexts()).map(t=>t.replace(/\s+/g,' ')); await shot(s,'ev/m3-2-timesheets.png');
fs.writeFileSync('ev/m3.json',JSON.stringify(out,null,1)); console.log(J(out,3000)); await s.close();
