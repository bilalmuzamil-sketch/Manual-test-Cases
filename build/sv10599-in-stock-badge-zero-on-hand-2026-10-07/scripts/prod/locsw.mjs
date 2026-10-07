import {op,j} from '../lib.mjs'; const s=await op({dpr:2}); const p=s.page;
await s.go('/workorders'); await p.waitForTimeout(1500);
const pm=await s.box('profile_menu_button'); console.log('profile btn',j(pm), await p.evaluate(()=>document.querySelector('[data-test-id="profile_menu_button"]')?.innerText.replace(/\n/g,' | ')));
await s.shot('PL0','prod');
await p.mouse.click(pm.x,pm.y); await p.waitForTimeout(1500);
const items=await p.evaluate(()=>[...document.querySelectorAll('.q-menu *')].filter(e=>e.childElementCount===0&&e.innerText&&e.innerText.trim()).map(e=>{const r=e.getBoundingClientRect();return {t:e.innerText.trim(),tid:e.closest('[data-test-id]')?.getAttribute('data-test-id'),g:[r.x,r.y,r.width,r.height].map(Math.round)};}));
console.log('menu',j(items,1500)); await s.shot('PL1-menu','prod');
const th=items.find(i=>/Trucks Hill 2/.test(i.t)); if(th){ await p.mouse.click(th.g[0]+th.g[2]/2,th.g[1]+th.g[3]/2); await p.waitForTimeout(2500);
 const sub=await p.evaluate(()=>[...document.querySelectorAll('.q-menu *,.q-dialog *')].filter(e=>e.childElementCount===0&&e.innerText&&e.innerText.trim()&&e.getBoundingClientRect().width>0).map(e=>e.innerText.trim()).slice(0,30)); console.log('after click',j(sub,800));
 console.log('now',await p.evaluate(()=>document.querySelector('[data-test-id="profile_menu_button"]')?.innerText.replace(/\n/g,' | '))); await s.shot('PL2','prod'); }
await s.close();
