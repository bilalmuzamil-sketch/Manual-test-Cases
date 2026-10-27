import {sess} from './lib.mjs'; import fs from 'fs';
const s=await sess('admin',{vp:{width:1300,height:900},dpr:2}); const P=s.page; const out={};
await s.go('/parts/parts-catalogue'); await P.waitForTimeout(2500);
let b=await s.box('page_search_toggle'); out.toggle=b; await P.mouse.click(b.x,b.y); await P.waitForTimeout(800);
const inp=await P.evaluate(()=>{const a=document.activeElement; return a&&a.tagName==='INPUT'?{ph:a.placeholder,tid:a.dataset.testId}:null;}); console.log('focused input',JSON.stringify(inp));
await P.keyboard.type('QA-11669-FU-01',{delay:50}); await P.waitForTimeout(2500);
let rows=await P.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(r=>r.innerText.replace(/\s+/g,' ').trim()).filter(Boolean)); console.log('rows after typing',rows.length,JSON.stringify(rows.slice(0,3)));
if(!rows.some(r=>/FU-01/.test(r))){await P.keyboard.press('Enter'); await P.waitForTimeout(2500); rows=await P.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(r=>r.innerText.replace(/\s+/g,' ').trim()).filter(Boolean)); console.log('rows after Enter',rows.length,JSON.stringify(rows.slice(0,3)));}
await P.screenshot({path:'../ev/fu-search.png'});
const row=P.locator('tbody tr').filter({hasText:'QA-11669-FU-01'}).first(); if(await row.count()){ await row.click(); await P.waitForTimeout(3000); console.log('url',P.url()); const eb=await s.box('button_edit_catalogue_part'); console.log('edit icon',JSON.stringify(eb), await P.evaluate(()=>{const e=document.querySelector('[data-test-id="button_edit_catalogue_part"]'); return e?e.innerText:'';}));}
await s.browser.close(); process.exit(0);
