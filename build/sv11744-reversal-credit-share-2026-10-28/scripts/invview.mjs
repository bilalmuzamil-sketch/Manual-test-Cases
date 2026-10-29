// What each INVOICE ITSELF shows: Finance tab on screen (payments lines, Balance) + the invoice document's payment lines.
// usage: node invview.mjs <env> <tag> <label>
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env,tag,label]=process.argv.slice(2); const S=JSON.parse(fs.readFileSync(`/tmp/s11744/seed-${env}-${tag}.json`,'utf8'));
const cookies=JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8'));
const s=await open({env,ticket:'11744',cookies,dir:(process.env.QA_DIR||'/tmp/qa23'),user:'bilal.muzamil@shopview.com',vp:{width:1440,height:1100}}); const p=s.page;
const dir=`/tmp/s11744/${env}-${tag}`; fs.mkdirSync(dir,{recursive:true}); const out={label,wos:[]};
for(const [i,w] of S.wos.entries()){
  await s.go(`/workorders/${w.wo}/finance`); await p.waitForTimeout(5000);
  const txt=await p.evaluate(()=>(document.querySelector('main, .q-page')?.innerText||'').replace(/\s+/g,' '));
  const pay=(txt.match(/.{0,40}(Payments?|Deposit|Credit|Cash|Balance|Total).{0,90}/g)||[]).slice(0,14);
  const invId=w.inv?.data?.invoice_id||w.inv?.data?.id;
  let doc=null; if(invId){ const r=await s.api(`/api/invoices/preview?invoice_id=${invId}`); const h=(r.text||JSON.stringify(r.json)||'').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' '); doc={status:r.status,lines:(h.match(/.{0,30}(\(Deposit\)|Credit|Cash|Payment|Balance|Total).{0,70}/g)||[]).slice(0,12)}; }
  // Arithmetic check: every payment line listed + Balance must equal Total. A split payment printing its full amount breaks this.
  const m=txt.match(/Total \$([\d,]+\.\d\d) Payments (.*?) Balance \$([\d,.-]+)/); let sum=null;
  if(m){ const tot=+m[1].replace(/,/g,''); const lines=[...m[2].matchAll(/\$([\d,]+\.\d\d)/g)].map(x=>+x[1].replace(/,/g,'')); const bal=+m[3].replace(/,/g,''); const got=Math.round((lines.reduce((a,b)=>a+b,0)+bal)*100)/100; sum={total:tot,lines,balance:bal,linesPlusBalance:got,ok:Math.abs(got-tot)<0.005}; console.log(` SUM CHECK WO${i+1}:`,sum.ok?'OK':'MISMATCH',JSON.stringify(sum)); }
  await p.screenshot({path:`${dir}/${label}-inv${i+1}-finance.png`,fullPage:true});
  out.wos.push({wo:w.wo,invId,screen:pay,doc,sum}); console.log(`== WO${i+1}`,w.wo,'\n screen:',pay.join(' ‖ ').slice(0,900),'\n doc:',JSON.stringify(doc).slice(0,900));
}
fs.writeFileSync(`${dir}/${label}-invview.json`,JSON.stringify(out,null,1)); await s.close(); process.exit(0);
