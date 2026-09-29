/**
 * Q3 — "a result row shows only the characters typed, not the full value that matched".
 *
 * Verifying it directly rather than taking the handoff's word (Rule 111 / Rule 86), and widening
 * it: the claim was made about contact telephones on the Customers tab. If it is really about how
 * the matched fragment is chosen, it should show up on EVERY labelled note, on every tab, whenever
 * the typed text happens to sit literally inside the stored value. That is what this measures.
 *
 * Each row's second line carries a labelled note ("Contact match: ...", "VIN: ...", "Technician:
 * ..."). The question for each is simply: does the note show the WHOLE stored value, or only the
 * characters that were typed?
 */
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/staging-cookie-boot.mjs';
import fs from 'node:fs';

const CASES = [
  // [query, tab, what the query is a fragment of]
  ['965',            'Customers',   "part of a contact's telephone (digits appear literally)"],
  ['3286',           'Customers',   "part of a contact's telephone (punctuation breaks the literal run)"],
  ['SVEWU82',        'Work orders', 'the first characters of a VIN'],
  ['SVEWU82M5ETEJFWFA','Work orders','a whole VIN'],
  ['Smit',           'Work orders', "part of a lead technician's surname"],
  ['Brandi Smith',   'Work orders', "a whole technician name"],
  ['Garris',         'Work orders', "part of a service advisor's surname"],
  ['zzautotest.nophone','Customers', "part of a contact's email address"],
  ['Priscillab',     'Customers',   'part of a city name'],
  ['H8A3X',          'Customers',   'part of a postal code'],
  ['786',            'Work orders', 'part of a part number on the job'],
  ['KVQ-28',         'Assets',      'part of a licence plate'],
];

const out = { build: null, when: new Date().toISOString().slice(0,10), rows: [] };
const { page, browser } = await boot('/customers', { key:'admin', settle:12000 });
try {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const [q, tab, meaning] of CASES) {
    await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(500);
    await page.keyboard.press('Control+k'); await page.waitForTimeout(1400);
    const i = page.locator('.search-modal input');
    await i.click({clickCount:3}); await i.fill(''); await i.type(q,{delay:45});
    await page.waitForTimeout(5200);
    const opened = await page.evaluate((tb)=>{const t=[...document.querySelectorAll('.search-tabs__tab')]
      .find(e=>new RegExp('^\\s*'+tb.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i').test(e.innerText.trim()));
      if(t){t.click();return true;} return false;}, tab);
    await page.waitForTimeout(2300);
    const rows = await page.evaluate(()=>[...document.querySelectorAll('.search-row')].slice(0,6).map(r=>{
      const m=r.querySelector('.search-row__meta');
      const parts=[...r.querySelectorAll('.search-row__meta-part')].map(p=>p.innerText.replace(/\s+/g,' ').trim());
      // the labelled note is the meta part that carries a "Label: value" shape
      const note=parts.find(p=>/^[A-Za-z][A-Za-z /]{2,30}:\s/.test(p)) || null;
      return { title:(r.querySelector('.search-row__title')?.innerText||'').replace(/\s+/g,' ').trim().slice(0,60),
               note, meta:(m?.innerText||'').replace(/\s+/g,' ').trim().slice(0,110) };
    }));
    // a note "shows only what was typed" when the value after the label IS the query, nothing more
    const verdict = rows.map(r=>{
      if(!r.note) return 'no labelled note';
      const val=r.note.replace(/^[^:]+:\s*/,'').trim();
      return val.toLowerCase()===q.toLowerCase() ? 'ONLY WHAT WAS TYPED' : 'full value';
    });
    out.rows.push({ query:q, tab, meaning, opened, rows, verdict });
    console.log(`\n== "${q}" (${tab}) — ${meaning}`);
    rows.forEach((r,n)=>console.log(`   [${n}] ${verdict[n].padEnd(20)} note=${JSON.stringify(r.note)}`));
  }
  fs.writeFileSync('q3-scenarios.json', JSON.stringify(out,null,1));
} finally { await browser.close(); }
