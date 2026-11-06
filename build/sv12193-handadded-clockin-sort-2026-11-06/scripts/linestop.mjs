import {sess} from './common.mjs'; import fs from 'fs';
const S=JSON.parse(fs.readFileSync('/tmp/sv12193/seed-branch.json','utf8')); const X=S.X.X1; const L=X.lines[0].id; const s=await sess(); const p=s.page; const caps=[];
p.on('response',r=>{ if(r.request().method()==='POST'&&/technician-tasks/.test(r.url())) caps.push(r.status()+' '+r.url().replace(/^https:\/\/[^/]+/,'')); });
await s.go('/workorders/'+X.splitTo.id+'/lines'); await p.waitForTimeout(8000); await p.click(`[data-test-id="button_clock_toggle_task_${L}"]`); await p.waitForTimeout(2500);
await p.locator('[data-test-id="input_tech_story"] textarea, textarea[data-test-id="input_tech_story"]').first().fill('ZZAUTOTEST SV-12193'); await p.waitForTimeout(400);
await p.locator('.q-dialog button',{hasText:/^\s*Clock Out\s*$/}).last().click(); await p.waitForTimeout(3500); console.log(JSON.stringify(caps)); await s.close(); process.exit(0);
