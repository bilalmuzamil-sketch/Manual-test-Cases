// WRITE: turn ON the one OFF permission in the Admin role ("Move labor").
// QA lead 2026-09-09: "make sure that in that Admin role all the permissions are toggled on".
// Clicks the toggle HOST once only - clicking host + inner input would cancel out.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const ROLE='4f2ceffc-5f9e-46c3-b727-ede156159bbf';   // the Admin role
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const s = await boot('sv9315','/workorders','admin');
const { page } = s;
const rec={role:'Admin', roleId:ROLE, when:new Date().toISOString()};
await page.click('[data-test-id=profile_menu_button]'); await page.waitForTimeout(2500);
await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  [...document.querySelectorAll('.q-menu .q-item')].find(e=>/settings$/i.test(t(e)))?.click();});
await page.waitForTimeout(8000);
await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  [...document.querySelectorAll('.q-item,a,button')].find(e=>/roles.*permission/i.test(t(e)))?.click();});
await page.waitForTimeout(8000);
await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const row=[...document.querySelectorAll('tr')].find(r=>{const c=[...r.querySelectorAll('td')].map(t); return c[1]==='Admin';});
  [...row.querySelectorAll('button,[role=button],i,span')].find(e=>/^edit$/.test(t(e)))?.click();});
await page.waitForTimeout(9000);

const before = await page.evaluate(()=>{
  const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const hosts=[...document.querySelectorAll('.q-toggle,.q-checkbox')];
  return hosts.map(h=>({l:t(h).slice(0,50), on:h.getAttribute('aria-checked')==='true'||h.classList.contains('q-toggle--truthy')}))
              .filter(x=>!x.on);
});
log('OFF before:', JSON.stringify(before)); rec.offBefore=before;

const clicked = await page.evaluate(()=>{
  const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const hosts=[...document.querySelectorAll('.q-toggle,.q-checkbox')]
    .filter(h=>!(h.getAttribute('aria-checked')==='true'||h.classList.contains('q-toggle--truthy')));
  const done=[];
  for (const h of hosts){ h.scrollIntoView({block:'center'}); h.click(); done.push(t(h).slice(0,40)); }
  return done;
});
log('toggled ON:', JSON.stringify(clicked)); rec.toggled=clicked;
await page.waitForTimeout(2500);
const after = await page.evaluate(()=>{
  const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const hosts=[...document.querySelectorAll('.q-toggle,.q-checkbox')];
  return { total:hosts.length,
           off:hosts.filter(h=>!(h.getAttribute('aria-checked')==='true'||h.classList.contains('q-toggle--truthy'))).map(h=>t(h).slice(0,40)) };
});
log('after toggling -> total', after.total, 'OFF:', JSON.stringify(after.off)); rec.afterToggle=after;
await page.screenshot({path:`${DIR}/evidence/12-a-toggled.png`, fullPage:true});

const saved = await page.evaluate(()=>{
  const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const b=[...document.querySelectorAll('button')].find(e=>/^(save|save & close|save changes)$/i.test(t(e)));
  if(!b) return 'no save button: '+JSON.stringify([...document.querySelectorAll('button')].map(x=>t(x).slice(0,20)).slice(-10));
  if(b.disabled) return 'save DISABLED';
  b.click(); return 'saved via "'+t(b)+'"';
});
log('save:', saved); rec.save=saved;
await page.waitForTimeout(9000);
await page.screenshot({path:`${DIR}/evidence/12-b-saved.png`, fullPage:true});
fs.writeFileSync(`${DIR}/evidence/12-adminperms.json`, JSON.stringify(rec,null,1));
await s.browser.close();
