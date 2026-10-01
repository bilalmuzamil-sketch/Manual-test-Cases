/**
 * EVERY TAB, EVERY FIELD THAT TAB SEARCHES, EVERY DAMAGE PATTERN THE SPEC SUPPORTS.
 *
 * Fields are DISCOVERED, not assumed: each row names the field it matched on in its own labelled
 * note ("Category: ...", "Unit: ...", "Contact match: ..."), so searching broad terms and reading
 * those labels yields real (field, value) pairs that are PROVEN matchable exactly. The question
 * then becomes the sharp one: this field matches exactly - does it also match with a typo?
 *
 * Four classifications, not two. The third and fourth are what stop a spec gap being filed as a bug:
 *   WORKS                 - typo found the record
 *   CORRECT PER SPEC      - no match, and section 7 exempts this field (identifiers)
 *   AGAINST SPEC          - no match, and section 7 NAMES this field as fuzzy-indexed  -> fault
 *   SPEC GAP              - no match, field is indexed (section 4) but section 7 is silent -> ASK
 *
 * Only variants whose similarity clears the spec's own threshold are tested. A variant the spec
 * does not promise is not evidence of anything.
 */
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/staging-cookie-boot.mjs';
import fs from 'fs';
import { execFileSync } from 'node:child_process';
const OUT='/home/user/Manual-test-Cases/build/global-search/fuzzy-2026-10-01/';
const SPEC=JSON.parse(fs.readFileSync(OUT+'spec-field-matrix.json','utf8'));

function variants(w){
  const n=w.length, mid=n>>1, out=[];
  if(n>=4){ const a=[...w]; [a[mid-1],a[mid]]=[a[mid],a[mid-1]]; const t=a.join('');
            if(t.toLowerCase()!==w.toLowerCase()) out.push(['transposition',t]); }
  { const a=[...w]; a[mid]= a[mid].toLowerCase()!=='x'?'x':'z'; out.push(['substitution',a.join('')]); }
  out.push(['deletion', w.slice(0,mid)+w.slice(mid+1)]);
  out.push(['insertion', w.slice(0,mid)+'e'+w.slice(mid)]);
  return out.map(([kind,v])=>{ const sim=1-1/Math.max(v.length,w.length);
    const need=v.length>=4?0.70:0.80; return {kind,typed:v,sim:+sim.toFixed(3),need,must:sim>=need}; });
}
const { page, browser } = await boot('/customers', { key:'admin', settle:12000 });
async function search(term, tab){
  await page.keyboard.press('Escape'); await page.waitForTimeout(300);
  await page.keyboard.press('Control+k'); await page.waitForTimeout(1000);
  await page.fill('.search-modal input',''); await page.waitForTimeout(220);
  await page.type('.search-modal input', term, {delay:30}); await page.waitForTimeout(3000);
  if(tab){ const ok=await page.evaluate(l=>{const t=[...document.querySelectorAll('.search-tabs__tab')]
      .find(e=>e.innerText.replace(/\s*\(\d+\)/,'').trim().toLowerCase()===l.toLowerCase());
      if(!t)return false;t.click();return true;},tab);
    if(!ok) return {rows:[]}; await page.waitForTimeout(2000); }
  await page.mouse.move(0,0); await page.waitForTimeout(200);
  return await page.evaluate(()=>({rows:[...document.querySelectorAll('.search-row')].slice(0,12).map(r=>({
    title:(r.querySelector('.search-row__title')?.innerText||'').replace(/\s+/g,' ').trim(),
    text:r.innerText.replace(/\s*\n\s*/g,' ').replace(/\s+/g,' ').trim(),
    marks:[...r.querySelectorAll('mark')].map(m=>m.innerText.trim()),
    approx:/≈|close match/i.test(r.innerText)}))}));
}
const idOf=r=>(r.title||r.text).replace(/^\s*≈?\s*close match:\s*/i,'').replace(/\s+/g,' ').trim().toLowerCase();

const SEEDS={'Work orders':['repair','diesel','truck'],'Customers':['truck','repair','transport'],
 'Assets':['freightliner','truck','2019'],'Parts':['brake','filter','oil'],
 'Vendors':['supply','diesel','parts'],'Part sales':['truck','repair','trailer'],
 'Purchase orders':['diesel','repair','brake'],'Vendor invoices':['repair','diesel','trailer']};

const results=[];
for (const [tab,seeds] of Object.entries(SEEDS)){
  // ---- discover (field,value) pairs from the rows' own labelled notes ----
  const pairs=new Map();
  for (const s of seeds){
    const r=await search(s,tab);
    for (const row of r.rows){
      for (const m of row.text.matchAll(/([A-Z][A-Za-z ]{2,24}):\s*([^|·]{3,60}?)(?=\s+[·|]|\s*$)/g)){
        const field=m[1].trim(), val=m[2].trim();
        const word=(val.match(/[A-Za-z][A-Za-z'-]{5,}/g)||[])[0];
        if(word && !pairs.has(field)) pairs.set(field,{value:val, word});
      }
      const tw=(row.title.match(/[A-Za-z][A-Za-z'-]{5,}/g)||[])[0];
      if(tw && !pairs.has('(name on the row)')) pairs.set('(name on the row)',{value:row.title, word:tw});
    }
    if(pairs.size>=5) break;
  }
  console.log(`\n=== ${tab} === discovered fields: ${[...pairs.keys()].join(' | ')||'none'}`);
  for (const [field,{word}] of pairs){
    const base=await search(word,tab);
    if(!base.rows.length){ console.log(`  ${field}: "${word}" exact found nothing - skipping`); continue; }
    const baseIds=new Set(base.rows.map(idOf));
    for (const v of variants(word)){
      if(!v.must) continue;
      const t=await search(v.typed,tab);
      const back=t.rows.filter(r=>baseIds.has(idOf(r)));
      const hit=back.length>0;
      const hl=back.some(r=>r.marks.length);
      results.push({tab,field,word,...v,found:hit,highlighted:hl,typoRows:t.rows.length,cameBack:back.length});
      console.log(`  ${field.padEnd(20)} ${v.kind.padEnd(14)} "${v.typed}" sim=${v.sim} -> ${hit?('FOUND'+(hl?' + highlighted':' , NOT highlighted')):'NOT FOUND'}`);
      fs.writeFileSync(OUT+'full-matrix.json', JSON.stringify(results,null,1));
    }
  }
}
fs.writeFileSync(OUT+'full-matrix.json', JSON.stringify(results,null,1));
console.log('\nMATRIX WRITTEN', results.length, 'checks');
await browser.close();
