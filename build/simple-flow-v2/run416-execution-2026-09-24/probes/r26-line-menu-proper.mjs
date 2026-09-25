// Problem 3, third attempt - and this time by the QA lead's own route, which he had to show me.
// Two bugs in r23/r24 produced four false "missing" claims:
//   (1) r23 read `.q-menu .q-item` with NO visibility filter, so it picked up a STALE hidden menu
//       instead of the one it had just opened. Fix: only a .q-menu with a real bounding box.
//   (2) r24 hunted a PENCIL on the row. There is none - the line editor opens by CLICKING THE LINE.
// His route: a Complete line's three-dot holds Uncomplete; clicking the line opens "Edit Line" whose
// Status dropdown moves it to Authorization required / Declined / Authorized, and which carries Delete.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';

// Only a menu that is actually on screen. This is the whole bug from last time.
async function visibleMenu(page) {
  return await page.evaluate(() => {
    const m = [...document.querySelectorAll('.q-menu')].filter(x => { const r = x.getBoundingClientRect(); return r.width > 20 && r.height > 20; });
    if (!m.length) return null;
    const el = m[m.length - 1];
    return [...el.querySelectorAll('.q-item')].filter(i => i.getBoundingClientRect().width).map(i => ({
      t: (i.innerText || '').trim().replace(/\s+/g, ' '),
      disabled: i.classList.contains('disabled') || i.getAttribute('aria-disabled') === 'true' || /q-item--disabled|disabled/.test(i.className),
      title: i.getAttribute('title') || i.getAttribute('aria-label') || ''
    })).filter(i => i.t);
  });
}
async function lines(page) {
  return await page.evaluate(() => { const s=new Set(), o=[];
    for (const tr of document.querySelectorAll('tr[class*="line-row-"]')) {
      const i = (tr.className.match(/line-row-([0-9a-f-]+)/) || [])[1]; if (!i || s.has(i)) continue; s.add(i);
      o.push({ id:i, name:(tr.querySelector('td')?tr.innerText.split('\n').slice(0,3).join(' / '):'').replace(/\s+/g,' ').trim().slice(0,60),
               badges:[...tr.querySelectorAll('.q-badge')].map(b=>(b.innerText||'').trim()) });
    } return o; });
}

const { browser, page } = await bootProdLogin('/workorders', { settle: 11000, viewport:{width:1680,height:1000} });
page.setDefaultTimeout(25000);
const out = [];
const WOS = [['S2-810','fe72110c-7ff6-47f8-8f83-e3ea447a5280'], ['S2-786','4560a837-ee20-46e5-a62c-c6a4892fc85d'], ['S2-908','068f9856-9d28-4500-a3dd-dd6d7aafb15a']];

for (const [tag, id] of WOS) {
  await openWo(page, id); await page.waitForTimeout(7000);
  const ls = await lines(page);
  const rec = { wo: tag, id, lines: ls.map(l=>({id:l.id,badges:l.badges})), menus: [], editors: [] };
  console.log('\n########', tag, '-', ls.length, 'lines:', JSON.stringify(ls.map(l=>l.badges.join('+')||'(no badge)')));

  for (const l of ls) {
    const tr = page.locator(`tr.line-row-${l.id}`).first();
    await tr.scrollIntoViewIfNeeded().catch(()=>{}); await tr.hover().catch(()=>{}); await page.waitForTimeout(900);
    const dots = page.locator(`tr.line-row-${l.id} .q-btn:has-text("more_vert"), tr.line-row-${l.id} button:has-text("more_vert")`);
    if (await dots.count()) {
      await dots.first().click({timeout:9000}).catch(()=>{});
      await page.waitForTimeout(1800);
      const items = await visibleMenu(page);
      rec.menus.push({ status: l.badges.join('+')||'(none)', lineId: l.id, items });
      console.log('  MENU on', (l.badges.join('+')||'(none)'), '->', JSON.stringify((items||[]).map(i=>i.t + (i.disabled?' [disabled]':''))));
      await page.screenshot({ path:`${EV}/p3b-menu-${tag}-${(l.badges.join('_')||'none')}-${l.id.slice(0,6)}.png` }).catch(()=>{});
      await page.keyboard.press('Escape'); await page.waitForTimeout(900);
    }
  }
  // the line editor - opened by CLICKING THE LINE, not by any pencil
  if (ls.length) {
    for (const l of ls.slice(0,2)) {
      const cell = page.locator(`tr.line-row-${l.id} td`).nth(1);
      await cell.click({timeout:9000}).catch(()=>{});
      await page.waitForTimeout(5000);
      const ed = await page.evaluate(()=>{ const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
        if(!d) return null;
        return { heading:(d.innerText||'').split('\n')[0],
          buttons:[...d.querySelectorAll('button,.q-btn')].filter(b=>b.getBoundingClientRect().width).map(b=>(b.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean),
          fields:[...d.querySelectorAll('.q-field')].map(f=>(f.innerText||'').replace(/\s+/g,' ').trim().slice(0,70)),
          text:(d.innerText||'').replace(/\s+/g,' ').slice(0,400) }; });
      rec.editors.push({ status: l.badges.join('+')||'(none)', lineId: l.id, editor: ed });
      console.log('  EDITOR on', (l.badges.join('+')||'(none)'), '->', ed ? JSON.stringify({h:ed.heading,b:ed.buttons,f:ed.fields}) : 'no dialog opened');
      if (ed) {
        await page.screenshot({ path:`${EV}/p3b-editor-${tag}-${(l.badges.join('_')||'none')}.png` }).catch(()=>{});
        // open the Status dropdown and read its options
        const sel = page.locator('.q-dialog .q-field:has-text("Status")').first();
        if (await sel.count()) { await sel.click({timeout:8000}).catch(()=>{}); await page.waitForTimeout(2200);
          const opts = await visibleMenu(page);
          rec.editors[rec.editors.length-1].statusOptions = opts;
          console.log('    Status dropdown ->', JSON.stringify((opts||[]).map(o=>o.t)));
          await page.screenshot({ path:`${EV}/p3b-status-${tag}-${(l.badges.join('_')||'none')}.png` }).catch(()=>{});
          await page.keyboard.press('Escape'); await page.waitForTimeout(800); }
        await page.keyboard.press('Escape'); await page.waitForTimeout(1600);
      }
    }
  }
  out.push(rec);
}
fs.writeFileSync(`${EV}/p3b-line-menus.json`, JSON.stringify(out,null,1));
console.log('\nwritten');
await browser.close();
