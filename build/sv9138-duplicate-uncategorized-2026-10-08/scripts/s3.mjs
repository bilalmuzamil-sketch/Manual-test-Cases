import {ob,j} from './lib.mjs';
const s=await ob(); const p=s.page;
await s.go('/administration/inventory-import'); await p.waitForTimeout(2500);
await p.screenshot({path:'/tmp/qa9138/import-page.png'});
console.log(await p.evaluate(()=>document.querySelector('main, .q-page')?.innerText.slice(0,2500)));
console.log(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(t=>!/menu|nav|drawer|header/.test(t)).slice(0,60).join(' ')));
console.log(await p.evaluate(()=>[...document.querySelectorAll('a[href]')].map(a=>a.href).filter(h=>/csv|xlsx|template|sample/i.test(h))));
await s.close();
