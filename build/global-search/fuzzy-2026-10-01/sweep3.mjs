/**
 * CORRECTED SWEEP. The first pass reported "FUZZY SKIPPED" almost everywhere. That verdict was
 * MINE, not the product's. Three faults in my own method, all found before reporting:
 *
 *  1. I compared the typo's rows against the exact term's rows using the row's full text. But a
 *     fuzzy row has "= close match:" PREPENDED to that text, so the same record keyed differently
 *     and scored as "not found". This alone faked almost every SKIPPED verdict.
 *  2. My typo generator transposed two middle letters - on "Greene" that swaps 'e' with 'e' and
 *     returns the word unchanged, so the run was an exact search wearing a typo's name.
 *  3. I keyed on the whole row, which carries counts and badges that move between reads.
 *
 * Now: key on the record's PRIMARY LINE only, strip the close-match prefix, and assert the typo
 * really differs from the word. Rule 104 - prove the instrument before believing a negative.
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
    if(!ok) return {tabMissing:true,rows:[]}; await page.waitForTimeout(2200); }
  await page.mouse.move(0,0); await page.waitForTimeout(250);
  return await page.evaluate(()=>({rows:[...document.querySelectorAll('.search-row')].slice(0,10).map(r=>({
    title:(r.querySelector('.search-row__title')?.innerText||'').replace(/\s+/g,' ').trim(),
    text:r.innerText.replace(/\s*\n\s*/g,' ').replace(/\s+/g,' ').trim(),
    marks:[...r.querySelectorAll('mark')].map(m=>m.innerText.trim()),
    approx:/≈|close match/i.test(r.innerText)}))}));
}
// strip the close-match decoration so the SAME record keys the same way in both reads
const idOf = r => (r.title || r.text).replace(/^\s*≈?\s*close match:\s*/i,'').replace(/\s+/g,' ').trim().toLowerCase();
// guarantee a real typo: transpose the first ADJACENT PAIR OF DIFFERENT letters
function makeTypo(w){
  for(let i=1;i<w.length;i++) if(w[i].toLowerCase()!==w[i-1].toLowerCase()){
    const a=w.split(''); [a[i-1],a[i]]=[a[i],a[i-1]]; const t=a.join('');
    if(t.toLowerCase()!==w.toLowerCase()) return t;
  }
  return null;
}
const PLAN=[
 ['Work orders','Andover'],['Work orders','Crankshaft'],
 ['Customers','Trailer'],['Customers','Halfmoon'],
 ['Assets','Freightliner'],['Assets','Cascadia'],
 ['Parts','Cleaner'],['Parts','Hardware'],
 ['Vendors','Fernvale'],['Vendors','Rowcheck'],
 ['Part sales','Trailer'],['Part sales','Candace'],
 ['Purchase orders','Stillwater'],['Purchase orders','Overlea'],
 ['Vendor invoices','Winterville'],['Vendor invoices','Trailer'],
];
const results=[];
for (const [tab,word] of PLAN){
  const bad=makeTypo(word);
  if(!bad){ console.log(`${tab} "${word}" SKIPPED - cannot build a typo`); continue; }
  const a=await search(word,tab);
  const b=await search(bad,tab);
  const base=new Set(a.rows.map(idOf));
  const back=b.rows.filter(r=>base.has(idOf(r)));
  let verdict;
  if(!a.rows.length) verdict='NO BASELINE';
  else if(!b.rows.length) verdict='FUZZY SKIPPED - typo returns nothing';
  else if(!back.length) verdict='FUZZY SKIPPED - typo returns other records, not this one';
  else verdict = back.some(r=>r.marks.length) ? 'FOUND + HIGHLIGHTED' : 'FOUND, NOT HIGHLIGHTED';
  const ex=back[0];
  results.push({tab,word,typo:bad,exactRows:a.rows.length,typoRows:b.rows.length,cameBack:back.length,
    approx:ex?ex.approx:null, marks:ex?ex.marks:[], verdict, sample:ex?ex.text.slice(0,100):null});
  console.log(`${tab.padEnd(16)} "${word}"->"${bad}" exact=${a.rows.length} typo=${b.rows.length} back=${back.length} approx=${ex?ex.approx:'-'} marks=${JSON.stringify(ex?ex.marks:[])} ${verdict}`);
}
fs.writeFileSync(OUT+'fuzzy-results-corrected.json', JSON.stringify(results,null,1));
console.log('WRITTEN');
await browser.close();
