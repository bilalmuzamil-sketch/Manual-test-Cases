// READ-ONLY. Walk to Settings -> Roles and permissions and record the endpoints the page calls,
// so the roles list (and each role's work-order view mode) can be read from the real route.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const s = await boot('sv9315','/workorders','admin');
const { page, APP } = s;
const seen=[];
page.on('response', r => { const u=r.url(); if (/\/api\//.test(u)) seen.push(`${r.status()} ${r.request().method()} ${u.replace(/^https?:\/\/[^/]+/,'')}`); });

for (const route of ['/administration/roles-and-permissions','/administration/roles','/administration/settings','/administration/staff']) {
  seen.length=0;
  await page.goto(APP+route, {waitUntil:'domcontentloaded', timeout:60000}).catch(e=>log('nav err',route));
  await page.waitForTimeout(8000);
  const t = await page.evaluate(()=>({url:location.pathname,
     head:(document.body.innerText||'').replace(/\s+/g,' ').slice(0,220)}));
  log(`${route} -> ${t.url}`);
  log('   head:', t.head.slice(0,150));
  const apis=[...new Set(seen)].filter(x=>!/quick-login|notifications|feature-flags|my-current-task|punch-clock/.test(x));
  apis.slice(0,10).forEach(a=>log('   api:',a));
  if (/role/i.test(t.head) || /role/i.test(t.url)) {
    await page.screenshot({path:`${DIR}/evidence/05-${route.replace(/\//g,'_')}.png`, fullPage:true});
    const roles = await page.evaluate(()=>{
      const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
      const rows=[...document.querySelectorAll('tr,.q-item,[class*=role-card]')].map(r=>t(r)).filter(x=>x&&x.length<160);
      return rows.slice(0,40);
    });
    log('   rows:'); roles.slice(0,25).forEach(r=>log('     -',r.slice(0,110)));
    fs.writeFileSync(`${DIR}/evidence/05-roles-rows.json`, JSON.stringify({route,apis,roles},null,1));
  }
}
await s.browser.close();
