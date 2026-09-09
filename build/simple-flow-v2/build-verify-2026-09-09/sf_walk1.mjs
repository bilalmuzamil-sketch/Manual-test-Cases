import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const OUT='/home/user/Manual-test-Cases/build/simple-flow-v2/build-verify-2026-09-09';
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const { browser, page } = await boot('sv8683','/workorders?tab=work_orders','admin');
await page.waitForTimeout(7000);
console.log('build:', await page.evaluate(()=>document.querySelector('meta[name=app-version]')?.content));
// top nav + WO list tabs
console.log('TOPNAV:', JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('header a,nav a,.q-tab')].map(e=>(e.textContent||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,20))));
// WO list: tabs (work_orders/estimate etc) + open a WO
const tabs=await page.evaluate(()=>[...document.querySelectorAll('.q-tab,[role=tab]')].map(e=>(e.textContent||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,10));
console.log('WO TABS:', JSON.stringify(tabs));
// open first WO row with lines
await page.evaluate(L=>{const lab=eval(L);const tb=document.querySelector('table');if(!tb)return;for(const tr of tb.querySelectorAll('tbody tr')){const t=[...tr.cells].map(lab).join('');if(t.trim().length>3){tr.setAttribute('data-o','1');break;}}}, lab);
await page.locator('[data-o="1"] td').nth(1).click().catch(()=>{}); await page.waitForTimeout(9000);
console.log('WO url:', page.url());
// tabs on the WO
console.log('WO DETAIL TABS:', JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('.q-tab,[role=tab]')].map(e=>(e.textContent||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,12))));
await page.locator('.q-tab:has-text("Lines")').first().click().catch(()=>{}); await page.waitForTimeout(4000);
// line-level + part-level controls
const ctrls=await page.evaluate(()=>{const o=[];document.querySelectorAll('button,.q-btn,[role=button]').forEach(e=>{if(!e.offsetParent)return;const t=((e.textContent||'')+'|'+(e.getAttribute('aria-label')||'')).replace(/\s+/g,' ').trim();if(t&&t.length<40)o.push(t);});return [...new Set(o)].slice(0,40);});
console.log('LINE/PART CONTROLS:', JSON.stringify(ctrls,null,0));
// status badges
console.log('BADGES:', JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('.q-badge,.q-chip,[class*=status],[class*=badge]')].map(e=>(e.textContent||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,20))));
fs.mkdirSync(OUT,{recursive:true});
await page.screenshot({path:OUT+'/wo-lines-sv8683.png',fullPage:false}).catch(()=>{});
await browser.close();
