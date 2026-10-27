import {sess} from './lib.mjs';
const s=await sess(); const P=s.page; const log=[];
P.on('request',q=>{if(/technician-tasks\/(create|change|move)/.test(q.url()))log.push('REQ '+q.url().split('/api')[1]+' '+q.postData())});
P.on('response',async r=>{if(/technician-tasks\/(create|change|move)/.test(r.url()))log.push('RES '+r.status()+' '+(await r.text().catch(()=>'')).slice(0,250))});
await s.go('/reports/punch-clock-activities'); await P.waitForTimeout(3500);
await P.getByRole('button',{name:'New'}).click(); await P.waitForTimeout(1500);
async function pick(tid,text){const b=await s.box(tid); await P.mouse.click(b.x,b.y); await P.waitForTimeout(800);
  await P.waitForTimeout(1500);
  const opts=await P.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.trim()).slice(0,8)); console.log(tid,'opts',JSON.stringify(opts));
  const o=P.locator('.q-menu .q-item').filter({hasText:text}).first(); await o.click(); await P.waitForTimeout(800);}
await pick('select_timesheet_staff','Admin');
await pick('select_timesheet_department','Administration');
for(const [t,v] of [['input_timesheet_start_date','Oct 26, 2026 08:10 AM'],['input_timesheet_end_date','Oct 26, 2026 08:15 AM']]){
  const l=P.locator(`[data-test-id="${t}"] input, input[data-test-id="${t}"]`).first(); await l.click(); await l.fill(v); await P.keyboard.press('Tab'); await P.waitForTimeout(500);}
console.log(await P.evaluate(()=>document.querySelector('.q-dialog')?.innerText.replace(/\n+/g,' | ').slice(0,500)));
await P.screenshot({path:'../ev/n2-filled.png'});
const b=await s.box('button_save_timesheet'); await P.mouse.click(b.x,b.y); await P.waitForTimeout(3000);
console.log(log.join('\n')); console.log('dialog still open?',await P.evaluate(()=>!!document.querySelector('.q-dialog')));
await P.screenshot({path:'../ev/n2-after.png'});
await s.browser.close(); process.exit(0);
