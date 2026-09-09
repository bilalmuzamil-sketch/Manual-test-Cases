// Target the "Move labor" permission precisely; watch the save request; re-read after a reload.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const s = await boot('sv9315','/workorders','admin');
const { page } = s;
const calls=[];
page.on('response', async r=>{ const u=r.url();
  if(/\/api\/.*(role|permission)/i.test(u) && r.request().method()!=='GET')
    calls.push(`${r.status()} ${r.request().method()} ${u.replace(/^https?:\/\/[^/]+/,'')}`); });

const goRole = async () => {
  await page.evaluate(()=>document.querySelectorAll(".q-dialog__backdrop").forEach(e=>e.remove()));
  await page.evaluate(()=>document.querySelector("[data-test-id=profile_menu_button]").click()); await page.waitForTimeout(2500);
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
};
await goRole();

const find = async () => page.evaluate(()=>{
  const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  // the row that CONTAINS the words "Move labor"
  const rows=[...document.querySelectorAll('div,tr,li')].filter(e=>{
    const own=[...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join(' ');
    return /Move labor/i.test(own) || (/Move labor/i.test(t(e)) && t(e).length<60);
  });
  const row=rows[rows.length-1];
  if(!row) return {err:'Move labor row not found'};
  const host=row.querySelector('.q-toggle,.q-checkbox') || row.parentElement?.querySelector('.q-toggle,.q-checkbox');
  const inp=host&&host.querySelector('input');
  return { rowText:t(row).slice(0,80), hasHost:!!host,
           on: host? (host.getAttribute('aria-checked')==='true'||host.classList.contains('q-toggle--truthy')) : null,
           disabled: host? (host.classList.contains('disabled')||host.getAttribute('aria-disabled')==='true'||(inp&&inp.disabled)) : null,
           inputChecked: inp? inp.checked : null };
});
let st = await find(); log('BEFORE:', JSON.stringify(st));

const click = await page.evaluate(()=>{
  const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const rows=[...document.querySelectorAll('div,tr,li')].filter(e=>{
    const own=[...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join(' ');
    return /Move labor/i.test(own) || (/Move labor/i.test(t(e)) && t(e).length<60);
  });
  const row=rows[rows.length-1]; if(!row) return 'no row';
  const host=row.querySelector('.q-toggle,.q-checkbox') || row.parentElement?.querySelector('.q-toggle,.q-checkbox');
  if(!host) return 'no toggle host';
  host.scrollIntoView({block:'center'}); host.click(); return 'clicked';
});
log('click:', click);
await page.waitForTimeout(2000);
st = await find(); log('AFTER CLICK:', JSON.stringify(st));
await page.screenshot({path:`${DIR}/evidence/13-a-toggled.png`, fullPage:true});

const save = await page.evaluate(()=>{
  const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const b=[...document.querySelectorAll('button')].find(e=>/^save/i.test(t(e)));
  if(!b) return 'no save'; if(b.disabled) return 'save DISABLED'; b.click(); return 'clicked "'+t(b)+'"';
});
log('save:', save);
await page.waitForTimeout(9000);
log('write calls:', JSON.stringify(calls));
const toast = await page.evaluate(()=>[...document.querySelectorAll('.q-notification,.q-toast,[role=alert]')].map(e=>(e.textContent||'').trim()).slice(0,3));
log('toast:', JSON.stringify(toast));

// RELOAD and re-verify
await goRole();
st = await find(); log('AFTER RELOAD:', JSON.stringify(st));
fs.writeFileSync(`${DIR}/evidence/13-movelabor.json`, JSON.stringify({calls,toast,final:st},null,1));
await s.browser.close();
