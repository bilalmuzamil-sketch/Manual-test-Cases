// Open the Issue Credit dialog for an invoice and capture BOTH the screenshot and the real
// geometry of the figures being evidenced, so the annotation points at the actual pixels.
import { open, ensureHD, mode } from '/tmp/sv8815-staging/boot.mjs';
import * as L from '/tmp/sv8815-staging/lib.mjs';
import fs from 'node:fs';
const CID='b3aa863a-665d-4096-8a14-b6c0bd9d50ee';
const PS=process.argv[2], TAG=process.argv[3];
const s=await open(); const p=s.page; const out={tag:TAG};
await ensureHD(s);
out.mode=await mode(s); out.ps=await L.psView(s,PS);
out.build=await p.evaluate(()=>document.querySelector('meta[name=app-version]')?.content);
console.log(TAG,'| mode',out.mode,'| invoice',out.ps.num,'frozen tax',out.ps.tax,'total',out.ps.total);
await p.goto(`${s.APP}/customers/${CID}/invoices`,{waitUntil:'domcontentloaded',timeout:60000});
await p.waitForTimeout(14000);
const num=out.ps.num.replace(/^P-?/,'');
const cb=await p.evaluate(n=>{for(const tr of document.querySelectorAll('tr')){
  if((tr.innerText||'').includes(n)){const c=tr.querySelector('input[type=checkbox], .q-checkbox');
    if(c){c.scrollIntoView({block:'center',behavior:'instant'});const r=c.getBoundingClientRect();
      return {x:r.x,y:r.y,w:r.width,h:r.height};}}} return null;},num);
if(!cb) throw new Error('row not found '+num);
await p.mouse.click(cb.x+cb.w/2,cb.y+cb.h/2); await p.waitForTimeout(3000);
await L.clickTestId(s,'button_issue_credit_customer'); await p.waitForTimeout(12000);
out.geom=await p.evaluate(()=>{
  const g={}; const box=e=>{const r=e.getBoundingClientRect();return{x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)};};
  for(const e of document.querySelectorAll('[data-test-id]')){
    const id=e.getAttribute('data-test-id');
    if(/^currency_text_parts_return_(total_|tax$|subtotal$|total$)/.test(id)) g[id]={...box(e),text:e.innerText.trim()};
    if(/^table_cell_parts_return_partNumber_/.test(id)) g[id]={...box(e),text:e.innerText.trim()};
    if(id==='text_issue_credit_invoice_number') g[id]={...box(e),text:e.innerText.trim()};
  }
  return g;});
console.log('geometry captured:',Object.keys(out.geom).length,'elements');
Object.entries(out.geom).forEach(([k,v])=>console.log('   ',k,'=',JSON.stringify(v.text),v.x+','+v.y));
await p.screenshot({path:`/tmp/sv8815-staging/${TAG}.png`,fullPage:false});
fs.writeFileSync(`/tmp/sv8815-staging/${TAG}-geom.json`,JSON.stringify(out,null,1));
await s.browser.close();
