// C44599 / C44601: the finish actions the work order header offers, across work orders in different states.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WOS = process.argv.slice(2).map(s=>{const [n,id]=s.split('=');return {n,id};});
const { browser, page } = await bootProdLogin('/workorders', { settle: 9000 });
page.setDefaultTimeout(18000);
const out = [];
for (const w of WOS) {
  await openWo(page, w.id); await page.waitForTimeout(2500);
  const head = await page.evaluate(() => {
    // the header block is the area above the lines table carrying the work order number
    const card = document.querySelector('.q-card, header') || document.body;
    const top = [...document.querySelectorAll('button, .q-btn')].filter(b => { const r=b.getBoundingClientRect(); return r.width && r.top < 320; })
      .map(b => ({ t:(b.innerText||'').replace(/\s+/g,' ').trim(), disabled: b.disabled===true||b.getAttribute('aria-disabled')==='true'||/disabled/.test((b.className||'').toString()), title:b.getAttribute('title')||b.getAttribute('aria-label')||'' }));
    const badges = [...document.querySelectorAll('.q-badge')].slice(0,6).map(b=>(b.innerText||'').trim());
    return { top, badges };
  });
  // the work order ... menu (the first more_vert near the top)
  let menu = null;
  const mv = page.locator('button:has-text("more_vert"), .q-btn:has-text("more_vert")').first();
  try { await mv.click({timeout:7000}); await page.waitForTimeout(2000);
    menu = await page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>({t:(e.innerText||'').trim().replace(/\s+/g,' '), disabled:/disabled/.test((e.className||'').toString())||e.getAttribute('aria-disabled')==='true'})));
    await page.screenshot({ path: `${EV}/C44599-${w.n}-menu.png` });
    await page.keyboard.press('Escape'); await page.waitForTimeout(800);
  } catch(e){ menu = [{t:'ERR '+e.message.split('\n')[0]}]; }
  const t = await page.evaluate(()=>document.body.innerText);
  const marks = { 'Mark as reviewed': t.includes('Mark as reviewed'), 'Create invoice': t.includes('Create invoice'), 'Send': t.includes('Send'), 'New Line': t.includes('New Line'),
    'All lines must be approved before invoicing': t.includes('All lines must be approved before invoicing') };
  console.log('\n####', w.n, '| badges', JSON.stringify(head.badges));
  console.log('  header buttons:', JSON.stringify(head.top.filter(b=>b.t && !/ShopHub|Schedule|Customers|Reports|Clock In|notifications|Trucks Hill|Work Orders|Parts$/.test(b.t)).map(b=>(b.disabled?'[off]':'')+b.t)));
  console.log('  ... menu:', JSON.stringify((menu||[]).map(m=>(m.disabled?'[off]':'')+m.t)));
  console.log('  words:', JSON.stringify(marks));
  out.push({ ...w, head, menu, marks });
  await page.screenshot({ path: `${EV}/C44599-${w.n}.png` });
}
fs.writeFileSync(`${EV}/C44599-headers.json`, JSON.stringify(out,null,1));
await browser.close();
