import {start,mk,L,B} from './h.mjs';
const log=L('i13'); const b=await start('/administration/staff','admin'); const {page}=b; page.setDefaultTimeout(30000);
try{ await page.waitForTimeout(1500);
 const res=await page.evaluate(async()=>{const seen=new Set(['js/index.Ci7w97pr.js']); const q=['js/index.Ci7w97pr.js']; const out=[]; const keys=['which:"workOrder"','"Edit work order"','Edit Work Order','editWorkOrder']; 
  while(q.length){ const f=q.shift(); let t=''; try{t=await (await fetch(location.origin+'/'+f)).text();}catch(e){continue;} for(const m of (t.match(/(?:js\/)?[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]{8}\.js/g)||[])){ const p=m.startsWith('js/')?m:'js/'+m; if(!seen.has(p)){seen.add(p); q.push(p);} }
   for(const k of keys){ let i=-1,c=0; while((i=t.indexOf(k,i+1))>=0&&c<3){ out.push(f+' :: '+k+' :: '+t.slice(Math.max(0,i-220),i+200).replace(/\s+/g,' ')); c++; } } }
  out.push('SEEN '+seen.size); return out;});
 for(const r of res) log('HIT',r);
}catch(e){log('ERR',e.message.slice(0,300));}
await b.browser.close();
