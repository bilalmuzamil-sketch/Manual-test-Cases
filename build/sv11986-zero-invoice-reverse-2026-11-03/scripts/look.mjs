// usage: ENV node look.mjs <woId> <customerId>  -> dump reverse controls on Finance tab (+ kebab) and delete controls on Payments tab rows
import {sess} from './common.mjs'; const [WO,CID]=process.argv.slice(2); const s=await sess(); const p=s.page;
const ids=()=>p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-test-id')+':'+e.innerText.trim().replace(/\s+/g,' ').slice(0,40)));
await s.go(`/workorders/${WO}/finance`); await p.waitForTimeout(7000);
console.log('FIN', (await ids()).filter(x=>/revers|invoice|kebab|menu|more|paid|status/i.test(x)).join(' || ').slice(0,1500));
console.log('TEXT', (await p.evaluate(()=>document.body.innerText.match(/(Paid|Reverse[^\n]*|Pending|Unpaid)/g)))?.slice(0,10));
const k=p.locator('[data-test-id*="kebab"], [data-test-id*="more"], button:has-text("more_vert")').first(); if(await k.count()){ await k.click(); await p.waitForTimeout(1000); console.log('MENU',(await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(i=>(i.getAttribute('data-test-id')||'')+':'+i.innerText.trim()))).join(' || ')); await p.keyboard.press('Escape'); }
await s.go(`/customers/${CID}/payments`); await p.waitForTimeout(6000);
console.log('PAY', await p.evaluate(()=>{const tr=[...document.querySelectorAll('tbody tr')].find(t=>/\$0\.00/.test(t.innerText)); return tr?[...tr.querySelectorAll('[data-test-id],button,i')].map(e=>(e.getAttribute('data-test-id')||e.tagName)+':'+e.innerText.trim().slice(0,20)).join(' || '):'no row';}));
await s.close(); process.exit(0);
