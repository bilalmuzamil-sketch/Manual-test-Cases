// C45035 (Tech view, EDIT row) and C45061 (Full View, ADD row):
// the work order becomes non-editable while an inline row is open with valid data; the Save must
// fail with the alert "This work order can no longer be edited. Refresh to see the latest." and the
// entered data must remain in the row.
//
// The status change is made through the API from a SECOND session, which is exactly what the case
// describes ("have the work order move to a status that does not permit editing") — the tester's own
// page is deliberately left stale, so this is the real race, not a simulation.
// The work order is put back to its original status at the end.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/105-noneditable.json`, JSON.stringify(R,null,1));
const mkCall=(page,APIH)=>(method,path,body)=>page.evaluate(async ({api,method,path,body})=>{
  const r=await fetch(`https://${api}${path}`,{method,
    headers:{'Content-Type':'application/json',Accept:'application/json'}, credentials:'include',
    body: body? JSON.stringify(body):undefined});
  let t=null; try{ t=await r.text(); }catch(e){}
  let j=null; try{ j=JSON.parse(t); }catch(e){}
  return {status:r.status, json:j, text:(t||'').slice(0,300)};}, {api:APIH, method, path, body:body||null});
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

// ---- 1. find an editable work order that already has a part on a line (C45035 precondition 4)
let WO=null, WOSTATUS=null;
{
  const s = await boot('sv9315','/workorders','admin'); const call=mkCall(s.page,s.APIH);
  const list = await call('GET','/api/work-orders?limit=200');
  const wos = rowsOf(list.json);
  R.woCount = wos.length;
  const editable = new Set(['estimate','approved','in_progress','review','in progress']);
  for (const w of wos){
    const st = String(w.status||w.status_name||'').toLowerCase().replace(/\s+/g,'_');
    if (!editable.has(st)) continue;
    const ln = await call('GET', `/api/work-orders/lines/${w.id}`);
    const lines = rowsOf(ln.json);
    const withPart = lines.find(l => (l.parts||[]).length>0);
    if (withPart){ WO={id:w.id, number:w.number||w.wo_number, line:withPart.line_id,
      nParts:(withPart.parts||[]).length}; WOSTATUS=w.status; break; }
  }
  R.chosenWorkOrder = WO; R.originalStatus = WOSTATUS;
  log('work order chosen: %s (original status %s)', JSON.stringify(WO), WOSTATUS);
  await s.browser.close();
}
if (!WO){ R.fatal='no editable work order with a part on a line was found'; save();
  console.log('STOP —', R.fatal); process.exit(0); }
save();

// ---- helper: flip the work order's status from an independent session
const setStatus = async (status)=>{
  const s = await boot('sv9315','/workorders','admin'); const call=mkCall(s.page,s.APIH);
  const r = await call('POST','/api/work-orders/change-status',{id:WO.id, status});
  const g = await call('GET', `/api/work-orders/${WO.id}`);
  const now = ((g.json&&(g.json.data||g.json))||{}).status;
  await s.browser.close();
  return {status:r.status, text:r.text, nowIs:now};
};

