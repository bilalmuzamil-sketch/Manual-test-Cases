import {prod} from '../common.mjs'; import fs from 'fs'; const T=process.argv[2]; const s=await prod('/tmp/qa73'); const p=s.page; const out=[];
const r=(await s.api('/api/work-orders-imported?search=ZZ10133&limit=50')).json?.data; const c=r?.collection||r||[]; const mine=(Array.isArray(c)?c:[]).filter(x=>JSON.stringify(x).includes(T));
out.push('imported rows with tag '+T+': '+mine.length);
for(const x of mine){ const id=x.id; const v=(await s.api('/api/work-orders-imported/'+id)).json?.data; const j=JSON.stringify(v); const inv=(j.match(/ZZ10133-[A-Z]+\d+/)||[''])[0];
  const lines=(v?.lines||v?.work_order?.lines||v?.workOrderLines||[]); out.push(inv+' | '+JSON.stringify((Array.isArray(lines)?lines:[]).map(l=>[l.line_name||l.name||l.title,l.description])).slice(0,200)+' | raw:'+(Array.isArray(lines)&&lines.length?'':j.match(/"(line_name|name)":"QA[^"]*"|"description":"QA[^"]*"/g)?.join(' ')));
  if(/NEW/.test(inv)){ await s.go('/imported-work-orders/'+id); await p.waitForTimeout(5000); await p.screenshot({path:'imported-new.png'}); out.push('PAGE '+(await p.evaluate(()=>document.body.innerText.replace(/\s+/g,' ').match(/QA new header[^.]{0,120}/)?.[0]))); } }
await s.go('/workorders?status=imported'); await p.waitForTimeout(6000); out.push('LIST '+((await p.evaluate(()=>document.body.innerText)).match(/ZZ10133-[A-Z]+\d+/g)||[]).filter(x=>x.endsWith(T)).join(' ')); await p.screenshot({path:'imported-list.png'});
fs.writeFileSync('imported.txt',out.join('\n')); console.log(out.join('\n')); await s.close(); process.exit(0);
