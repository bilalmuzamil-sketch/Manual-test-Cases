import {sess} from './lib.mjs';
const s=await sess(); const P=s.page;
await s.go('/parts/parts-catalogue'); await P.waitForTimeout(2500);
let b=await s.box('button_new_catalog_part'); await P.mouse.click(b.x,b.y); await s.waitFor('select_catalogue_part_manufacturer');
const m=P.locator('input[data-test-id="select_catalogue_part_manufacturer"]'); await m.click(); await P.waitForTimeout(800);
console.log('open list first items',JSON.stringify(await P.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.trim()).slice(0,4))));
await P.keyboard.type('Accuride',{delay:80});
for(const w of [500,1500,3000]){await P.waitForTimeout(w); console.log('after',w,JSON.stringify(await P.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item, .q-menu')].map(e=>e.innerText.trim().replace(/\n/g,' ')).slice(0,4))));}
await P.keyboard.type('X'); await P.keyboard.press('Backspace'); await P.waitForTimeout(1500); console.log('after retype',JSON.stringify(await P.evaluate(()=>[...document.querySelectorAll('.q-menu')].map(e=>e.innerText.trim().replace(/\n/g,' ')))));
await P.keyboard.type('Napa'.slice(0,0));
// typing an existing one for comparison
await m.fill(''); await P.keyboard.type('Hald',{delay:80}); await P.waitForTimeout(1500); console.log('partial new name',JSON.stringify(await P.evaluate(()=>[...document.querySelectorAll('.q-menu')].map(e=>e.innerText.trim().replace(/\n/g,' ')))));
await m.fill(''); await P.keyboard.type('Napa',{delay:80}); await P.waitForTimeout(1500); console.log('existing name',JSON.stringify(await P.evaluate(()=>[...document.querySelectorAll('.q-menu')].map(e=>e.innerText.trim().replace(/\n/g,' ')))));
await m.fill(''); await P.keyboard.type('Accuride',{delay:80}); await P.waitForTimeout(1200); await P.keyboard.press('Enter'); await P.waitForTimeout(1200);
console.log('after Enter field',await P.evaluate(()=>{const i=document.querySelector('[data-test-id="select_catalogue_part_manufacturer"]'); return i.closest('.q-field').innerText.replace(/\n/g,' | ')+' || input='+i.value;}), 'dialog open',await P.evaluate(()=>!!document.querySelector('.q-dialog')));
await P.screenshot({path:'../ev/d2-after-enter.png'});
await s.browser.close(); process.exit(0);
