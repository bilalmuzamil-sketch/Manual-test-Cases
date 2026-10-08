import {ob,j} from './lib.mjs'; import fs from 'fs';
const pre=process.argv[2]; const s=await ob({dpr:2,vp:{width:1600,height:900}}); const p=s.page; const R={};
await s.go('/parts/part-sales'); await p.waitForTimeout(2500);
R.row=await p.evaluate(n=>{const r=[...document.querySelectorAll('tr')].find(t=>t.innerText.includes(n));if(!r)return null;return [...r.querySelectorAll('td')].map(td=>{const b=td.getBoundingClientRect();return {t:td.innerText.trim(),html:td.innerHTML.slice(0,300),g:[b.x,b.y,b.width,b.height].map(Math.round)};});},'P10599-248');
console.log(j(R.row?.map(x=>[x.t,x.html.length]),800));
// hover status cell and parts cell
const tips=[]; for(const i of [1,6]){ const g=R.row[i].g; await p.mouse.move(g[0]+g[2]/2,g[1]+g[3]/2); await p.waitForTimeout(1500);
 tips.push(await p.evaluate(()=>[...document.querySelectorAll('.q-tooltip,[role=tooltip],.q-menu')].filter(e=>e.getBoundingClientRect().width>0).map(e=>e.innerText.trim().replace(/\n+/g,' | ')))); }
console.log('tips',j(tips)); console.log('status html',R.row[1].html);
await p.screenshot({path:`shots2/${pre}-pslist.png`});
fs.writeFileSync(`shots2/${pre}.json`,JSON.stringify(R,null,1));
await s.close();
