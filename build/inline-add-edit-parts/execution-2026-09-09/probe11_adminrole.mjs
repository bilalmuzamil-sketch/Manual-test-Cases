// READ-ONLY first: open the Admin ROLE and report every permission toggle and its state, so any
// that are OFF can be turned on (QA lead 2026-09-09: the Admin role must have all permissions on).
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const s = await boot('sv9315','/workorders','admin');
const { page } = s;
await page.click('[data-test-id=profile_menu_button]'); await page.waitForTimeout(2500);
await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  [...document.querySelectorAll('.q-menu .q-item')].find(e=>/settings$/i.test(t(e)))?.click();});
await page.waitForTimeout(8000);
await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  [...document.querySelectorAll('.q-item,a,button')].find(e=>/roles.*permission/i.test(t(e)))?.click();});
await page.waitForTimeout(8000);
log('roles url:', page.url());

// open the Admin role's editor via its row pencil
const op = await page.evaluate(()=>{
  const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const row=[...document.querySelectorAll('tr')].find(r=>{const c=[...r.querySelectorAll('td')].map(t); return c[1]==='Admin';});
  if(!row) return 'Admin role row not found';
  const p=[...row.querySelectorAll('button,[role=button],i,span')].find(e=>/^edit$/.test(t(e)));
  if(!p) return 'no edit control; cells='+JSON.stringify([...row.querySelectorAll('td')].map(t));
  p.click(); return 'opened';
});
log('open Admin role:', op);
await page.waitForTimeout(9000);
log('url now:', page.url());
await page.screenshot({path:`${DIR}/evidence/11-adminrole.png`, fullPage:true});

const perms = await page.evaluate(()=>{
  const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const toggles=[...document.querySelectorAll('.q-toggle, .q-checkbox, input[type=checkbox]')].map(e=>{
    const host=e.closest('.q-toggle,.q-checkbox')||e;
    const on = host.getAttribute('aria-checked')==='true' || host.classList.contains('q-toggle--truthy')
            || (e.type==='checkbox'&&e.checked);
    let label=t(host); if(!label){ const p=host.parentElement; label=p?t(p).slice(0,60):''; }
    return {label:label.slice(0,60), on:!!on};
  });
  return { count:toggles.length, off:toggles.filter(x=>!x.on).map(x=>x.label), on:toggles.filter(x=>x.on).length,
           head:(document.body.innerText||'').replace(/\s+/g,' ').slice(0,300),
           sections:[...document.querySelectorAll('h1,h2,h3,.text-h6,.q-expansion-item')].map(t).filter(Boolean).slice(0,25) };
});
log('toggles:', perms.count, '| ON:', perms.on, '| OFF:', perms.off.length);
log('sections:', JSON.stringify(perms.sections.slice(0,16)));
if (perms.off.length) { log('OFF toggles:'); perms.off.slice(0,40).forEach(x=>log('   -', x)); }
log('head:', perms.head.slice(0,200));
fs.writeFileSync(`${DIR}/evidence/11-adminrole.json`, JSON.stringify(perms,null,1));
await s.browser.close();
