import {sess} from './common.mjs';
const s=await sess(); const p=s.page; const out='../ev/prod';
await s.go('/workorders'); await p.waitForTimeout(4000);
const tabs=await p.evaluate(()=>[...document.querySelectorAll('[role=tab],.q-tab')].map(e=>e.innerText.trim()).filter(Boolean)); console.log('tabs',tabs.join('|'));
const all=p.locator('.q-tab:has-text("All")').first(); if(await all.count()) { await all.click(); await p.waitForTimeout(2500); }
const btns=await p.evaluate(()=>[...document.querySelectorAll('button')].map(b=>b.innerText.replace(/\s+/g,' ').trim()).filter(t=>/status|filter/i.test(t))); console.log('buttons',btns.join('|'));
const st=p.locator('button:has-text("Status")').first(); console.log('status btn',await st.count());
if(await st.count()){ await st.click(); await p.waitForTimeout(1500);
  const opts=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item, .q-menu label, .q-dialog .q-item')].map(e=>e.innerText.replace(/\s+/g,' ').trim()).filter(Boolean)); console.log('opts',opts.join('|'));
  const imp=p.locator('.q-menu :text-is("Imported"), .q-dialog :text-is("Imported")').first(); console.log('imp',await imp.count());
  await p.screenshot({path:`${out}/walk-status-menu.png`}); const dis=await p.evaluate(()=>[...document.querySelectorAll(".q-menu .q-checkbox, .q-menu .q-item")].map(e=>(e.innerText.trim())+":"+(e.getAttribute("aria-disabled")||e.className.includes("disabled")))); console.log("dis",dis.join("|")); if(false){ await imp.click(); await p.waitForTimeout(3000); }
  await p.keyboard.press('Escape'); await p.waitForTimeout(2500); }
console.log('url',p.url());
await p.screenshot({path:`${out}/walk-list.png`});
const row=p.locator('text=ZZQTYPDF-P').first(); console.log('row visible',await row.count());
const rows=await p.evaluate(()=>[...document.querySelectorAll('tr')].slice(0,8).map(t=>t.innerText.replace(/\s+/g,' ').trim())); console.log(rows.join('\n'));
if(await row.count()){ const bb=await row.boundingBox(); console.log('rowbox',JSON.stringify(bb)); await row.click(); await p.waitForTimeout(5000); console.log('opened',p.url()); }
await s.close(); process.exit(0);
