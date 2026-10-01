import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/staging-cookie-boot.mjs';
import fs from 'fs';
const OUT='/home/user/Manual-test-Cases/build/global-search/shortword-2026-10-01/';
const { page, browser } = await boot('/customers', { key:'admin', settle:12000 });
page.setDefaultTimeout(25000);
const t0=Date.now(); const beat=m=>console.log(`[${new Date().toISOString().slice(11,19)} +${Math.round((Date.now()-t0)/1000)}s] ${m}`);
async function search(term, tab){
  return await Promise.race([_s(term,tab), new Promise((_,r)=>setTimeout(()=>r(new Error('deadline')),70000))]);
}
async function _s(term, tab){
  await page.keyboard.press('Escape'); await page.waitForTimeout(300);
  await page.keyboard.press('Control+k'); await page.waitForTimeout(1000);
  await page.fill('.search-modal input',''); await page.waitForTimeout(220);
  await page.type('.search-modal input', term, {delay:30}); await page.waitForTimeout(3200);
  if(tab && tab!=='All'){ await page.evaluate(l=>{const t=[...document.querySelectorAll('.search-tabs__tab')]
      .find(e=>e.innerText.replace(/\s*\(\d+\)/,'').trim().toLowerCase()===l.toLowerCase()); if(t)t.click();},tab);
    await page.waitForTimeout(2000); }
  await page.mouse.move(0,0); await page.waitForTimeout(200);
  return await page.evaluate(()=>({
    panel:(document.querySelector('.search-modal')?.innerText||'').replace(/\s*\n\s*/g,' | ').slice(0,260),
    rows:[...document.querySelectorAll('.search-row')].slice(0,10).map(r=>({
      title:(r.querySelector('.search-row__title')?.innerText||'').replace(/\s+/g,' ').trim(),
      text:r.innerText.replace(/\s*\n\s*/g,' ').replace(/\s+/g,' ').trim()}))}));
}
const idOf=r=>(r.title||r.text).replace(/^\s*≈?\s*close match:\s*/i,'').replace(/\s+/g,' ').trim().toLowerCase();
const tri=w=>{w=w.toLowerCase();return new Set(w.length>=3?[...Array(w.length-2)].map((_,i)=>w.slice(i,i+3)):[w]);};
const jac=(a,b)=>{const A=tri(a),B=tri(b);const I=[...A].filter(x=>B.has(x)).length;const U=new Set([...A,...B]).size;return U?I/U:0;};
const transpose=w=>{for(let i=1;i<w.length;i++) if(w[i].toLowerCase()!==w[i-1].toLowerCase()){const a=[...w];[a[i-1],a[i]]=[a[i],a[i-1]];return a.join('');}return null;};
const sub=w=>{const i=w.length>>1;const a=[...w];a[i]=a[i].toLowerCase()==='x'?'z':'x';return a.join('');};

const PLAN=[['All','Maria'],['Work orders','Santa'],['Customers','Greene'],['Assets','Johnson'],
            ['Parts','Cleaner'],['Vendors','Ranking'],['Part sales','Adrian'],
            ['Purchase orders','Adams'],['Vendor invoices','Abadi']];
const out=[];
for(const [tab,word] of PLAN){
  const base=await search(word,tab);
  const baseIds=new Set(base.rows.map(idOf));
  const rec={tab,word,letters:word.length,exactRows:base.rows.length,
             exactSample:base.rows[0]?.text.slice(0,95), variants:[]};
  for(const [kind,v] of [['transposition',transpose(word)],['substitution',sub(word)]]){
    if(!v) continue;
    const r=await search(v,tab);
    const back=r.rows.filter(x=>baseIds.has(idOf(x))).length;
    rec.variants.push({kind,typed:v,overlap:+jac(word,v).toFixed(2),
      rowsShown:r.rows.length, cameBack:back, screen:r.panel});
    beat(`${tab.padEnd(16)} "${word}"->"${v}" chunkOverlap=${jac(word,v).toFixed(2)} rows=${r.rows.length} back=${back}`);
  }
  out.push(rec);
  fs.writeFileSync(OUT+'results.json', JSON.stringify(out,null,1));
}
console.log('SHORTWORD TEST DONE');
await browser.close();
