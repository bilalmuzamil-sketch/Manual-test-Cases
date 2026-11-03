import {prod} from '../common.mjs'; import fs from 'fs'; const T=process.argv[2]; const s=await prod('/tmp/qa73'); const p=s.page; const out=[]; const ids={};
p.on('response',async r=>{ if(/work-orders-imported/.test(r.url())&&r.request().method()==='GET'){ try{ const t=await r.text(); for(const m of t.matchAll(/"id":"([0-9a-f-]{36})"[^}]{0,400}?"(?:invoice_number|number|invoiceNumber)":"(ZZ10133-[A-Z]+\d+)"/g)) ids[m[2]]=m[1]; }catch{} } });
await s.go('/workorders?status=imported'); await p.waitForTimeout(7000);
out.push('ids '+JSON.stringify(ids));
for(const inv of Object.keys(ids).filter(k=>k.endsWith(T)&&(process.env.ONLY?new RegExp(process.env.ONLY).test(k):true))){ await s.go('/imported-work-orders/'+ids[inv]); await p.waitForTimeout(5000); const t=await p.evaluate(()=>document.body.innerText.replace(/\s+/g,' ')); const m=t.match(/QA [a-zA-Z]+ (header )?title.{0,90}/); out.push(inv+' -> '+(m?m[0]:'NOT FOUND: '+t.slice(0,200))); await p.screenshot({path:`imported-${inv.replace(/\d+$/,'')}.png`}); }
fs.appendFileSync('imported.txt',out.join('\n')); console.log(out.join('\n')); await s.close(); process.exit(0);
