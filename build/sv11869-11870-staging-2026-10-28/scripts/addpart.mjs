// On screen: Lines → + Add Part (first line) → More options → Part = -A12 → quantity 1 → Save. Prints the request.
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const WO='99e6423d-3b81-4a2a-803f-5b22d7b04f86', LOC='b3c8c820-f815-4cf1-8938-10956c5ee71a', PN=process.argv[2]||'-A12';
const s=await open({env:'staging',ticket:'staging',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:'/tmp/qa30',user:'bilal.muzamil@shopview.com',quick:'admin',vp:{width:1440,height:900}});
const p=s.page; await s.go('/workorders'); await p.evaluate(L=>localStorage.setItem('location',JSON.stringify(L)),LOC); await s.go(`/workorders/${WO}/lines`); await p.waitForTimeout(5000);
for(let i=0;i<20;i++){ const ok=await p.evaluate(()=>{const b=[...document.querySelectorAll('[data-test-id="button_add_part"]')].find(e=>e.getBoundingClientRect().width>0); if(b){b.click();return true;} return false;}); if(ok) break; await p.waitForTimeout(600); }
await p.waitForTimeout(1500); const mo=p.locator('button',{hasText:'More options'}); if(await mo.count()){ await mo.first().click(); await p.waitForTimeout(2500); }
console.log('dialog ids',[...new Set(await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].filter(e=>e.getBoundingClientRect().width>0).map(e=>e.getAttribute('data-test-id').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g,'<id>'))))].join(' ; '));
const sp=p.locator('.q-dialog [data-test-id="select_part"]').first(); await sp.click(); await p.waitForTimeout(400); await p.keyboard.type(PN,{delay:60}); await p.waitForTimeout(3500);
console.log('options',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.replace(/\s+/g,' ').trim()).slice(0,5))));
await p.locator('.q-menu .q-item',{hasText:'Hose clamp'}).first().click(); await p.waitForTimeout(2500);
const bins=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="input_bin_quantity_"]')].map(e=>e.getAttribute('data-test-id'))); console.log('bins',bins);
if(bins.length){ const bl=p.locator(`[data-test-id="${bins[0]}"]`); await ((await bl.evaluate(e=>e.tagName))==='INPUT'?bl:bl.locator('input')).fill('1'); await p.waitForTimeout(500); }
const price=p.locator('.q-dialog [data-test-id*="sell_price"]').first(); if(await price.count()){ const i=(await price.evaluate(e=>e.tagName))==='INPUT'?price:price.locator('input'); await i.fill('25'); await p.waitForTimeout(400); }
const w0=s.writes.length; const sv=p.locator('.q-dialog [data-test-id="button_workorder_part_save"]'); await (await sv.count()?sv:p.locator('.q-dialog button',{hasText:/^\s*Save\s*$/})).first().click(); await p.waitForTimeout(4000);
console.log('writes',JSON.stringify(s.writes.slice(w0).filter(w=>!/envelope|touch/.test(w)).map(w=>w.slice(0,400))));
console.log('toasts',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' ')))));
await p.screenshot({path:'/tmp/qa30/part-added.png'});
await s.close(); process.exit(0);
