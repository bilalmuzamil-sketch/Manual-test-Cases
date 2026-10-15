// usage: node DD.mjs <env> <woFile> <tag>  : Lines tab -> Notes tab -> New Note once; count dialogs; fill top one, save; count dialogs + notes
import {ob,op,J,post} from './lib.mjs'; import fs from 'fs';
const [env,woFile,tag]=process.argv.slice(2); const A=JSON.parse(fs.readFileSync(woFile));
const s=env==='prod'?await op({tz:'America/New_York'}):await ob({tz:'America/New_York'}); const p=s.page;
await post(s,'/api/iam/change-location',A.loc||{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'});
const W=[]; p.on('request',r=>{ if(r.method()!=='GET'&&/\/api\/note/.test(r.url())) W.push(r.method()+' '+r.url().replace(/.*\/api/,'/api')); });
const run=async(label)=>{ const nb=await p.locator('[data-test-id^="note_card_"]').count(); W.length=0;
  await p.locator('[data-test-id="button_new_note"]').click(); await p.waitForTimeout(1800); const d1=await p.locator('.q-dialog').count();
  await p.locator('.q-dialog').last().locator('[data-test-id="input_note_content"]').fill('ZZAUTOTEST '+tag+' '+label); await p.locator('.q-dialog').last().locator('[data-test-id="button_save_note"]').click(); await p.waitForTimeout(3000);
  const d2=await p.locator('.q-dialog').count(); await p.screenshot({path:`ev/${tag}-${label}-after-save.png`}); const na=await p.locator('[data-test-id^="note_card_"]').count();
  console.log(tag,label,'| dialogs after one click',d1,'| writes',J(W),'| dialogs still open after Save',d2,'| note cards',nb,'->',na);
  if(d2){ await p.locator('.q-dialog').last().locator('[data-test-id="button_cancel_note"]').click().catch(()=>{}); await p.waitForTimeout(800); } };
await s.go('/workorders/'+A.work_order_id+'/notes'); await p.waitForTimeout(4000); await run('direct');
await s.go('/workorders/'+A.work_order_id+'/lines'); await p.waitForTimeout(3500); await p.locator('[data-test-id="link_notes_tab"]').click(); await p.waitForTimeout(3000); await run('via-tab');
await p.locator('[data-test-id="link_lines_tab"]').click(); await p.waitForTimeout(2500); await p.locator('[data-test-id="link_notes_tab"]').click(); await p.waitForTimeout(3000); await run('via-tab-twice');
await s.close();
