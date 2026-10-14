import {ob,J,post} from './lib.mjs'; import {loc} from './seed.mjs'; import fs from 'fs';
const A=JSON.parse(fs.readFileSync('A2.json')); const s=await ob(); const p=s.page; await loc(s);
await s.go('/parts/part-sale/'+A.ps_id+'/part-requests'); await p.waitForTimeout(3500);
if(!(await p.locator('[data-test-id="select_part"]').count())){ await p.locator('[data-test-id="button_add_part"]').click(); await p.waitForTimeout(1500);}
await p.locator('[data-test-id="select_part"]').click(); await p.keyboard.type('MD668D',{delay:60}); await p.waitForTimeout(2500);
const opts=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.replace(/\s+/g,' ').trim().slice(0,90)));
console.log('opts',J(opts,500));
const i=opts.findIndex(t=>/Inventory Qty/i.test(t)); await p.locator('.q-menu .q-item').nth(i).click(); await p.waitForTimeout(1500);
const bin=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="input_bin_quantity_"]')].map(e=>e.getAttribute('data-test-id')));
console.log('bins',bin); await p.locator(`[data-test-id="${bin[0]}"]`).fill('1'); await p.waitForTimeout(500);
const n=s.writes.length; await p.locator('[data-test-id="button_workorder_part_save"]').click(); await p.waitForTimeout(3000);
console.log('save',s.writes.slice(n).filter(x=>/work-orders|part/.test(x)).join(' || ').slice(0,400));
await p.screenshot({path:'ev/ps1.png'});
console.log('tids',J(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-test-id')+(e.disabled?'(dis)':'')).filter(t=>/action|pick|authoriz|part_request/.test(t))),600));
await s.close();
