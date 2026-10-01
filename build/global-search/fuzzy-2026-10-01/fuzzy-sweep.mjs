/**
 * FUZZY MATCHING SWEEP - every tab, every kind of data those tabs carry.
 *
 * Two questions, kept apart because they have different answers:
 *   Q1  Does a typo find the record AT ALL?          (is fuzzy matching skipped?)
 *   Q2  When it does, is the matched text HIGHLIGHTED? (PRD section 7)
 *
 * PRD v1.5 section 7, quoted: "When a match is fuzzy rather than exact, the matched token in the
 * row is still highlighted, and a subtle `=~` or italicized treatment indicates the soft match."
 * Both halves are required. The build currently does the second and not the first - this sweep
 * establishes how wide that is, and whether any entity drops fuzzy results entirely.
 *
 * NOT A FAULT, per PRD section 7 "What is not fuzzy": VIN, WO number, P-number, part number,
 * PO number and invoice number bypass fuzzy logic and require an exact match after normalization.
 * Typos on those SHOULD return nothing. They are run anyway, in their own group, so that
 * "returns nothing" is reported as correct behaviour rather than counted as a fault.
 *
 * EVERY TYPO IS PAIRED WITH ITS EXACT TERM IN THE SAME RUN (Rule 104). If the exact term does not
 * return the record, the typo result proves nothing about fuzzy matching and is reported as
 * NO BASELINE - never as a fault.
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
  if (tab) {
    const clicked = await page.evaluate(l=>{
      const t=[...document.querySelectorAll('.search-tabs__tab')]
        .find(e=>e.innerText.replace(/\s*\(\d+\)/,'').trim().toLowerCase()===l.toLowerCase());
      if(!t) return false; t.click(); return true;}, tab);
    if(!clicked) return {tabMissing:true, rows:[]};
    await page.waitForTimeout(2200);
  }
  await page.mouse.move(0,0); await page.waitForTimeout(250);
  return await page.evaluate(()=>({
    rows: [...document.querySelectorAll('.search-row')].slice(0,8).map(r=>({
      text: r.innerText.replace(/\s*\n\s*/g,' ').replace(/\s+/g,' ').trim(),
      marks: [...r.querySelectorAll('mark')].map(m=>m.innerText.trim()),
      approx: /≈|close match/i.test(r.innerText),
    })),
  }));
}

// one-character damage that stays inside the spec's similarity thresholds
const typo = w => w.length<5 ? w : (() => {       // transpose two middle letters
  const i=Math.floor(w.length/2); const a=w.split('');
  [a[i-1],a[i]]=[a[i],a[i-1]]; return a.join('');
})();
const typoSub = w => { const i=Math.floor(w.length/2); const a=w.split('');
  a[i] = a[i].toLowerCase()==='o' ? 'e' : (a[i].toLowerCase()==='e' ? 'a' : 'x'); return a.join(''); };

// Harvest REAL values off each tab, so nothing depends on seeded records that may have been removed.
const TABS = ['Work orders','Customers','Assets','Parts','Vendors','Part sales','Purchase orders','Vendor invoices'];
const SEED = {'Work orders':'repair','Customers':'truck','Assets':'freightliner','Parts':'brake',
              'Vendors':'supply','Part sales':'truck','Purchase orders':'diesel','Vendor invoices':'repair'};
const harvest = {};
for (const tab of TABS){
  const r = await search(SEED[tab], tab);
  if (r.tabMissing){ harvest[tab]={error:'tab not present'}; console.log(tab,'TAB NOT PRESENT'); continue; }
  // words worth typo-ing: alphabetic, >=5 chars, not a pure identifier
  const words=[];
  for (const row of r.rows){
    for (const w of row.text.split(/[^A-Za-z]+/)){
      if (w.length>=6 && !/^(open|close|match|Available|Fulfilled|Ordered|Received|Paid|Unpaid|Estimate|Invoiced)$/i.test(w))
        words.push(w);
    }
  }
  harvest[tab]={seedRows:r.rows.length, words:[...new Set(words)].slice(0,4)};
  console.log(`${tab}: ${r.rows.length} rows from "${SEED[tab]}", candidates: ${harvest[tab].words.join(', ')}`);
}
fs.writeFileSync(OUT+'harvest.json', JSON.stringify(harvest,null,1));
await browser.close();
