// Use the BRANCH'S OWN quick-login control, through the UI, as the QA lead directed.
// The login page carries "Admin" and "Tech" buttons; clicking one lets the app log in normally and
// mint its own user object, which is the thing raw HTTP could never produce.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const APP='https://sv9315.qa.shopview.com';
const port=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const cookies=JSON.parse(fs.readFileSync('/tmp/qa-cookies/sv9315-cookies.json','utf8'));
const ROLE=process.env.ROLE||'Admin', OUT='build/probe-2026-09-02/boot';
const browser=await chromium.launch({args:['--no-sandbox'],proxy:{server:`http://127.0.0.1:${port}`}});
const ctx=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1700,height:1150}});
const spread=[]; for (const c of cookies) for (const d of ['.qa.shopview.com','sv9315.qa.shopview.com','sv9315api.qa.shopview.com'])
  spread.push({name:c.name,value:c.value,domain:d,path:'/'});
await ctx.addCookies(spread);
const page=await ctx.newPage(); page.setDefaultTimeout(60000);
const calls=[]; page.on('response',r=>{const u=r.url(); if(/shopview\.com\/api\//.test(u)) calls.push(`${r.status()} ${r.request().method()} ${u.replace(/https:\/\/[^/]+/,'')}`);});

await page.goto(APP+'/',{waitUntil:'networkidle'});
console.log('landed on', page.url().replace(APP,'')||'/');
// Find it the SAME WAY it was read - icon children stripped - then click that exact element.
// A Playwright hasText locator compares RAW text, which includes the icon glyphs, so `^Admin$`
// never matches a button whose real textContent is "person Admin".
const handles = await page.$$('button, [role="button"], .q-btn');
let btn = null;
for (const h of handles) {
  const t = await h.evaluate(el => { const c = el.cloneNode(true);
    c.querySelectorAll('svg,i,[class*="icon"],[aria-hidden="true"]').forEach(n => n.remove());
    return (c.textContent || '').replace(/\s+/g, ' ').trim(); });
  if (t === ROLE) { btn = h; break; }
}
if (!btn) { console.log(`no quick-login button labelled ${JSON.stringify(ROLE)} on this page`); await browser.close(); process.exit(3); }
console.log(`clicking the "${ROLE}" quick-login button…`);
await btn.click();
await page.waitForLoadState('networkidle').catch(()=>{});
await page.waitForTimeout(4000);
console.log('now at', page.url().replace(APP,'')||'/');
const st = await page.evaluate(()=>({local:Object.keys(localStorage),session:Object.keys(sessionStorage)}));
console.log('storage keys:', JSON.stringify(st));
const signedIn = !/\/login|accounts\.google/.test(page.url());
console.log('signedIn =', signedIn);
if (st.local.includes('user')) {
  const u = await page.evaluate(()=>{ try { return JSON.parse(localStorage.getItem('user')); } catch(e){ return null; } });
  // print SHAPE and identity only - never the token
  const d = u && u.data ? u.data : {};
  console.log('user object present. role =', d.role, '| name =',
    (d.details && (d.details.first_name||'') + ' ' + (d.details.last_name||'')).trim(),
    '| staff_id =', d.details && d.details.staff_id, '| keys =', JSON.stringify(Object.keys(d)));
}
console.log('\napi calls during login:'); [...new Set(calls)].slice(0,14).forEach(c=>console.log('   '+c));
if (signedIn) {
  // prove the app really rendered: read the top menu from the smallest elements that own the labels
  const menu = await page.evaluate(()=>[...document.querySelectorAll('header a, header button, .q-toolbar a, nav a')]
    .map(el=>{const c=el.cloneNode(true);c.querySelectorAll('svg,i,[class*="icon"]').forEach(n=>n.remove());
      return (c.textContent||'').replace(/\s+/g,' ').trim();}).filter(Boolean).slice(0,12));
  console.log('top menu read off the screen:', JSON.stringify(menu));
  await ctx.storageState({ path: '/tmp/qa-cookies/sv9315-state.json' });
  fs.chmodSync('/tmp/qa-cookies/sv9315-state.json', 0o600);
  console.log('storage state saved (chmod 600) -> /tmp/qa-cookies/sv9315-state.json');
}
await page.screenshot({path:`${OUT}/after-quick-login.png`, fullPage:false});
await browser.close();
