// READ-ONLY. Walk the UI (no page.goto) to Settings -> Roles and permissions.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const s = await boot('sv9315','/workorders','admin');
const { page } = s;
const seen=[]; page.on('response', r=>{const u=r.url(); if(/\/api\//.test(u)&&!/maps|sentry|envelope/.test(u)) seen.push(`${r.status()} ${r.request().method()} ${u.replace(/^https?:\/\/[^/]+/,'')}`);});
const T=e=>(e.textContent||'').replace(/\s+/g,' ').trim();

// what top-level nav exists?
const nav = await page.evaluate(()=>{
  const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  return [...document.querySelectorAll('header a, nav a, .q-drawer a, [role=navigation] a, header button, .q-toolbar button')]
    .map(e=>({l:t(e).slice(0,30), href:e.getAttribute('href'), tid:e.getAttribute('data-test-id')}))
    .filter(x=>x.l).slice(0,40);
});
log('nav items:'); nav.forEach(n=>log('   ', JSON.stringify(n)));

// open the avatar / org menu (settings usually lives there)
const opened = await page.evaluate(()=>{
  const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const cand=[...document.querySelectorAll('button,[role=button],.q-avatar,.q-btn')]
    .filter(e=>/AS$|Staging Heavy Duty|account|profile|settings|menu/i.test(t(e)) || e.className.includes('avatar'));
  if(!cand.length) return 'no candidate';
  cand[cand.length-1].click(); return 'clicked: '+t(cand[cand.length-1]).slice(0,40);
});
log('avatar/org menu:', opened);
await page.waitForTimeout(3000);
const menu = await page.evaluate(()=>{
  const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  return [...document.querySelectorAll('.q-menu .q-item, .q-menu a, [role=menuitem]')].map(t).filter(Boolean).slice(0,30);
});
log('menu items:', JSON.stringify(menu));
await page.screenshot({path:`${DIR}/evidence/06-menu.png`});

// click anything that says Settings / Administration
const go = await page.evaluate(()=>{
  const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const m=[...document.querySelectorAll('.q-menu .q-item, .q-menu a, [role=menuitem], nav a, header a')]
    .find(e=>/^(settings|administration|admin)$/i.test(t(e)));
  if(!m) return 'not found'; m.click(); return 'clicked '+t(m);
});
log('settings click:', go);
await page.waitForTimeout(8000);
log('url now:', page.url());
await page.screenshot({path:`${DIR}/evidence/06-settings.png`, fullPage:true});
const sec = await page.evaluate(()=>{
  const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  return { url:location.pathname,
    links:[...document.querySelectorAll('a,.q-item,[role=tab],button')].map(e=>t(e)).filter(x=>x&&x.length<44).slice(0,50),
    head:(document.body.innerText||'').replace(/\s+/g,' ').slice(0,300) };
});
log('settings sections:', JSON.stringify(sec.links.slice(0,30)));
log('apis:', JSON.stringify([...new Set(seen)].slice(-12)));
fs.writeFileSync(`${DIR}/evidence/06-settings.json`, JSON.stringify({nav,menu,sec,apis:[...new Set(seen)]},null,1));
await s.browser.close();
