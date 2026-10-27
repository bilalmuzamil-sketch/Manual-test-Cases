import {sess} from './lib.mjs'; import fs from 'fs';
const s=await sess(); const W=JSON.parse(fs.readFileSync('../data/wo1.json')); const A=W.lines[0];
let r=await s.api('/api/auth/me/fe-permissions'); console.log('fe woMoveLabor',r.json.data.fe_permissions.includes('woMoveLabor'));
r=await s.api('/api/fe-permissions'); console.log('catalogue size',JSON.stringify(r.json).match(/"code"/g)?.length, /woMoveLabor/.test(JSON.stringify(r.json)));
console.log(JSON.stringify((await s.rows(W.wo)).map(l=>[l.line.trim(),l.tasks.map(x=>x.name+'/'+x.time)])));
await s.go(`/workorders/${W.wo}/lines`); await s.waitFor('line_number_'+A);
let b=await s.box('line_number_'+A); await s.page.mouse.click(b.x+250,b.y,{button:'right'}); await s.page.waitForTimeout(900);
console.log('menu',await s.page.evaluate(()=>[...document.querySelectorAll('.q-menu [data-test-id]')].map(e=>e.dataset.testId).join(' | ')));
await s.page.screenshot({path:'../ev/branch-2-context-menu-move-labor.png'});
b=await s.box('menu-item_move_labor'); if(b){await s.page.mouse.click(b.x,b.y); await s.page.waitForTimeout(1500);
 console.log('dialog',await s.page.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.dataset.testId+'«'+(e.innerText||'').trim().slice(0,40).replace(/\n/g,' ')+'»').join(' | ')));
 console.log('multiple?',await s.page.evaluate(()=>[...document.querySelectorAll('.q-dialog .q-select')].map(e=>e.className.includes('multiple')||!!e.querySelector('.q-chip'))));
 const sel=await s.page.evaluate(()=>{const e=document.querySelector('.q-dialog .q-select'); const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};}); await s.page.mouse.click(sel.x,sel.y); await s.page.waitForTimeout(1000);
 console.log('tech options',await s.page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.trim().replace(/\n/g,' ')).join(' | ')));
 await s.page.screenshot({path:'../ev/branch-3-move-dialog-options.png'});}
await s.browser.close(); process.exit(0);
