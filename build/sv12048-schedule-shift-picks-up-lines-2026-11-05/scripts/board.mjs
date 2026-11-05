// prints tomorrow's board: technicians with working windows, existing shifts count; departments
import {sess,arr} from './common.mjs'; import fs from 'fs';
const s=await sess(); await s.go('/schedule'); await s.page.waitForTimeout(4000);
const t=new Date(Date.now()+86400000); const d=t.toISOString().slice(0,10);
const rr=await s.api(`/api/schedule/board?from=${d}T00:00:00Z&to=${d}T23:59:59Z`); console.log('board',rr.status,JSON.stringify(rr.json).slice(0,300)); const b=rr.json?.data?.board||{}; fs.writeFileSync('/tmp/sv12048/board-tomorrow.json',JSON.stringify(b,null,1));
console.log('keys',Object.keys(b||{}),'shifts',b?.shifts?.length,'ww',b?.workingWindows?.length);
console.log('windows sample',JSON.stringify((b?.workingWindows||[]).slice(0,4)));
const lanes=await s.page.evaluate(()=>[...document.querySelectorAll('[data-staff-id]')].map(e=>e.getAttribute('data-staff-id')+'='+e.innerText.trim().split('\n')[0]).slice(0,30)); console.log('lanes',lanes.length,lanes.slice(0,12));
await s.page.screenshot({path:'../ev/branch-schedule.png'}); await s.close(); process.exit(0);
