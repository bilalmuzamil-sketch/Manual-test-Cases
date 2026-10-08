import {op} from './lib.mjs';
const s=await op({dpr:1}); const p=s.page;
await s.go('/administration/settings'); await p.waitForTimeout(3500);
console.log('tabs:',await p.evaluate(()=>[...document.querySelectorAll('.q-tab')].map(e=>e.innerText.trim().replace(/\s+/g,' ')).join(' / ')));
const t=p.locator('.q-tab').filter({hasText:/^\s*Invoice\s*$/}).first(); console.log('invtab',await t.count()); if(await t.count()){ await t.click(); await p.waitForTimeout(3000);} 
console.log(await p.evaluate(()=>{const l=[...document.querySelectorAll('*')].find(e=>!e.children.length&&/Legacy invoice layout/i.test(e.innerText||'')); if(!l) return 'none'; let n=l; for(let i=0;i<6&&n;i++){ if(n.querySelector('[aria-checked]')) break; n=n.parentElement;} return 'label="'+l.innerText+'" checked='+(n&&n.querySelector('[aria-checked]')?.getAttribute('aria-checked'))+' row="'+(n?n.innerText.replace(/\n/g,' '):'').slice(0,300)+'"';}));
console.log('save:',await p.evaluate(()=>[...document.querySelectorAll('button')].map(b=>b.innerText.trim()).filter(t=>/save/i.test(t)).join(' / ')));
await s.close();
