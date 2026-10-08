import {op} from './lib.mjs';
const s=await op({dpr:1}); const p=s.page;
await s.go('/workorders'); await p.waitForTimeout(2000);
let b=await s.box('profile_menu_button'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(1200);
console.log('menu:',await p.evaluate(()=>[...document.querySelectorAll('.q-menu [data-test-id]')].map(e=>e.getAttribute('data-test-id')+'='+e.innerText.trim().replace(/\s+/g,' ')).join(' / ')));
b=await s.box('profile_menu_settings'); if(b){ await p.mouse.click(b.x,b.y); await p.waitForTimeout(3500);} 
console.log('url',p.url());
console.log('tabs:',await p.evaluate(()=>[...document.querySelectorAll('.q-tab,[role=tab]')].map(e=>e.innerText.trim()).join(' / ')));
const t=p.locator('.q-tab,[role=tab]').filter({hasText:/^Invoice/}).first(); if(await t.count()){ await t.click(); await p.waitForTimeout(2500);} 
console.log('url2',p.url());
console.log('legacy row:',await p.evaluate(()=>{const l=[...document.querySelectorAll('*')].find(e=>!e.children.length&&/Legacy invoice layout/i.test(e.innerText||'')); if(!l) return 'none'; const r=l.closest('.row')||l.parentElement; const cb=r.querySelector('[role=switch],input[type=checkbox],.q-toggle'); return l.innerText+' | toggle aria-checked='+(r.querySelector('[aria-checked]')?.getAttribute('aria-checked'))+' | row: '+r.innerText.replace(/\n/g,' ').slice(0,200);}));
console.log('save:',await p.evaluate(()=>[...document.querySelectorAll('button')].map(b=>b.innerText.trim()).filter(t=>/save/i.test(t)).join(' / ')));
await s.close();
