// Before saying "Uncomplete" and "Delete line" are absent: search the work order screen for every
// word the product might use instead, with a finished line on screen and the bar open.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo, bodyText } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WORDS = ['Uncomplete','Un-complete','Reopen','Re-open','Undo complete','Mark incomplete','Incomplete',
               'Delete line','Delete Line','Remove line','Remove Line','Delete','Remove',
               'Request part','Add Part','Authorization required','Authorization Required','Needs authorisation','Decline'];
const { browser, page } = await bootProdLogin('/workorders', { settle: 11000, viewport:{width:1680,height:1000} });
page.setDefaultTimeout(22000);
const out = [];
for (const [tag,id] of [['S2-810 (three finished lines)','fe72110c-7ff6-47f8-8f83-e3ea447a5280'], ['S2-786 (finished)','4560a837-ee20-46e5-a62c-c6a4892fc85d']]) {
  await openWo(page, id); await page.waitForTimeout(6000);
  // expand every line so nothing is hidden inside a collapsed block
  await page.evaluate(()=>{ for (const b of document.querySelectorAll('button,.q-btn')) { const t=(b.innerText||'').trim(); if (t==='expand_less'||t==='expand_more') b.click(); } });
  await page.waitForTimeout(3500);
  const ids = await page.evaluate(()=>[...new Set([...document.querySelectorAll('tr[class*="line-row-"]')].map(tr=>(tr.className.match(/line-row-([0-9a-f-]+)/)||[])[1]))].filter(Boolean));
  // select EVERY line so the bar shows everything it can
  for (const i of ids) { try { const tr=page.locator(`tr.line-row-${i}`).first(); await tr.hover(); await page.waitForTimeout(600);
    await page.locator(`[data-test-id="line_checkbox_${i}"]`).first().click({timeout:6000}); } catch(e){} }
  await page.waitForTimeout(2500);
  const bar = await page.evaluate(()=>{ const el=[...document.querySelectorAll('div')].filter(e=>/\bselected\b/.test(e.innerText||'') && e.querySelector('button,.q-btn') && (e.innerText||'').length<250).sort((a,b)=>a.innerText.length-b.innerText.length)[0];
    return el? (el.innerText||'').replace(/\s+/g,' ').trim() : null; });
  const more = await page.evaluate(()=>{ const b=[...document.querySelectorAll('div')].filter(e=>/\bselected\b/.test(e.innerText||'') && e.querySelector('button,.q-btn') && (e.innerText||'').length<250).sort((a,b)=>a.innerText.length-b.innerText.length)[0];
    if(!b) return null; const m=[...b.querySelectorAll('button,.q-btn')].find(x=>/^More/.test((x.innerText||'').trim())); if(!m) return 'no More'; m.click(); return 'clicked'; });
  await page.waitForTimeout(2200);
  const moreItems = more==='clicked' ? await page.evaluate(()=>{ const m=[...document.querySelectorAll('.q-menu')].filter(x=>x.getBoundingClientRect().width)[0]; return m? [...m.querySelectorAll('.q-item')].map(e=>(e.innerText||'').trim()):null; }) : more;
  const t = await bodyText(page);
  const found = WORDS.filter(w => t.includes(w));
  console.log('\n####', tag);
  console.log('  bar with every line selected:', JSON.stringify(bar));
  console.log('  bar More:', JSON.stringify(moreItems));
  console.log('  words present anywhere:', JSON.stringify(found));
  out.push({ tag, bar, moreItems, found });
  await page.screenshot({ path: `${EV}/synonyms-${tag.slice(0,6).replace(/\W/g,'')}.png`, fullPage: true });
  await page.keyboard.press('Escape'); await page.waitForTimeout(800);
}
fs.writeFileSync(`${EV}/synonym-search.json`, JSON.stringify(out,null,1));
await browser.close();
