import {os,J,post} from './lib.mjs';
const s=await os(); const p=s.page; await post(s,'/api/iam/change-location',{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'});
await s.go('/parts/history/'+process.argv[2]); await p.waitForTimeout(4000);
const rows=await p.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(r=>{const b=r.getBoundingClientRect();return [r.innerText.replace(/\s+/g,' ').slice(0,90),[b.x,b.y,b.x+b.width,b.y+b.height].map(Math.round)]}).filter(x=>x[0])); console.log(JSON.stringify(rows)); (await import('fs')).writeFileSync('geo-'+process.argv[3]+'.json',JSON.stringify(rows));
await p.screenshot({path:'ev/'+process.argv[3]+'.png'}); await s.close();
