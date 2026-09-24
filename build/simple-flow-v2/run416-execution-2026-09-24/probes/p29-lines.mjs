// Line rows are tr.line-row-<id>; their controls sit in .line-actions-menu. Read status + actions per line,
// then open each line's ... menu. Serves C44566, C44567, C44563(3), C44565.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const ID=process.argv[2], TAG=process.argv[3];
const { browser, page } = await bootProdLogin('/workorders', { settle: 9000 });
page.setDefaultTimeout(18000);
await openWo(page, ID);
await page.waitForTimeout(3000);
const read = async () => await page.evaluate(() => {
  const rows = [...document.querySelectorAll('tr[class*="line-row-"]')];
  return rows.map(tr => {
    const badge = [...tr.querySelectorAll('.q-badge')].map(b => (b.innerText||'').trim());
    const btns = [...tr.querySelectorAll('button, .q-btn')].filter(b=>b.getBoundingClientRect().width)
      .map(b => ({ t:(b.innerText||'').trim(), disabled: b.disabled===true||b.getAttribute('aria-disabled')==='true'||/disabled/.test((b.className||'').toString()),
                   title: b.getAttribute('title')||b.getAttribute('aria-label')||'' }));
    return { id: (tr.className.match(/line-row-([0-9a-f-]+)/)||[])[1], badges: badge, buttons: btns, text: (tr.innerText||'').replace(/\s+/g,' ').slice(0,180) };
  });
});
const lines = await read();
console.log('LINES:', lines.length);
for (const l of lines) {
  console.log('\n== badges:', JSON.stringify(l.badges));
  console.log('   buttons:', JSON.stringify(l.buttons.map(b => (b.disabled?'[off]':'')+b.t + (b.title? ' «'+b.title+'»':''))));
}
// open each line's ... menu
const menus = [];
for (let i = 0; i < lines.length; i++) {
  const btn = page.locator(`tr.line-row-${lines[i].id} button:has-text("more_vert"), tr.line-row-${lines[i].id} .q-btn:has-text("more_vert")`).first();
  if (!(await btn.count())) { menus.push({ line: lines[i].badges, items: null, note: 'no ... on this line row' }); continue; }
  try { await btn.click({ timeout: 6000 }); await page.waitForTimeout(1800);
    const items = await page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>({t:(e.innerText||'').trim().replace(/\s+/g,' '), disabled:/disabled/.test((e.className||'').toString())})).filter(x=>x.t));
    menus.push({ line: lines[i].badges, items });
    console.log('   ... menu:', JSON.stringify(items.map(x=>(x.disabled?'[off]':'')+x.t)));
    await page.keyboard.press('Escape'); await page.waitForTimeout(900);
  } catch(e) { menus.push({ line: lines[i].badges, error: e.message.split('\n')[0] }); }
}
fs.writeFileSync(`${EV}/${TAG}-lines.json`, JSON.stringify({ lines, menus }, null, 1));
await page.screenshot({ path: `${EV}/${TAG}-lines.png`, fullPage: true });
await browser.close();
