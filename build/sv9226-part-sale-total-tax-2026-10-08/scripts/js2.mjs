import {ob} from './lib.mjs';
const s=await ob(); const p=s.page; await s.go('/parts/returns'); await p.waitForTimeout(2500);
const t=await p.evaluate(async()=>await (await fetch('/js/ReturnRequests.BZ0DBnct.js')).text());
for(const k of ['Zt=']){ let i=t.indexOf(k); while(i>=0 && i<t.length){ const sn=t.slice(i,i+260); if(/=>|function|\(/.test(sn.slice(0,20))){ console.log('##',k, sn); break;} i=t.indexOf(k,i+1);} }
await s.close();
