// READ-ONLY. Profile menu -> Settings -> Roles and permissions. Enumerate roles + view mode.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const s = await boot('sv9315','/workorders','admin');
const { page } = s;
const seen=[]; page.on('response', r=>{const u=r.url(); if(/\/api\//.test(u)&&!/maps|sentry|envelope/.test(u)) seen.push(`${r.status()} ${r.request().method()} ${u.replace(/^https?:\/\/[^/]+/,'')}`);});

await page.click('[data-test-id=profile_menu_button]');
await page.waitForTimeout(2500);
const go = await page.evaluate(()=>{
  const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const m=[...document.querySelectorAll('.q-menu .q-item, [role=menuitem]')].find(e=>/settings$/i.test(t(e)));
  if(!m) return 'not found'; m.click(); return 'clicked "'+t(m)+'"';
});
log('settings:', go);
await page.waitForTimeout(9000);
log('url:', page.url());
await page.screenshot({path:`${DIR}/evidence/07-settings.png`, fullPage:true});
const secs = await page.evaluate(()=>{
  const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  return [...document.querySelectorAll('.q-item, [role=tab], a, button')].map(t)
    .filter(x=>x&&x.length<46).filter((v,i,a)=>a.indexOf(v)===i).slice(0,60);
});
log('sections:', JSON.stringify(secs));

const gorole = await page.evaluate(()=>{
  const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const m=[...document.querySelectorAll('.q-item, [role=tab], a, button')].find(e=>/roles.*permission/i.test(t(e)));
  if(!m) return 'not found'; m.scrollIntoView({block:'center'}); m.click(); return 'clicked "'+t(m)+'"';
});
log('roles nav:', gorole);
await page.waitForTimeout(9000);
log('url:', page.url());
await page.screenshot({path:`${DIR}/evidence/07-roles.png`, fullPage:true});
const roles = await page.evaluate(()=>{
  const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const rows=[...document.querySelectorAll('tr')].map(r=>({cells:[...r.querySelectorAll('td,th')].map(t)}))
     .filter(r=>r.cells.length);
  return { rows: rows.slice(0,40), head:(document.body.innerText||'').replace(/\s+/g,' ').slice(0,300) };
});
log('role rows:'); roles.rows.forEach(r=>log('   ', JSON.stringify(r.cells).slice(0,150)));
log('apis:', JSON.stringify([...new Set(seen)].filter(a=>/role|permission|template/i.test(a))));
fs.writeFileSync(`${DIR}/evidence/07-roles.json`, JSON.stringify({secs,roles,apis:[...new Set(seen)]},null,1));
await s.browser.close();
