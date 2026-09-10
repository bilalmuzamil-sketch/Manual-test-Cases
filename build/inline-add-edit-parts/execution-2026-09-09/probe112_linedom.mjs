// Diagnostic: how is a work order line represented on screen, and how do I address ONE line?
// Two attempts to scope "this line's Add Part button" have now failed in opposite directions —
// walking up the DOM matched every button on the page, and matching the line's description text
// matched no panel at all. So stop guessing the structure and read it.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/112-linedom.json`, JSON.stringify(R,null,1));
const WO='6a529a5f-dff9-4c13-9636-b41500e585f0';
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

const s = await boot('sv9315', `/workorders/${WO}/lines`, 'admin');
const {page, APP, APIH} = s;
const call=(m,p)=>page.evaluate(async({api,m,p})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{Accept:'application/json'},credentials:'include'});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j};},{api:APIH,m,p});

// what does the API say the lines are?
const lines = rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json);
R.apiLines = lines.map(l=>({line_id:l.line_id, status:l.status,
  keys:Object.keys(l).slice(0,24),
  description:l.description, name:l.name, lineName:l.lineName, complaint:l.complaint,
  title:l.title, cannedLine:l.canned_line_name||l.cannedLineName,
  nParts:(l.parts||[]).length, nRequests:(l.part_requests||[]).length}));
log('the API knows %d lines:', lines.length);
for (const l of R.apiLines) log('  %s | %s | desc=%j name=%j', l.line_id.slice(0,8), l.status, l.description, l.name);
save();

await page.waitForTimeout(9000);
await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
await page.waitForTimeout(7000);
await page.screenshot({path:`${DIR}/evidence/112-lines.png`, fullPage:true});

// what containers exist, and what does each hold?
R.dom = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const out={};
  out.expansionItems=[...document.querySelectorAll('.q-expansion-item')].map(e=>({
    text:t(e).slice(0,150), addPart:e.querySelectorAll('[data-test-id=button_add_part]').length,
    editControls:e.querySelectorAll('[data-test-id^=button_edit_part_]').length,
    classes:e.className.slice(0,120)}));
  const btns=[...document.querySelectorAll('[data-test-id=button_add_part]')];
  out.addPartButtons=btns.map(b=>{
    // walk up and describe the first 6 ancestors, so a real anchor can be identified
    const chain=[]; let e=b;
    for(let i=0;i<8&&e.parentElement;i++){ e=e.parentElement;
      chain.push({tag:e.tagName.toLowerCase(), cls:(e.className||'').toString().slice(0,70),
        id:e.id||null, testid:e.getAttribute&&e.getAttribute('data-test-id'),
        nAddPart:e.querySelectorAll('[data-test-id=button_add_part]').length,
        textStart:t(e).slice(0,70)}); }
    return {visible:isVis(b), chain};});
  // every data-test-id on the page that mentions a line
  out.lineTestIds=[...new Set([...document.querySelectorAll('[data-test-id]')]
    .map(e=>e.getAttribute('data-test-id')).filter(x=>/line/i.test(x)))].slice(0,40);
  out.bodyMentionsTag=/ZZAUTOTEST C45251 field check/.test(document.body.innerText);
  return out;}, VIS);
log('expansion items: %d', R.dom.expansionItems.length);
for (const e of R.dom.expansionItems) log('   addPart=%d edit=%d | %s', e.addPart, e.editControls, e.text.slice(0,90));
log('data-test-ids mentioning "line": %s', JSON.stringify(R.dom.lineTestIds));
log('is my line description on the page at all? %s', R.dom.bodyMentionsTag);
if (R.dom.addPartButtons[0]) {
  log('ancestors of the first Add Part button:');
  for (const a of R.dom.addPartButtons[0].chain)
    log('   <%s> cls=%s testid=%s nAddPart=%d | %s', a.tag, a.cls, a.testid, a.nAddPart, a.textStart);
}
save();
await s.browser.close();
log('done');
