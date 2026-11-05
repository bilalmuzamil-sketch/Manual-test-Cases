import {sess} from './common.mjs'; import fs from 'fs'; const s=await sess({dpr:1}); const p=s.page; await s.go('/schedule'); await p.waitForTimeout(5000);
for(let i=0;i<6;i++){ await p.locator('[data-test-id="sidebar_work_order_list"]').evaluate(e=>e.scrollTop=e.scrollHeight).catch(()=>{}); await p.waitForTimeout(800);} 
const cards=(await p.locator('[data-test-id="sidebar_work_order_card"]').allInnerTexts()).map(t=>t.split('\n').map(x=>x.trim()).filter(Boolean));
const big=cards.filter(a=>{const m=(a[1]||'').match(/ ([0-9.]+)h Est/); return m&&Number(m[1])>=12;}); console.log('cards',cards.length,'big',JSON.stringify(big.slice(0,5)));
await s.close(); process.exit(0);
