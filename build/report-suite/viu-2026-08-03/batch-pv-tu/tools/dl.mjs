import { login, api, BASE } from './qa8582.mjs';
import fs from 'fs';
const OUT=process.env.OUT||'../evidence/pv/exports'; fs.mkdirSync(OUT,{recursive:true});
const [,,slug,name,qs,tmoStr]=process.argv;
const tmo=parseInt(tmoStr||'90000',10);
const t = await login('admin'); const S=t.sessCookie;
const UA='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36';
const url=`${BASE}/api/reporting/reports/${slug}/export?${qs}`;
const ac=new AbortController(); const timer=setTimeout(()=>ac.abort(),tmo);
const t0=Date.now();
let rec={name,slug,qs,tmo};
try{
  const r=await fetch(url,{signal:ac.signal,headers:{Cookie:S,'User-Agent':UA,Accept:'*/*',Origin:'https://sv8582.qa.shopview.com',Referer:'https://sv8582.qa.shopview.com/'}});
  const buf=Buffer.from(await r.arrayBuffer());
  rec={...rec,status:r.status,ct:r.headers.get('content-type'),cd:r.headers.get('content-disposition'),len:buf.length,ms:Date.now()-t0,
       reqid:r.headers.get('x-request-id')||r.headers.get('x-requestid')||null};
  if(r.status===200){const ext=(rec.ct||'').includes('pdf')?'pdf':((rec.ct||'').includes('csv')||(rec.cd||'').includes('.csv')?'csv':'bin');fs.writeFileSync(`${OUT}/${name}.${ext}`,buf);rec.file=`${name}.${ext}`;}
  else rec.body=buf.toString('utf8').slice(0,800);
}catch(e){ rec={...rec,status:'ABORT/ERR',err:String(e.name||e), ms:Date.now()-t0}; }
clearTimeout(timer);
console.log(JSON.stringify(rec));
fs.appendFileSync(`${OUT}/exports-log.jsonl`, JSON.stringify(rec)+'\n');
