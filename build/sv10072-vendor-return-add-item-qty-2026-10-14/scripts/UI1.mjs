// usage: node UI1.mjs <pn> <partId> <shotPrefix>
import {os,J,post} from './lib.mjs'; import fs from 'fs';
const [pn,pid,tag]=process.argv.slice(2);
const s=await os(); const p=s.page; await post(s,'/api/iam/change-location',{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'});
await s.go('/parts/inventory'); await p.waitForTimeout(3500);
if(await p.locator('[data-test-id="filter_chip_clear_gridLocation"]').count()){ const bb=await p.locator('[data-test-id="filter_chip_clear_gridLocation"]').boundingBox(); await p.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); await p.waitForTimeout(2000); }
await p.locator('[data-test-id="page_search_toggle"]').click(); await p.waitForTimeout(800); await p.keyboard.type(pn,{delay:40}); await p.waitForTimeout(3500);
const row=await p.evaluate(id=>[...document.querySelectorAll(`[data-test-id*="${id}"]`)].filter(e=>e.offsetParent).map(e=>{const r=e.getBoundingClientRect();return [e.getAttribute('data-test-id'),(e.innerText||'').trim().replace(/\s+/g,' ').slice(0,40),[r.x,r.y,r.width,r.height].map(Math.round)]}),pid);
console.log('row',J(row,1500)); fs.writeFileSync(`geo-${tag}-row.json`,JSON.stringify(row)); await p.screenshot({path:`ev/${tag}-inventory.png`});
const hb=row.find(x=>/history/i.test(x[0])); console.log('history btn',J(hb));
if(hb){ await p.locator(`[data-test-id="${hb[0]}"]`).click(); await p.waitForTimeout(3500);
  const d=await p.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].pop(); if(!d) return null; const rows=[...d.querySelectorAll('tbody tr')].slice(0,4).map(r=>{const b=r.getBoundingClientRect();return [r.innerText.replace(/\s+/g,' ').slice(0,200),[b.x,b.y,b.width,b.height].map(Math.round)]}); return {txt:d.innerText.replace(/\s+/g,' ').slice(0,700),rows};});
  console.log('history',J(d,2000)); fs.writeFileSync(`geo-${tag}-hist.json`,JSON.stringify(d)); await p.screenshot({path:`ev/${tag}-history.png`}); }
await s.close();
