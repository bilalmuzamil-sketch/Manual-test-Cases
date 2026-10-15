// usage: node VL.mjs <branch|prod> <tag> : list order with no sort, 4 pages, continuity + where the ZZ vendors sit
import {ob,op,J,post} from './lib.mjs'; import fs from 'fs';
const [env,tag]=process.argv.slice(2); const s=env==='prod'?await op():await ob(); const p=s.page;
await post(s,'/api/iam/change-location',env==='prod'?{workplace_id:'b617914c-16e9-4485-8e8b-193cd86aa416',workplace_timezone:'Africa/Accra'}:{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'});
const pref=(await s.api('/api/users/me/preferences/parts-vendors')).json; console.log('saved preference',J(pref,300));
const pages=[]; for(let pg=1;pg<=4;pg++){ const d=(await s.api(`/api/parts-catalogue/vendors?pagination%5Bpage%5D=${pg}&pagination%5BrowsPerPage%5D=30&pagination%5BsortBy%5D=&pagination%5Bdescending%5D=false&search=`)).json?.data; pages.push((d?.collection||d?.vendors||[]).map(v=>v.name)); if(pg===1) console.log('keys',J(Object.keys(d||{}))); }
const all=pages.flat(); const cmp=(a,b)=>a.localeCompare(b,undefined,{sensitivity:'base'});
const sortedIdx=all.findIndex((n,i)=>i>0&&cmp(all[i-1],n)>0); const dupes=all.length-new Set(all).size;
console.log(tag,'| rows',pages.map(x=>x.length),'| first of each page',J(pages.map(x=>x[0]),300),'| last of each page',J(pages.map(x=>x[x.length-1]),300),'| first out-of-order index',sortedIdx,sortedIdx>0?J([all[sortedIdx-1],all[sortedIdx]]):'','| repeated names',dupes);
await s.go('/parts/vendors'); await p.waitForTimeout(4000); const ui=await p.evaluate(()=>[...document.querySelectorAll('tbody tr')].filter(r=>r.offsetParent&&r.innerText.trim()).slice(0,8).map(r=>r.innerText.split('\n')[0].trim())); console.log('screen first rows',J(ui,500));
await p.screenshot({path:`ev/${tag}-list.png`}); fs.writeFileSync(`vl-${tag}.json`,JSON.stringify({pref,pages,ui},null,1)); await s.close();
