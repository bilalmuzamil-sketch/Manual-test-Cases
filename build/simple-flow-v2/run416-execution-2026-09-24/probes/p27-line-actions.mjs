// C44566 / C44567 / C44568: for every line on a work order, read its status and the actions offered
// on the line itself and in its ... menu; then the same for every part row.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const ID=process.argv[2], TAG=process.argv[3];
const { browser, page } = await bootProdLogin('/workorders', { settle: 9000 });
page.setDefaultTimeout(18000);
await openWo(page, ID);
await page.waitForTimeout(3000);

// map the line blocks: each carries a status chip and its own row of controls
const lines = await page.evaluate(() => {
  const STATUSES = ['Needs Approval','Approved','Declined','Complete','Authorization Required','In Progress'];
  const blocks = [];
  // a line block is the smallest element that holds a status chip and an action button
  for (const el of document.querySelectorAll('div, section, tr')) {
    const t = (el.innerText || '').trim();
    if (!t) continue;
    const st = STATUSES.find(s => t.startsWith(s) || t.split('\n')[0] === s);
    if (!st) continue;
    if (el.querySelectorAll('button, .q-btn').length === 0) continue;
    // keep only the innermost such element
    if ([...el.querySelectorAll('div,section,tr')].some(c => { const ct=(c.innerText||'').trim(); return STATUSES.some(s=>ct.startsWith(s)) && c.querySelectorAll('button,.q-btn').length; })) continue;
    blocks.push({ status: st,
      buttons: [...el.querySelectorAll('button, .q-btn')].filter(b=>b.getBoundingClientRect().width).map(b => ({ t:(b.innerText||'').trim(), disabled: b.disabled===true||b.getAttribute('aria-disabled')==='true'||/disabled/.test(b.className||''), title: b.getAttribute('title')||b.getAttribute('aria-label')||'' })),
      text: t.slice(0, 300) });
  }
  return blocks;
});
console.log('LINE BLOCKS FOUND:', lines.length);
for (const l of lines) { console.log('\n== status:', l.status);
  console.log('   buttons:', JSON.stringify(l.buttons.map(b=>(b.disabled?'[off]':'')+b.t+(b.title?' («'+b.title+'»)':'')))); }
fs.writeFileSync(`${EV}/${TAG}-line-actions.json`, JSON.stringify(lines,null,1));
await page.screenshot({ path: `${EV}/${TAG}-line-actions.png`, fullPage: true });
await browser.close();
