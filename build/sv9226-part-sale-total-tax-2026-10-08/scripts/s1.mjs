import {ob,j} from './lib.mjs'; import fs from 'fs';
const L=JSON.parse(fs.readFileSync('ps-list.json')).data.partSales; const x=L.find(r=>r.status==='invoiced');
const s=await ob({dpr:1,vp:{width:1600,height:1000}}); const p=s.page; const api=[];
p.on('response',async r=>{try{const u=new URL(r.url()); if(u.pathname.startsWith('/api')&&r.request().method()==='GET'){const t=await r.text(); if(/total|grand/i.test(t)) api.push(u.pathname+u.search.slice(0,40)+' :: '+t.slice(0,250));}}catch(e){}});
await s.go(`/parts/part-sale/${x.id}/part-requests`); await p.waitForTimeout(3000);
const txt=await p.evaluate(()=>document.body.innerText); const i=txt.indexOf('Financial'); console.log(x.number,x.totalPrice,'\n',txt.slice(Math.max(0,i-50),i+700));
console.log(api.join('\n').slice(0,2500));
await p.screenshot({path:'/tmp/qa9226/ps-page.png'});
await s.close();
