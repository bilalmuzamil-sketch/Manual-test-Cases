/**
 * THE OTHER HALF OF THE TICKET: fields the spec says must NOT fuzzy match.
 *
 * PRD v1.5 section 7, "What is not fuzzy", quoted verbatim:
 *   "Exact identifier fields - VIN, WO number, P-number, part number, PO number, invoice number -
 *    bypass fuzzy logic and require exact match after normalization. A typo in a VIN is almost
 *    always a wrong VIN, not a typo, and fuzzy matching here would surface confusing results."
 *
 * So on these, a typo returning NOTHING is CORRECT and must be reported as correct.
 *
 * Each identifier gets THREE reads, because "returns nothing" has two innocent explanations that
 * have to be ruled out before it counts as correct-by-design:
 *   1. EXACT          - the record must come back, or the other two reads prove nothing.
 *   2. NORMALIZED     - punctuation stripped ("S3-6881" -> "s36881"). The spec requires this to
 *                       STILL match. It separates "identifiers are matched strictly" from
 *                       "this identifier is simply not searchable".
 *   3. TYPO           - one character damaged. Expected: the record does NOT come back.
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
    text:r.innerText.replace(/\s*\n\s*/g,' ').replace(/\s+/g,' ').trim(),
    approx:/≈|close match/i.test(r.innerText)}))}));
}
const idOf = r => (r.title||r.text).replace(/^\s*≈?\s*close match:\s*/i,'').replace(/\s+/g,' ').trim().toLowerCase();
// damage exactly one character of the identifier, in its numeric tail
function damage(id){
  const a=id.split('');
  for(let i=a.length-1;i>=0;i--) if(/[0-9]/.test(a[i])){ a[i]=a[i]==='9'?'8':String(Number(a[i])+1); return a.join(''); }
  return id.slice(0,-1)+'X';
}
const norm = id => id.replace(/[^A-Za-z0-9]/g,'');

// Real identifiers harvested from this environment, each with the field the spec names.
const PLAN=[
 ['Work orders',     'WO number',      'S2-34378'],
 ['Purchase orders', 'PO number',      'S3-6881'],
 ['Vendor invoices', 'invoice number', 'I3-721'],
 ['Assets',          'VIN',            'SVEWU82M5ETEJFWFA'],
 ['Parts',           'part number',    'KIT8000HD'],
 ['Part sales',      'P-number',       'P2-58'],
];
const out=[];
for (const [tab,field,id] of PLAN){
  const ex=await search(id,tab);
  const nm=await search(norm(id),tab);
  const bad=damage(id);
  const ty=await search(bad,tab);
  const base=new Set(ex.rows.map(idOf));
  const normBack=nm.rows.filter(r=>base.has(idOf(r))).length;
  const typoBack=ty.rows.filter(r=>base.has(idOf(r))).length;
  let verdict;
  if(!ex.rows.length) verdict='NO BASELINE - the exact identifier found nothing, so nothing is proved';
  else if(typoBack===0) verdict='CORRECT PER SPEC - a damaged identifier does not match';
  else verdict='CONTRADICTS SPEC - a damaged identifier still returns the record';
  out.push({tab,field,identifier:id,normalized:norm(id),typo:bad,
    exactRows:ex.rows.length, normalizedCameBack:normBack, typoCameBack:typoBack, verdict,
    sample:ex.rows[0]?.text.slice(0,80)});
  console.log(`${tab.padEnd(16)} ${field.padEnd(15)} "${id}" exact=${ex.rows.length} norm("${norm(id)}")back=${normBack} typo("${bad}")back=${typoBack}  ${verdict}`);
}
fs.writeFileSync(OUT+'identifier-results.json', JSON.stringify(out,null,1));
console.log('WRITTEN');
await browser.close();
