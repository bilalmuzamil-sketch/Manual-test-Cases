import {J} from './lib.mjs'; import fs from 'fs';
// Open the completion wizard and get to the Resolve cores step. Returns a reader for that step.
export async function openWizard(s,A){
  const p=s.page; await s.go('/workorders/'+A.work_order_id+'/lines'); await p.waitForTimeout(4500);
  await p.locator(`[data-test-id="button_action_complete_line_${A.line.line_id}"]`).click(); await p.waitForTimeout(2500);
}
export async function dlgButtons(p){ return p.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].pop(); return d?[...d.querySelectorAll('button')].map(b=>(b.getAttribute('data-test-id')||'-')+'|'+b.innerText.trim().replace(/\s+/g,' ')+(b.disabled||b.classList.contains('disabled')?'(dis)':'')):[];}); }
export async function readCores(p){ return p.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].pop(); if(!d) return null;
  const box=e=>{const r=e.getBoundingClientRect();return [Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)];};
  const rows=[...d.querySelectorAll('[data-test-id^="row_resolve_core_"]')].map(r=>{const k=r.getAttribute('data-test-id').slice(17);
    const g=t=>{const e=d.querySelector(`[data-test-id="${t}${k}"]`); return e?e.innerText.trim().replace(/\s+/g,' '):null};
    const btn=t=>{const e=d.querySelector(`[data-test-id="${t}${k}"]`); return e?{aria:e.getAttribute('aria-label'),text:e.innerText.trim(),cls:e.className.slice(0,60)}:null};
    return {key:k,text:r.innerText.trim().replace(/\s+/g,' '),subtitle:g('text_core_subtitle_'),charge:g('text_core_charge_'),note:g('text_core_charge_note_'),ok:btn('button_resolve_core_ok_'),notok:btn('button_resolve_core_not_ok_'),done:g('text_completed_core_'),box:box(r)};});
  const lists=[...d.querySelectorAll('[data-test-id^="list_cores_"]')].map(l=>[l.getAttribute('data-test-id'),l.innerText.trim().split('\n')[0]]);
  return {title:d.querySelector('[data-test-id="dialog_title"]')?.innerText, pills:[...d.querySelectorAll('[data-test-id^="pill_step_"]')].map(e=>e.innerText.trim()),lists,rows,all:d.innerText.replace(/\s+/g,' ').slice(0,1500)};}); }
export async function toCores(s,A,story='ZZAUTOTEST tech story'){
  const p=s.page; await openWizard(s,A);
  for(let i=0;i<4;i++){ const t=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].pop()?.querySelector('[data-test-id="dialog_title"]')?.innerText||'');
    if(/core/i.test(t)) break;
    const st=p.locator('[data-test-id^="input_tech_story_"]');
    if(/tech stor/i.test(t) && await st.count()){ for(let j=0;j<await st.count();j++){ const e=st.nth(j); if(!(await e.inputValue())){ await e.click(); await p.keyboard.type(story,{delay:10}); } } await p.keyboard.press('Tab'); await p.waitForTimeout(2500); continue; }
    const b=await dlgButtons(p); console.log('step',t,'buttons',J(b,300));
    const next=b.map(x=>x.split('|')).find(([tid,txt])=>!/cancel|close|back/i.test(tid+txt) && !/\(dis\)/.test(txt) && /next|continue|save|resolve|complete/i.test(txt));
    if(!next){ console.log('no next button'); break; }
    await p.locator(`.q-dialog [data-test-id="${next[0]}"]`).last().click(); await p.waitForTimeout(2500);
  }
}
