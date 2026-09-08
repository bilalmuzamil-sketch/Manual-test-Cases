import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const { browser, page, APIH } = await boot('sv9315', '/work-orders', 'admin');
const calls=[]; page.on('response',r=>{const u=r.url(); if(u.includes(APIH)&&/work-order|line/i.test(u)) calls.push(`${r.status()} ${r.request().method()} ${u.replace(`https://${APIH}`,'').slice(0,110)}`);});
await page.waitForTimeout(12000);
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const s=await page.evaluate(L=>{const lab=eval(L);
  return { url:location.href, bodyLen:(document.body.innerText||'').length, bodySample:(document.body.innerText||'').replace(/\s+/g,' ').slice(0,300),
    tabs:[...new Set([...document.querySelectorAll('.q-tab,[role=tab],.q-btn-toggle button')].map(lab).filter(Boolean))],
    buttons:[...new Set([...document.querySelectorAll('button,.q-btn')].map(lab).filter(x=>x&&x.length<24))].slice(0,20),
    tables:document.querySelectorAll('table').length, rows:document.querySelectorAll('table tbody tr').length,
    cards:document.querySelectorAll('.q-card,[class*=card]').length };}, lab);
console.log(JSON.stringify(s,null,1).slice(0,1600));
console.log('WO/line API calls:', JSON.stringify([...new Set(calls)]));
await page.screenshot({path:'build/inline-add-edit-parts/build-verify-2026-09-08/wo-page.png', fullPage:true});
await browser.close();
