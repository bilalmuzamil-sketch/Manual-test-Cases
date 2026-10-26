export async function day(s,tag){
  const t=(await s.api('/api/reporting/individual-punch-clock/today?range=today')).json.data.collection;
  const cur=(await s.api('/api/technician-tasks/my-current-task')).json.data.technician_task;
  const m=(await s.api('/api/reporting/punch-clock-activities/today?pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=100&range=today')).json.data?.collection||[];
  const mine=m.filter(x=>/Bilal/.test(x.employee));
  console.log(`[${tag}] today-panel=${t.length} current=${JSON.stringify(cur).slice(0,160)} report-mine=${mine.length} ::`, mine.map(x=>`${x.id.slice(0,8)} ${x.clock_activity} ${x.clock_in}-${x.clock_out} active=${x.is_active}`).join(' ; '));
  return {t,cur,mine};
}
export function netlog(p,log){
  p.on('request',r=>{const u=r.url(); if(/\/api\//.test(u)&&!/envelope/.test(u)&&r.method()!=='GET') log.push(r.method()+' '+u.replace(/https:\/\/[^/]+/,'')+' '+(r.postData()||'').slice(0,300));});
  p.on('response',async r=>{const u=r.url(); if(/\/api\//.test(u)&&!/envelope/.test(u)&&r.request().method()!=='GET'){let t='';try{t=(await r.text()).slice(0,200)}catch{}; log.push('  -> '+r.status()+' '+t);}});
}
export async function dlg(p){return p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id], .q-menu [data-test-id]')].map(e=>e.getAttribute('data-test-id')+'='+e.innerText.trim().replace(/\n/g,' ').slice(0,50)).filter(x=>!/work_order_(number|customer)|department_name/.test(x)));}
export async function clockIn(p,dept='Department1'){
  await p.click('[data-test-id="clock_in_button"]'); await p.waitForTimeout(1800);
  await p.locator('.q-dialog [data-test-id="department_name"]',{hasText:new RegExp(dept)}).first().click(); await p.waitForTimeout(2500);
}
export async function clockOut(p,story='ZZAUTOTEST SV-10942'){
  await p.click('[data-test-id="clock_in_button"]'); await p.waitForTimeout(1800);
  await p.fill('.q-dialog [data-test-id="input_tech_story"] textarea, .q-dialog textarea[data-test-id="input_tech_story"]',story).catch(async()=>{await p.locator('.q-dialog textarea').first().fill(story)});
  await p.click('.q-dialog [data-test-id="button_clock_out"]'); await p.waitForTimeout(2500);
}
export async function newEntry(A,{staff='Bilal Muzammil',dept='Department1',start,end}){
  await A.click('[data-test-id="button_new_timesheet"]'); await A.waitForTimeout(1800);
  await A.click('[data-test-id="select_timesheet_staff"]'); await A.waitForTimeout(900);
  await A.locator('.q-menu .q-item',{hasText:new RegExp(staff+'$')}).first().click(); await A.waitForTimeout(900);
  await A.click('[data-test-id="select_timesheet_department"]'); await A.waitForTimeout(900); 
  await A.locator('.q-menu .q-item',{hasText:new RegExp(dept)}).first().click(); await A.waitForTimeout(700);
  const si=A.locator('.q-dialog input[data-test-id="input_timesheet_start_date"]'); await si.click(); await si.fill(start); await A.keyboard.press('Tab');
  if(end){const ei=A.locator('.q-dialog input[data-test-id="input_timesheet_end_date"]'); await ei.click(); await ei.fill(end); await A.keyboard.press('Tab');}
  await A.waitForTimeout(600);
}
