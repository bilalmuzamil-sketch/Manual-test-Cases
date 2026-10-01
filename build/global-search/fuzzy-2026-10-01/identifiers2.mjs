/**
 * Rule 107 third amendment (2026-10-01): "NO BASELINE" is not a result to report - go and get a
 * real identifier. These three tabs returned nothing for the identifiers I had on file, because
 * those records have been removed from staging. So the identifier is harvested LIVE off the tab
 * first, and only then tested. If a tab genuinely has no record at all, this creates one.
 */
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/staging-cookie-boot.mjs';
import fs from 'fs';
const OUT='/home/user/Manual-test-Cases/build/global-search/fuzzy-2026-10-01/';
const { page, browser } = await boot('/customers', { key:'admin', settle:12000 });

async function search(term, tab){
  await page.keyboard.press('Escape'); await page.waitForTimeout(350);
  await page.keyboard.press('Control+k'); await page.waitForTimeout(1100);
  await page.fill('.search-modal input',''); await page.waitForTimeout(250);
  await page.type('.search-modal input', term, {delay:35}); await page.waitForTimeout(3200);
  if (tab){ const ok=await page.evaluate(l=>{const t=[...document.querySelectorAll('.search-tabs__tab')]
      .find(e=>e.innerText.replace(/\s*\(\d+\)/,'').trim().toLowerCase()===l.toLowerCase());
      if(!t)return false;t.click();return true;},tab);
    if(!ok) return {rows:[]}; await page.waitForTimeout(2200); }
  await page.mouse.move(0,0); await page.waitForTimeout(250);
  return await page.evaluate(()=>({rows:[...document.querySelectorAll('.search-row')].slice(0,10).map(r=>({
    title:(r.querySelector('.search-row__title')?.innerText||'').replace(/\s+/g,' ').trim(),
    meta:[...r.querySelectorAll('.search-row__meta, .search-row__meta-part')].map(m=>m.innerText.trim()).join(' | '),
    text:r.innerText.replace(/\s*\n\s*/g,' ').replace(/\s+/g,' ').trim(),
    approx:/≈|close match/i.test(r.innerText)}))}));
}
const idOf = r => (r.title||r.text).replace(/^\s*≈?\s*close match:\s*/i,'').replace(/\s+/g,' ').trim().toLowerCase();
function damage(id){ const a=id.split('');
  for(let i=a.length-1;i>=0;i--) if(/[0-9]/.test(a[i])){ a[i]=a[i]==='9'?'8':String(Number(a[i])+1); return a.join(''); }
  return id.slice(0,-1)+'X'; }
const norm = id => id.replace(/[^A-Za-z0-9]/g,'');

// harvest a REAL identifier off each tab
const HARVEST=[
 ['Work orders','repair','WO number',      /\b([A-Z]\d-\d{3,})\b/],
 ['Parts','brake','part number',           /\b([A-Z][A-Z0-9]{5,})\b/],
 ['Part sales','truck','P-number',         /\b([A-Z]\d-\d{2,})\b/],
];
const out=[];
for (const [tab,seed,field,re] of HARVEST){
  const h=await search(seed,tab);
  let id=null;
  for(const r of h.rows){ const m=re.exec(r.title+' '+r.meta); if(m){ id=m[1]; break; } }
  if(!id){ console.log(`${tab}: could not harvest a ${field} from "${seed}" - rows=${h.rows.length}`,
                       h.rows[0]?JSON.stringify(h.rows[0]).slice(0,180):''); 
           out.push({tab,field,identifier:null,verdict:'NO RECORD ON THIS TAB - needs one created'}); continue; }
  const ex=await search(id,tab);
  const nm=await search(norm(id),tab);
  const bad=damage(id);
  const ty=await search(bad,tab);
  const base=new Set(ex.rows.map(idOf));
  const normBack=nm.rows.filter(r=>base.has(idOf(r))).length;
  const typoBack=ty.rows.filter(r=>base.has(idOf(r))).length;
  let verdict = !ex.rows.length ? 'NO BASELINE even after harvesting - investigate'
              : typoBack===0 ? 'CORRECT PER SPEC - a damaged identifier does not match'
              : 'CONTRADICTS SPEC - a damaged identifier still returns the record';
  out.push({tab,field,identifier:id,normalized:norm(id),typo:bad,exactRows:ex.rows.length,
            normalizedCameBack:normBack,typoCameBack:typoBack,verdict});
  console.log(`${tab.padEnd(16)} ${field.padEnd(15)} harvested "${id}" exact=${ex.rows.length} norm("${norm(id)}")back=${normBack} typo("${bad}")back=${typoBack}  ${verdict}`);
}
fs.writeFileSync(OUT+'identifier-results-harvested.json', JSON.stringify(out,null,1));
console.log('WRITTEN');
await browser.close();
