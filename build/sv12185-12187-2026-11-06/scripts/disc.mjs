import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess(); const p=s.page; await s.go('/customers'); await p.waitForTimeout(3000);
await p.click('[data-test-id=button_new_customer]'); await p.waitForTimeout(2000);
console.log(JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.getAttribute('data-test-id')+':'+e.tagName+':'+(e.innerText||'').slice(0,25).replace(/\n/g,' ')))));
await p.screenshot({path:'../ev/disc-newcust.png'}); await s.close(); process.exit(0);
