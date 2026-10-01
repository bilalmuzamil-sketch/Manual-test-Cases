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
  return await page.evaluate(()=>({rows:[...document.querySelectorAll('.search-row')].slice(0,8).map(r=>({
    text:r.innerText.replace(/\s*\n\s*/g,' ').replace(/\s+/g,' ').trim(),
    marks:[...r.querySelectorAll('mark')].map(m=>m.innerText.trim()),
    approx:/≈|close match/i.test(r.innerText)}))}));
}
const transpose=w=>{const i=Math.floor(w.length/2),a=w.split('');[a[i-1],a[i]]=[a[i],a[i-1]];return a.join('');};
const key=t=>t.slice(0,46).toLowerCase();

const PLAN=[
 ['Work orders','Andover'],['Work orders','Stillwater'],
 ['Customers','Trailer'],['Customers','Greene'],
 ['Assets','Freightliner'],['Assets','Cascadia'],
 ['Parts','Cleaner'],['Parts','Hardware'],
 ['Vendors','Fernvale'],['Vendors','Ranking'],
 ['Part sales','Trailer'],['Part sales','Candace'],
 ['Purchase orders','Stillwater'],['Purchase orders','Overlea'],
 ['Vendor invoices','Winterville'],['Vendor invoices','Island'],
];
const results=[];
for (const [tab,word] of PLAN){
  const bad=transpose(word);
  const a=await search(word,tab);
  const b=await search(bad,tab);
  const base=a.rows.map(r=>key(r.text));
  const found=b.rows.filter(r=>base.includes(key(r.text)));
  let verdict;
  if(!a.rows.length) verdict='NO BASELINE (exact term found nothing - proves nothing about fuzzy)';
  else if(!b.rows.length) verdict='FUZZY SKIPPED (typo returned nothing at all)';
  else if(!found.length) verdict='FUZZY SKIPPED (typo returned rows, but not the record the exact term found)';
  else verdict = found.some(r=>r.marks.length) ? 'FOUND + HIGHLIGHTED' : 'FOUND BUT NOT HIGHLIGHTED';
  const ex=found[0]||b.rows[0];
  results.push({tab,word,typo:bad,exactRows:a.rows.length,typoRows:b.rows.length,
    matchedBack:found.length, approx:ex?ex.approx:null, marks:ex?ex.marks:[], verdict,
    exactSample:a.rows[0]?.text.slice(0,95), typoSample:ex?.text.slice(0,95)});
  console.log(`${tab.padEnd(16)} "${word}"->"${bad}"  exact=${a.rows.length} typo=${b.rows.length} back=${found.length} approx=${ex?ex.approx:'-'} marks=${JSON.stringify(ex?ex.marks:[])}  ${verdict}`);
}
fs.writeFileSync(OUT+'fuzzy-results.json', JSON.stringify(results,null,1));
await browser.close();