const runLeg = async (tag, who, openRow)=>{
  const out={who};
  const s = await boot('sv9315', `/workorders/${WO.id}/lines`, who);
  const {page, APP}=s;
  out.identity = await page.evaluate(()=>{try{const r=JSON.parse(localStorage.getItem('fe_permissions_wrapper')||'{}');const d=r.data??r;
    return {view_mode:d.view_mode, perms:(d.fe_permissions||[]).length};}catch(e){return{err:String(e)}}});
  await page.waitForTimeout(9000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(7000);
  // watch every save attempt the page makes
  const calls=[]; page.on('response', r=>{ const u=r.url();
    if (/\/api\/work-orders\/(part|lines)/.test(u) && r.request().method()!=='GET')
      calls.push({m:r.request().method(), u:u.replace(/^https?:\/\/[^/]+/,''), s:r.status()}); });
  out.opened = await openRow(page);
  if (!out.opened.ok){ out.skip='the inline row could not be opened with valid data'; await s.browser.close(); return out; }
  await page.screenshot({path:`${DIR}/evidence/105-${tag}-1-row-ready.png`, fullPage:true});

  // the work order goes non-editable underneath the open row
  out.flip = await setStatus('declined');
  log('  %s: work order -> declined: %s', tag, JSON.stringify(out.flip));
  if (String(out.flip.nowIs||'').toLowerCase()!=='declined'){
    out.skip='the work order would not move to a non-editable status'; await s.browser.close(); return out; }

  // now Save
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_save_inline_part]');
    if(b){b.scrollIntoView({block:'center'}); b.click();}});
  await page.waitForTimeout(7000);
  out.saveCalls = calls;
  out.after = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const d=document.querySelector('[data-test-id=input_inline_part_description]');
    const alerts=[...document.querySelectorAll('.q-notification,.q-banner,[role=alert],.q-dialog')]
      .filter(isVis).map(t).filter(Boolean);
    const body=(document.body.innerText||'');
    return {rowStillOpen:!!(d&&isVis(d)),
      description: d? d.value:null,
      quantity: (document.querySelector('[data-test-id=input_inline_part_quantity]')||{}).value ?? null,
      cost: (document.querySelector('[data-test-id=input_inline_part_cost]')||{}).value ?? null,
      alerts,
      mentionsNoLongerEdited: /no longer be edited/i.test(body),
      mentionsRefresh: /refresh to see the latest/i.test(body)};}, VIS);
  await page.screenshot({path:`${DIR}/evidence/105-${tag}-2-after-save.png`, fullPage:true});
  await s.browser.close();
  return out;
};

// ---- C45061: Full View (the admin user), an ADD row filled with valid data
R.C45061 = await runLeg('c45061','admin', async (page)=>{
  const canAdd = await page.evaluate(vis=>{const isVis=eval(vis);
    const b=[...document.querySelectorAll('[data-test-id=button_add_part]')].filter(isVis)[0];
    if(!b) return false; b.scrollIntoView({block:'center'}); b.click(); return true;}, VIS);
  if(!canAdd) return {ok:false, why:'no visible Add Part button'};
  await page.waitForTimeout(5000);
  const set=async(tid,val)=>page.evaluate(async({tid,val})=>{const i=document.querySelector(`[data-test-id=${tid}]`);
    if(!i) return false; i.focus(); const S=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
    S.call(i,val); i.dispatchEvent(new Event('input',{bubbles:true})); i.dispatchEvent(new Event('change',{bubbles:true}));
    return true;},{tid,val});
  const filled={desc:await set('input_inline_part_description','ZZAUTOTEST non-editable race'),
    qty:await set('input_inline_part_quantity','2'), cost:await set('input_inline_part_cost','10'),
    sell:await set('input_inline_part_sell_price','20')};
  await page.waitForTimeout(2500);
  return {ok:Object.values(filled).every(Boolean), filled};
});
log('C45061: %s', JSON.stringify(R.C45061)); save();
// put it back so the next leg has an editable work order
R.restore1 = await setStatus(WOSTATUS); log('restored to %s: %s', WOSTATUS, JSON.stringify(R.restore1)); save();

// ---- C45035: Tech view (the technician), an EDIT row with a change in it
R.C45035 = await runLeg('c45035','tech', async (page)=>{
  const opened = await page.evaluate(vis=>{const isVis=eval(vis);
    const b=[...document.querySelectorAll('[data-test-id^=button_edit_part_]')][0];
    if(!b) return false; b.scrollIntoView({block:'center'});
    const row=b.closest('tr')||b.parentElement; row&&row.dispatchEvent(new MouseEvent('mouseover',{bubbles:true}));
    b.click(); return true;}, VIS);
  if(!opened) return {ok:false, why:'no edit control found on any part row'};
  await page.waitForTimeout(5000);
  const changed = await page.evaluate(()=>{const i=document.querySelector('[data-test-id=input_inline_part_quantity]');
    if(!i) return false; i.focus(); const S=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
    S.call(i,'7'); i.dispatchEvent(new Event('input',{bubbles:true})); i.dispatchEvent(new Event('change',{bubbles:true}));
    return true;});
  await page.waitForTimeout(2500);
  return {ok:changed, changedQuantityTo:'7'};
});
log('C45035: %s', JSON.stringify(R.C45035)); save();
R.restore2 = await setStatus(WOSTATUS); log('FINAL restore to %s: %s', WOSTATUS, JSON.stringify(R.restore2)); save();
log('done');
