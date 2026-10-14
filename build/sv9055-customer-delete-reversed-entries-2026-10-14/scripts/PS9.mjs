import {ob,J} from './lib.mjs'; import {loc} from './seed.mjs'; import fs from 'fs';
const A=JSON.parse(fs.readFileSync('A2.json')); const s=await ob(); const p=s.page; await loc(s);
await s.go('/parts/part-sale/'+A.ps_id+'/part-requests'); await p.waitForTimeout(3500);
if(await p.locator('.q-dialog [data-test-id="button_close_dialog"]').count()){ await p.locator('.q-dialog [data-test-id="button_close_dialog"]').click(); await p.waitForTimeout(1000); }
let n=s.writes.length; await p.locator('[data-test-id^="button_return_part_request_"]').first().click(); await p.waitForTimeout(2000);
console.log('dlg',J(await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>d.innerText.replace(/\s+/g,' ').slice(0,300))),400));
const b=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog button, .q-dialog [data-test-id]')].map(e=>(e.getAttribute('data-test-id')||'-')+'|'+e.innerText.trim().slice(0,25)));
console.log('btns',J(b,600));
await p.screenshot({path:'ev/ps9.png'}); await s.close();
