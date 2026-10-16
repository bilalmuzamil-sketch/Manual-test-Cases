import {session} from './rec.mjs';
const s=await session({vp:{width:1600,height:900}}); const p=s.page;
await s.go('/workorders?search=S2-33351'); await p.waitForTimeout(5000);
console.log(p.url(), await p.evaluate(()=>[...document.querySelectorAll('input')].map(i=>i.value).filter(Boolean).join('|')), await p.evaluate(()=>document.body.innerText.includes('S2-33351')));
await s.close();
