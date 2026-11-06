// admin presses Start on a line, on the work order's Lines screen
import {sess} from './common.mjs'; import fs from 'fs';
const S=JSON.parse(fs.readFileSync('/tmp/sv12193/seed-branch.json','utf8')); const X=S.X[process.env.WO]; const L=X.lines[Number(process.env.LINE||0)].id;
const s=await sess(); const p=s.page; const caps=[]; p.on('response',r=>{ if(r.request().method()==='POST'&&/technician-tasks|tasks\/create/.test(r.url())) caps.push(r.status()+' '+r.url().replace(/^https:\/\/[^/]+/,'')); });
const cur=(await s.api('/api/technician-tasks/my-current-task')).json?.data; console.log('current before',JSON.stringify(cur).slice(0,140));
await s.go('/workorders/'+X.id+'/lines'); await p.waitForTimeout(8000); await p.click(`[data-test-id="button_clock_toggle_task_${L}"]`); await p.waitForTimeout(4000);
const d=await p.evaluate(()=>{const d=document.querySelector('.q-dialog'); return d?d.innerText.replace(/\n+/g,' | ').slice(0,200):null;}); console.log('dialog',d); console.log(JSON.stringify(caps));
await s.close(); process.exit(0);
