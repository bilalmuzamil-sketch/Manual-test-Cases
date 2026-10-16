import {os,J,post} from './lib.mjs'; import fs from 'fs';
export {J,post};
export const HD={workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'};
export async function start(o={}){ const s=await os(o); await post(s,'/api/iam/change-location',HD); return s; }
export const sleep=ms=>new Promise(r=>setTimeout(r,ms));
// what the Lines tab shows in each line's Labor rows, read from the screen
export async function labor(s,wid,{reload=true}={}){
  const p=s.page; if(reload){ await s.go(`/workorders/${wid}/lines`); await p.waitForTimeout(3500); }
  // every name drawn in a line's Labor rows (named rows AND rows drawn without an id, e.g. "Deleted user")
  return await p.evaluate(()=>{ const out={}; for(const tr of document.querySelectorAll('tr[class*="line-row-"]')){
      const id=[...tr.classList].find(c=>c.startsWith('line-row-'))?.slice(9); const td=tr.querySelectorAll('td');
      if(!id||!tr.classList.contains('wo-table-row')||(td.length!==4&&td.length!==3)||!/^\s*(Labor)?\s*$/.test(td[0]?.innerText||'')) continue;
      const names=[...tr.querySelectorAll('div.row.items-center.no-wrap')].map(d=>d.querySelector('span')?.innerText.trim()).filter(Boolean);
      (out[id]=out[id]||[]).push(...names); } return out; });
}
export async function apiTasks(s,wid){ const d=(await s.api('/api/work-orders/lines/'+wid)).json?.data; const ls=Array.isArray(d)?d:d?.collection||[];
  return ls.map(l=>({line:l.line_name.trim(),id:l.line_id,story:l.tech_story,rows:l.tasks.map(t=>`${t.first_name}${t.last_name?' '+t.last_name:''}|exists=${t.tech_exists}|${t.logged_time_decimal}`)})); }
export async function clock(s,lineId,story,waitMs=62000,cap=null){
  const p=s.page; await p.locator(`[data-test-id="button_clock_toggle_task_${lineId}"]`).click(); await p.waitForTimeout(2500);
  if(cap) await cap('started');
  await sleep(waitMs);
  await p.locator(`[data-test-id="button_clock_toggle_task_${lineId}"]`).click(); await p.waitForTimeout(2000);
  await p.locator('[data-test-id="input_tech_story"]').last().fill(story); if(cap) await cap('stopdialog');
  await p.locator('[data-test-id="button_clock_out"]').last().click(); await p.waitForTimeout(3000);
}
// move the (only / named) timesheet row to line number n via the Edit Timesheet window
export async function moveEntry(s,wid,{who,fromText,toText,cap=null,viaMenu=true}){
  const p=s.page;
  if(viaMenu){ await p.locator('[data-test-id="button_work_order_nav_bar_menu"]').click(); await p.waitForTimeout(700); await p.locator('[data-test-id="menu_item_timesheets"]').click(); await p.waitForTimeout(3500); }
  else { await s.go(`/workorders/${wid}/timesheets`); await p.waitForTimeout(3500); }
  let row=p.locator('tbody tr').filter({hasText:who}); if(fromText) row=row.filter({hasText:fromText}); row=row.first();
  await row.hover(); await p.waitForTimeout(500); if(cap) await cap('timesheets');
  await row.locator('[data-test-id="button_edit_timesheet"]').click(); await p.waitForTimeout(2000);
  const d=p.locator('.q-dialog').last(); await d.locator('[data-test-id="select_timesheet_line"]').click(); await p.waitForTimeout(1000);
  await p.locator('.q-menu .q-item').filter({hasText:toText}).first().click(); await p.waitForTimeout(800);
  if(cap) await cap('editdialog');
  const resp=p.waitForResponse(r=>/timesheet|technician-task|task-record|punch/i.test(r.url()) && r.request().method()!=='GET',{timeout:15000}).catch(()=>null);
  await d.locator('[data-test-id="button_save_timesheet"]').click(); const r=await resp; await p.waitForTimeout(2500);
  const toasts=await p.locator('.q-notification').allInnerTexts().catch(()=>[]);
  return {save:r?`${r.status()} ${new URL(r.url()).pathname}`:null,toasts,dialogsOpen:await p.locator('.q-dialog').count()};
}
export async function shot(s,file,clip){ await s.page.screenshot({path:file,...(clip?{clip}:{})}); }
