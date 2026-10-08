import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob(); const p=s.page; await s.go('/parts/returns'); await p.waitForTimeout(3000);
const r=await p.evaluate(async()=>{const urls=performance.getEntriesByType('resource').map(e=>e.name).filter(u=>u.endsWith('.js')&&u.includes('sv9667.qa')); const out=[]; for(const u of urls){ let t=''; try{ t=await (await fetch(u)).text(); }catch(e){continue;} let i=t.indexOf('menu_item_cancel_return'); if(i>=0) out.push({u,snip:t.slice(Math.max(0,i-1400),i+200)}); } return {n:urls.length,out};});
console.log('scripts',r.n,'hits',r.out.length); for(const h of r.out){ console.log('==',h.u); console.log(h.snip); }
await s.close();
