import {ob,j} from './lib.mjs'; import fs from 'fs';
const {num}=JSON.parse(fs.readFileSync('y.json')); const s=await ob({dpr:2,vp:{width:1900,height:1000}}); const p=s.page;
await s.go('/parts/returns'); await p.waitForTimeout(3500);
const r=await p.evaluate(n=>{const tr=[...document.querySelectorAll('tbody tr')].find(t=>t.innerText.includes(n)); const td=tr.querySelectorAll('td')[1]; const g=td.getBoundingClientRect(); return {x:g.x+g.width/2,y:g.y+g.height/2,links:[...tr.querySelectorAll('a')].map(a=>a.getAttribute('href'))};},num);
console.log(j(r)); await p.mouse.click(r.x,r.y); await p.waitForTimeout(3000);
console.log('url',p.url()); console.log('page',(await p.evaluate(()=>document.querySelector('.q-page')?.innerText||'')).replace(/\n+/g,' | ').slice(0,900));
console.log(await p.evaluate(()=>[...document.querySelectorAll('.q-page button')].filter(b=>b.getBoundingClientRect().width>0).map(b=>b.innerText.trim()+'['+(b.getAttribute('data-test-id')||'')+']').join(' ')));
await p.screenshot({path:'/tmp/qa9226/return-detail.png'});
await s.close();
