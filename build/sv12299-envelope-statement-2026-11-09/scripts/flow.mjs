// one page session: envelope send -> Create Invoice -> Charge Account -> envelope send (no reload)
import {sess,load,j} from './common.mjs'; import fs from 'fs';
const tag=process.argv[2]; const S=load(); const wo=S[process.argv[3]||'wo2']; const s=await sess(); const p=s.page; const out={tag,reqs:[]}; let pdfN=0;
p.on('response',async r=>{const q=r.request(); if(/invoices\/(estimate|preview)/.test(r.url())){try{const b=await r.body(); if(b.slice(0,4).toString()==='%PDF'){pdfN++; fs.writeFileSync(`/tmp/qa12299/${tag}-pdf${pdfN}.pdf`,b);}}catch(e){}}
 if(/\/api\//.test(r.url())&&!/6364962|recent/.test(r.url())&&(q.method()!=='GET'||/preview|estimate|statement/.test(r.url()))) out.reqs.push([new Date().toISOString().slice(11,19),q.method(),r.url().replace(/https:\/\/[^/]+/,'').slice(0,140),r.status()]);});
const send=async(n)=>{ await p.locator('[data-test-id="button_send_email"]').first().click(); await p.waitForTimeout(3500);
 out['dlg'+n]=await p.evaluate(()=>document.querySelector('.q-dialog')?.innerText.replace(/\s+/g,' ').slice(0,200));
 await p.locator('[data-test-id="input_email_content"]').fill(`ZZAUTOTEST SV12299 ${tag} send ${n}`); await p.screenshot({path:`/tmp/qa12299/${tag}-send${n}-dialog.png`});
 await p.locator('[data-test-id="button_send_email"]').last().click(); await p.waitForTimeout(7000);
 out['toast'+n]=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' ')));
 out.reqs.push(['--- send '+n+' done']); };
await s.go('/workorders/'+wo+'/finance'); await p.waitForTimeout(8000);
await send(1);
await p.locator('[data-test-id="button_create_invoice"]').first().click(); await p.waitForTimeout(6000);
out.payDlg=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>d.innerText.replace(/\s+/g,' ').slice(0,160)));
await p.locator('[data-test-id="button_charge_account"]').click(); await p.waitForTimeout(5000);
await p.screenshot({path:`/tmp/qa12299/${tag}-after-charge.png`});
await send(2);
await p.screenshot({path:`/tmp/qa12299/${tag}-end.png`});
fs.writeFileSync(`/tmp/qa12299/${tag}.json`,JSON.stringify(out,null,1)); console.log(j(out).slice(0,3000)); await s.close();
