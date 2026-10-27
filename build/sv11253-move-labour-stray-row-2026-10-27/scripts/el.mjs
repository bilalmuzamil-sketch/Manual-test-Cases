import {sess} from './lib.mjs'; import fs from 'fs';
const D=JSON.parse(fs.readFileSync('../data/v1.json')); const s=await sess(); const L=D.lines[1];
await s.go(`/workorders/${D.wo}/lines`); await s.waitFor('line_number_'+L); await s.page.waitForTimeout(800);
let b=await s.box('line_number_'+L); await s.page.mouse.click(b.x+250,b.y,{button:'right'}); await s.page.waitForTimeout(800);
b=await s.box('menu-item_edit_labor'); await s.page.mouse.click(b.x,b.y); await s.waitFor('select_technician'); await s.page.waitForTimeout(800);
console.log('dialog',await s.page.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.dataset.testId+'«'+(e.innerText||'').trim().slice(0,30).replace(/\n/g,' ')+'»').join(' | ')));
b=await s.box('select_technician'); await s.page.mouse.click(b.x,b.y); await s.page.waitForTimeout(1000);
await s.page.keyboard.type('David',{delay:60}); await s.page.waitForTimeout(1200);
console.log('filtered',await s.page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.trim().replace(/\n/g,' ')).join(' | ')));
await s.page.locator('.q-menu .q-item').filter({hasText:'David Combs'}).first().click(); await s.page.waitForTimeout(800);
await s.page.screenshot({path:'/tmp/qa21/el1.png'});
// close the option list by clicking the dialog title, not Escape
b=await s.box('dialog_title'); await s.page.mouse.click(b.x,b.y); await s.page.waitForTimeout(500);
console.log('dialog open?',await s.page.evaluate(()=>!!document.querySelector('.q-dialog')), 'chips',await s.page.evaluate(()=>document.querySelector('[data-test-id="select_technician"]')?.innerText.replace(/\n/g,' ')));
b=await s.box('button_save_labour'); console.log('save box',!!b); await s.page.mouse.click(b.x,b.y); await s.page.waitForTimeout(3000);
console.log(s.writes.map(w=>w.slice(0,250)).join('\n'));
console.log(JSON.stringify((await s.rows(D.wo)).map(l=>[l.line.trim(),l.tasks.map(x=>x.name)])));
await s.browser.close(); process.exit(0);
