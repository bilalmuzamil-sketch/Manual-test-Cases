import {os,op,J,post} from './lib.mjs';
const s=await op(); const p=s.page; await post(s,'/api/iam/change-location',{workplace_id:'b617914c-16e9-4485-8e8b-193cd86aa416',workplace_timezone:'Africa/Accra'});
await s.go('/parts/history/'+process.argv[2]); await p.waitForTimeout(4000);
console.log(J(await p.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(r=>r.innerText.replace(/\s+/g,' ').slice(0,140)).filter(Boolean)),1500));
await p.screenshot({path:'ev/'+process.argv[3]+'.png'}); await s.close();
