// Add more parts so every state exists at once, and try a Return to produce the Returned state.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from '../probes/lib3.mjs';
import { addPart } from './lib-seed.mjs';
import { openPartsTab, readParts, confirmDialog } from './lib-parts.mjs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/seed';
const WO='068f9856-9d28-4500-a3dd-dd6d7aafb15a';
const { browser, page } = await bootProdLogin('/workorders', { settle: 10000 });
page.setDefaultTimeout(25000);
await openWo(page, WO); await page.waitForTimeout(4500);
const badges = await page.evaluate(()=>{ const out={}; for (const tr of document.querySelectorAll('tr[class*="line-row-"]')) { const id=(tr.className.match(/line-row-([0-9a-f-]+)/)||[])[1];
  const b=[...tr.querySelectorAll('.q-badge')].map(x=>(x.innerText||'').trim()); if (b.length) out[id]=b; } return out; });
console.log('lines:', JSON.stringify(badges));
const approved = Object.entries(badges).filter(([,b])=>b.includes('Approved')).map(([id])=>id);
for (const n of ['1238214','1238010']) {
  try { console.log('add', n, '->', await addPart(page, approved[0], { number: n, qty: 1 })); await page.waitForTimeout(3000); }
  catch(e){ console.log('add', n, 'failed:', e.message.slice(0,160)); }
  await openWo(page, WO); await page.waitForTimeout(4000);
}
await openPartsTab(page, WO);
console.log('\nPARTS NOW:'); for (const p of await readParts(page)) console.log(' ', JSON.stringify(p.badges), JSON.stringify(p.actions));

// Return: it lives in the part's ... menu on the lines tab
await openWo(page, WO); await page.waitForTimeout(4000);
const mv = page.locator('button:has-text("more_vert"), .q-btn:has-text("more_vert")');
const n = await mv.count(); let returned = null;
for (let i=0;i<Math.min(n,10);i++) {
  await mv.nth(i).click({timeout:6000}).catch(()=>{}); await page.waitForTimeout(1800);
  const has = await page.evaluate(()=>{ const it=[...document.querySelectorAll('.q-menu .q-item')].find(e=>(e.innerText||'').trim()==='Return');
    if (!it) return null; it.click(); return 'clicked Return'; });
  if (has) { returned = `menu#${i}: ${has}`; break; }
  await page.keyboard.press('Escape'); await page.waitForTimeout(700);
}
console.log('\n' + (returned || 'no Return offered on any part menu'));
if (returned) { await page.waitForTimeout(4000);
  const c = await confirmDialog(page);
  console.log('return dialog:', JSON.stringify(c.dialog), '| pressed:', c.pressed);
  await page.screenshot({ path: `${EV}/return-dialog.png` });
  await page.waitForTimeout(6000); }
await openPartsTab(page, WO);
console.log('\nPARTS AFTER RETURN:'); for (const p of await readParts(page)) console.log(' ', JSON.stringify(p.badges), JSON.stringify(p.actions));
await page.screenshot({ path: `${EV}/parts-final.png`, fullPage: true });
await browser.close();
