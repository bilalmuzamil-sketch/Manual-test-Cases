// Capture the EXACT body the app sends when a user creates a work order line, by clicking the app's
// own "New Line" control and recording the request. Guessing the payload got as far as a 500
// ("Labor or fixed prices must be set." -> "Line name is missing." -> 500), which is the point at
// which guessing stops being cheaper than watching.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/108-newline.json`, JSON.stringify(R,null,1));
const WO='6a529a5f-dff9-4c13-9636-b41500e585f0';

const s = await boot('sv9315', `/workorders/${WO}/lines`, 'admin');
const {page, APP, APIH} = s;
const posts=[];
page.on('request', r=>{ if(r.method()!=='GET' && /\/api\//.test(r.url()))
  posts.push({m:r.method(), u:r.url().replace(/^https?:\/\/[^/]+/,''), body:(r.postData()||'').slice(0,1500)}); });
page.on('response', async r=>{ if(r.request().method()!=='GET' && /\/api\/work-orders\/lines/.test(r.url())){
  const p=posts.find(x=>x.u===r.url().replace(/^https?:\/\/[^/]+/,'') && !x.status);
  if(p){ p.status=r.status(); try{ p.resp=(await r.text()).slice(0,400);}catch(e){} } }});

await page.waitForTimeout(9000);
R.newLine = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const b=[...document.querySelectorAll('button,[role=button],a')].filter(isVis)
    .find(e=>/^\+?\s*new\s+line$/i.test(t(e)));
  if(!b) return {found:false};
  b.scrollIntoView({block:'center'}); b.click(); return {found:true};}, VIS);
await page.waitForTimeout(6000);
await page.screenshot({path:`${DIR}/evidence/108-1-newline-form.png`, fullPage:true});

// what did clicking it put on the screen?
R.form = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const dlg=[...document.querySelectorAll('.q-dialog,.q-card,form')].filter(isVis).pop();
  const scope=dlg||document.body;
  return {
    fields:[...scope.querySelectorAll('input,select,textarea')].filter(isVis).map(i=>{
      const p=i.closest('.q-field'); const l=p&&p.querySelector('.q-field__label');
      return {label:l?t(l):(i.getAttribute('data-test-id')||i.name||i.placeholder||''),
        tid:i.getAttribute('data-test-id'), type:i.type, value:i.value,
        required: !!(i.required || (p && /\*/.test(t(p))))};}),
    buttons:[...scope.querySelectorAll('button')].filter(isVis).map(t).filter(Boolean).slice(0,20),
    heading:(scope.querySelector('h1,h2,h3,h4,.text-h6')||{}).textContent};}, VIS);
log('the New Line form: %s', JSON.stringify(R.form));
save();

// fill every visible text/number box that is empty, choose the first option in every select,
// then press whatever looks like the confirm button
const setVal = async (tid, val) => page.evaluate(({tid,val})=>{
  const i=document.querySelector(`[data-test-id="${tid}"]`); if(!i) return false;
  i.focus(); const proto = i.tagName==='TEXTAREA'? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
  const S=Object.getOwnPropertyDescriptor(proto,'value').set; S.call(i,val);
  i.dispatchEvent(new Event('input',{bubbles:true})); i.dispatchEvent(new Event('change',{bubbles:true}));
  return true;},{tid,val});
R.filled={};
for (const f of (R.form.fields||[])){
  if (!f.tid || f.value) continue;
  const v = /qty|quantity|hour|rate|price|cost|amount/i.test(f.label+f.tid) ? '1'
          : 'ZZAUTOTEST C45250/C45251 line';
  R.filled[f.tid] = await setVal(f.tid, v);
}
await page.waitForTimeout(2500);
await page.screenshot({path:`${DIR}/evidence/108-2-filled.png`, fullPage:true});
R.confirm = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const b=[...document.querySelectorAll('button')].filter(isVis)
    .find(e=>/^(save|add|create|add line|save line|confirm|ok|done)$/i.test(t(e)));
  if(!b) return {found:false, buttons:[...document.querySelectorAll('button')].filter(isVis).map(t).filter(Boolean).slice(0,25)};
  b.scrollIntoView({block:'center'}); b.click(); return {found:true, label:t(b)};}, VIS);
log('confirm: %s', JSON.stringify(R.confirm));
await page.waitForTimeout(9000);
await page.screenshot({path:`${DIR}/evidence/108-3-after.png`, fullPage:true});
R.requests = posts.filter(p=>/lines|line/i.test(p.u));
R.allNonGet = posts.map(p=>`${p.m} ${p.u}${p.status?' -> '+p.status:''}`);
log('non-GET calls: %s', JSON.stringify(R.allNonGet));
for (const p of R.requests) log('  %s %s -> %s | body=%s', p.m, p.u, p.status, p.body);
save();
await s.browser.close();
log('done');
