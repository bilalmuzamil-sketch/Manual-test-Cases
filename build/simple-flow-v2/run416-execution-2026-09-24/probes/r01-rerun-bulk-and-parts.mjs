// RE-RUN with the seeded states in place. One session, everything the bulk bar and part-state checks need.
// Serves C44568, C44571(4,5), C44572, C44573, C44575, C44576, C44577, C44579, C44580, C44581, C44569.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import { openPartsTab, readParts } from '../seed/lib-parts.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='068f9856-9d28-4500-a3dd-dd6d7aafb15a';
const { browser, page, ctx, APIH } = await bootProdLogin('/workorders', { settle: 10000, viewport:{width:1680,height:1000} });
page.setDefaultTimeout(25000);
const out = {};
const st = (await (await ctx.request.get(`https://${APIH}/api/organizations/settings`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true})).json()).data;
out.settings = { ordering: st.requireOrderingParts, requirePicking: !st.autoPickInventoryParts, receiving: st.requireVendorInvoiceNumber, requireApproval: !st.autoApproveLines };
console.log('settings:', JSON.stringify(out.settings));

// --- part states and the actions each offers (C44568)
await openPartsTab(page, WO);
out.parts = await readParts(page);
console.log('\nPART STATES AND THEIR ACTIONS:');
for (const p of out.parts) console.log('  ', JSON.stringify(p.badges), '->', JSON.stringify(p.actions));
await page.screenshot({ path: `${EV}/rerun-part-states.png`, fullPage: true });

// --- the bulk bar with lines selected (C44571 onwards)
await openWo(page, WO); await page.waitForTimeout(5000);
const lines = await page.evaluate(()=>{ const out=[]; for (const tr of document.querySelectorAll('tr[class*="line-row-"]')) {
  const id=(tr.className.match(/line-row-([0-9a-f-]+)/)||[])[1];
  const b=[...tr.querySelectorAll('.q-badge')].map(x=>(x.innerText||'').trim());
  if (b.length && !out.some(o=>o.id===id)) out.push({id, badges:b}); } return out; });
out.lines = lines;
console.log('\nLINES:', JSON.stringify(lines));
async function tick(id){ const tr=page.locator(`tr.line-row-${id}`).first(); await tr.scrollIntoViewIfNeeded().catch(()=>{}); await tr.hover(); await page.waitForTimeout(900);
  await page.locator(`[data-test-id="line_checkbox_${id}"]`).first().click({timeout:9000}); }
const readBar = async () => await page.evaluate(() => {
  const el = [...document.querySelectorAll('div')].filter(e => /\bselected\b/.test(e.innerText||'') && e.querySelector('button,.q-btn') && (e.innerText||'').length < 200)
    .sort((a,b)=>a.innerText.length-b.innerText.length)[0];
  return el ? { text:(el.innerText||'').replace(/\s+/g,' ').trim(),
    buttons:[...el.querySelectorAll('button,.q-btn')].filter(b=>b.getBoundingClientRect().width).map(b=>({t:(b.innerText||'').replace(/\s+/g,' ').trim(), disabled:b.disabled===true||/disabled/.test((b.className||'').toString())})).filter(b=>b.t),
    separators: el.querySelectorAll('.q-separator,hr').length } : null; });
const bars = [];
for (let i = 0; i < lines.length; i++) {
  try { await tick(lines[i].id); await page.waitForTimeout(2500); } catch(e) { console.log('tick failed', e.message.split('\n')[0]); }
  const b = await readBar(); bars.push({ selected: i+1, bar: b });
  console.log(`\nBAR with ${i+1} selected:`, JSON.stringify(b));
  await page.screenshot({ path: `${EV}/rerun-bar-${i+1}.png` });
}
out.bars = bars;
// the More menu, scoped to the bar itself
const moreItems = await page.evaluate(() => {
  const bar = [...document.querySelectorAll('div')].filter(e => /\bselected\b/.test(e.innerText||'') && e.querySelector('button,.q-btn') && (e.innerText||'').length < 200)
    .sort((a,b)=>a.innerText.length-b.innerText.length)[0];
  if (!bar) return 'no bar';
  const b = [...bar.querySelectorAll('button,.q-btn')].find(x=>/^More/.test((x.innerText||'').trim()));
  if (!b) return 'no More in the bar'; b.click(); return 'clicked';
});
await page.waitForTimeout(2500);
if (moreItems === 'clicked') {
  out.more = await page.evaluate(()=>{ const m=[...document.querySelectorAll('.q-menu')].filter(x=>x.getBoundingClientRect().width)[0];
    return m? {text:(m.innerText||'').replace(/\s+/g,' ').slice(0,300), items:[...m.querySelectorAll('.q-item')].map(e=>(e.innerText||'').trim())} : null; });
  console.log('\nMORE holds:', JSON.stringify(out.more));
  await page.screenshot({ path: `${EV}/rerun-more.png` });
} else { out.more = moreItems; console.log('\nMore:', moreItems); }
fs.writeFileSync(`${EV}/rerun-bulk-parts.json`, JSON.stringify(out,null,1));
await browser.close();
