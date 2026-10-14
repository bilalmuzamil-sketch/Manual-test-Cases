import {ob,J} from './lib.mjs'; import {loc} from './seed.mjs'; import fs from 'fs';
const A=JSON.parse(fs.readFileSync('A2.json')); const s=await ob(); const p=s.page; await loc(s);
await s.go('/parts/part-sale/'+A.ps_id+'/part-requests'); await p.waitForTimeout(3500);
const menu=async tid=>{ await p.locator(`[data-test-id^="${tid}"]`).first().click(); await p.waitForTimeout(1000);
  const r=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>(e.getAttribute('data-test-id')||'-')+'|'+e.innerText.trim()+((e.classList.contains('disabled'))?'(dis)':''))); await p.keyboard.press('Escape'); await p.waitForTimeout(500); return r; };
console.log('part menu',J(await menu('button_part_request_menu_'),500));
console.log('nav tids',J(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-test-id')).filter(t=>/nav_bar|menu|status/.test(t))),400));
const nm=await p.locator('[data-test-id="button_part_sale_nav_bar_menu"]').count(); if(nm) console.log('nav menu',J(await menu('button_part_sale_nav_bar_menu'),500));
await p.screenshot({path:'ev/ps6.png'}); await s.close();
