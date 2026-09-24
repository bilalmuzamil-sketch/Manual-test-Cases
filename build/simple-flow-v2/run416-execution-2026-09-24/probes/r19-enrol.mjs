// As the administrator, put the lower-permission person into Trucks Hill 2 so they can see the
// seeded work order. Runs on MY account; their role is not touched.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WHO='bilal.muzamil+serviceadvisorlimitedview@shopview.com';
const { browser, page } = await bootProdLogin('/administration/staff', { settle: 13000, viewport:{width:1680,height:1000} });
page.setDefaultTimeout(25000);
// the staff list remembers a role filter; try each role filter until the row shows
let found = false;
for (const f of ['Service Advisor','Office User','Admin','Foreman','Technician','']) {
  await page.goto('https://app.shopview.com/administration/staff' + (f? '?roles='+encodeURIComponent(f) : ''), {waitUntil:'domcontentloaded'});
  await page.waitForTimeout(8000);
  const t = await page.evaluate(()=>document.body.innerText);
  if (t.includes(WHO)) { console.log('found under filter:', JSON.stringify(f||'(none)')); found = true; break; }
}
if (!found) { console.log('could not find that person on the staff list under any filter tried'); await page.screenshot({path:`${EV}/staff-search.png`, fullPage:true}); await browser.close(); process.exit(0); }
const row = page.locator('tr', { hasText: WHO }).first();
await row.hover(); await page.waitForTimeout(1200);
await row.locator('.q-btn:has-text("edit")').first().click();
await page.waitForTimeout(7000);
const before = await page.evaluate(()=>{ const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
  return d? (d.innerText||'').replace(/\s+/g,' ').slice(0,400) : 'no dialog'; });
console.log('staff dialog:', before);
await page.screenshot({ path: `${EV}/limitedperson-staff.png` });
const opened = await page.evaluate(()=>{ const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
  const f=[...d.querySelectorAll('.q-field')].find(x=>/^Location/.test((x.innerText||'').trim())); if(!f) return 'no Location field';
  f.scrollIntoView({block:'center'}); f.click(); return 'opened the Location field'; });
console.log(opened); await page.waitForTimeout(3500);
const chose = await page.evaluate(()=>{ const it=[...document.querySelectorAll('.q-menu .q-item')].find(e=>/Trucks Hill 2/.test((e.innerText||'').trim()));
  if(!it) return 'Trucks Hill 2 not offered: '+[...document.querySelectorAll('.q-menu .q-item')].map(e=>(e.innerText||'').trim()).join(' | ').slice(0,200);
  it.click(); return 'chose Trucks Hill 2'; });
console.log(chose); await page.waitForTimeout(2500);
await page.screenshot({ path: `${EV}/limitedperson-location.png` });
const saved = await page.evaluate(()=>{ const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0];
  const b=[...d.querySelectorAll('button,.q-btn')].find(x=>/Save/.test((x.innerText||'').trim())); if(!b) return 'no save'; b.click(); return 'pressed '+(b.innerText||'').trim(); });
console.log(saved); await page.waitForTimeout(9000);
await browser.close();
