// Still one bug left. r26 clicked only the FIRST more_vert in a line row and got
// ["Add Labor Fee / Discount"] every time - but the QA lead's screenshot shows a nine-item menu on a
// Complete line (Uncomplete / Add line note / Save as canned line / Story history / Audit log /
// Edit labor / Move labor / Authorization required / Decline). So a line row carries MORE THAN ONE
// three-dot. Enumerate every one of them, with its position, click each, read the VISIBLE menu.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
async function visibleMenu(page) {
  return await page.evaluate(() => {
    const m=[...document.querySelectorAll('.q-menu')].filter(x=>{const r=x.getBoundingClientRect(); return r.width>20&&r.height>20;});
    if(!m.length) return null; const el=m[m.length-1];
    return { box: (()=>{const r=el.getBoundingClientRect(); return {x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)};})(),
      items:[...el.querySelectorAll('.q-item')].filter(i=>i.getBoundingClientRect().width).map(i=>({
        t:(i.innerText||'').trim().replace(/\s+/g,' '),
        disabled: i.classList.contains('disabled')||i.getAttribute('aria-disabled')==='true'||/q-item--disabled/.test(i.className),
        title:i.getAttribute('title')||i.getAttribute('aria-label')||'' })).filter(i=>i.t) };
  });
}
const { browser, page } = await bootProdLogin('/workorders', { settle: 11000, viewport:{width:1680,height:1000} });
page.setDefaultTimeout(25000);
const out=[];
for (const [tag,id] of [['S2-810','fe72110c-7ff6-47f8-8f83-e3ea447a5280'],['S2-908','068f9856-9d28-4500-a3dd-dd6d7aafb15a']]) {
  await openWo(page,id); await page.waitForTimeout(7000);
  const ls = await page.evaluate(()=>{const s=new Set(),o=[];
    for(const tr of document.querySelectorAll('tr[class*="line-row-"]')){const i=(tr.className.match(/line-row-([0-9a-f-]+)/)||[])[1];
      if(!i||s.has(i))continue;s.add(i); o.push({id:i,badges:[...tr.querySelectorAll('.q-badge')].map(b=>(b.innerText||'').trim())});} return o;});
  console.log('\n########',tag,JSON.stringify(ls.map(l=>l.badges.join('+'))));
  const rec={wo:tag,menus:[]};
  for (const l of ls.slice(0,2)) {
    const tr = page.locator(`tr.line-row-${l.id}`).first();
    await tr.scrollIntoViewIfNeeded().catch(()=>{}); await tr.hover().catch(()=>{}); await page.waitForTimeout(1200);
    // EVERY more_vert visible anywhere on the page while this row is hovered, with its position
    const dots = await page.evaluate((lid)=>{ const o=[];
      document.querySelectorAll('button,.q-btn,i,.q-icon').forEach((b,ix)=>{ const t=(b.innerText||b.textContent||'').trim();
        if(!/more_vert/.test(t)) return; const r=b.getBoundingClientRect(); if(!r.width||!r.height) return;
        const inRow = !!b.closest(`tr.line-row-${lid}`);
        o.push({ix, inRow, tag:b.tagName, cls:(b.className||'').toString().slice(0,60), x:Math.round(r.x), y:Math.round(r.y)}); });
      const seen=new Set(); return o.filter(d=>{const k=d.x+','+d.y; if(seen.has(k))return false; seen.add(k); return true;}); }, l.id);
    console.log('  line', l.badges.join('+'), '- three-dots visible:', JSON.stringify(dots.map(d=>({inRow:d.inRow,x:d.x,y:d.y}))));
    for (const d of dots) {
      await tr.hover().catch(()=>{}); await page.waitForTimeout(600);
      await page.mouse.click(d.x+8, d.y+8).catch(()=>{});
      await page.waitForTimeout(1900);
      const m = await visibleMenu(page);
      if (m && m.items.length) {
        rec.menus.push({ status:l.badges.join('+'), lineId:l.id, at:{x:d.x,y:d.y}, inRow:d.inRow, items:m.items });
        console.log('    @',d.x+','+d.y, d.inRow?'(in the line row)':'(elsewhere)', '->', JSON.stringify(m.items.map(i=>i.t+(i.disabled?' [disabled]':''))));
        if (m.items.length > 2) await page.screenshot({ path:`${EV}/p3c-menu-${tag}-${l.badges.join('_')||'none'}-${d.x}.png` }).catch(()=>{});
      }
      await page.keyboard.press('Escape'); await page.waitForTimeout(800);
    }
  }
  out.push(rec);
}
fs.writeFileSync(`${EV}/p3c-all-dots.json`, JSON.stringify(out,null,1));
console.log('\nwritten');
await browser.close();
