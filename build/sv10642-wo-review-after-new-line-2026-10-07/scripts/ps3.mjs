import {ob,j} from './lib.mjs';
const s=await ob(); const p=s.page; await s.go('/parts/part-sales?status=estimate&status=approved');
const c=await p.evaluate(()=>{const r=[...document.querySelectorAll('tr')].find(t=>/Approved/.test(t.innerText));const x=r.querySelector('td:nth-child(2)')||r;const b=x.getBoundingClientRect();return {x:b.x+b.width/2,y:b.y+b.height/2,t:r.innerText.replace(/\s+/g,' ').slice(0,60)};});
console.log('row',j(c)); await p.mouse.click(c.x,c.y); await p.waitForTimeout(3500); console.log('url',p.url());
const btn=await p.evaluate(()=>[...document.querySelectorAll('button,[role=tab]')].filter(b=>b.getBoundingClientRect().width>0).map(b=>b.innerText.trim().replace(/\n/g,' ')).filter(Boolean).slice(0,40)); console.log('buttons',j(btn,900));
await s.shot('ps-detail','shots'); await s.close();
