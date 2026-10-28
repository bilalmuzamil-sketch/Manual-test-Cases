// reads what the user sees: Invoices tab (Open only OFF and ON), Payments tab, each work order's status badge; screenshots
// usage: node state.mjs <env> <tag> <label>
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env,tag,label]=process.argv.slice(2); const S=JSON.parse(fs.readFileSync(`/tmp/s11744/seed-${env}-${tag}.json`,'utf8'));
const cookies=JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8'));
const s=await open({env,ticket:'11744',cookies,dir:(process.env.QA_DIR||'/tmp/qa23'),user:'bilal.muzamil@shopview.com'}); const p=s.page;
const dir=`/tmp/s11744/${env}-${tag}`; fs.mkdirSync(dir,{recursive:true}); const out={label};
const rows=sel=>p.evaluate(sl=>[...document.querySelectorAll(sl+' tbody tr')].map(tr=>(tr.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean),sel);
await s.go(`/customers/${S.cid}/invoices`); await p.waitForTimeout(3000);
const tog=async want=>{ const on=await p.evaluate(()=>{const e=document.querySelector('[data-test-id="toggle_filter_open_invoices"]'); return e?.getAttribute('aria-checked');}); if(String(on)!==String(want)){ const b=await p.evaluate(()=>{const r=document.querySelector('[data-test-id="toggle_filter_open_invoices"]').getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};}); await p.mouse.click(b.x,b.y); await p.waitForTimeout(2000);} };
await tog('false'); out.invoicesAll=await rows('[data-test-id="table-unpaid-transactions"]'); out.balance=await p.evaluate(()=>document.querySelector('[data-test-id="table-unpaid-transactions"]')?.innerText.match(/Balance:\s*[-$0-9.,]+/)?.[0]);
await p.screenshot({path:`${dir}/${label}-invoices-all.png`});
await tog('true'); out.invoicesOpen=await rows('[data-test-id="table-unpaid-transactions"]'); await p.screenshot({path:`${dir}/${label}-invoices-open.png`});
await s.go(`/customers/${S.cid}/payments`); await p.waitForTimeout(2500);
for(const h of await p.$$('[data-test-id^="button_toggle_payment_expansion_"]')){ await h.click().catch(()=>{}); await p.waitForTimeout(500); }
out.payments=await rows('[data-test-id="table_transactions_payment"]'); await p.screenshot({path:`${dir}/${label}-payments.png`,fullPage:true});
out.wos=[]; for(const w of S.wos){ await s.go(`/workorders/${w.wo}/finance`); await p.waitForTimeout(2500);
  out.wos.push(await p.evaluate(()=>({no:document.querySelector('[data-test-id="text_wo_number"]')?.innerText,status:document.querySelector('[data-test-id="badge_wo_status"]')?.innerText}))); }
const acct=S.wos[0].inv.data.customer_account_id;
const cm=await s.api(`/api/customer-account/list-unpaid-transaction?accountId=${acct}&pagination%5BrowsPerPage%5D=1000`);
out.api=(cm.json?.data?.response?.collection||[]).map(t=>`${t.type} ${t.invoice_display_number||t.credit_display_number} amount ${t.amount} balance ${t.balance} ${t.status}`);
console.log(JSON.stringify(out,null,1)); fs.writeFileSync(`${dir}/${label}.json`,JSON.stringify(out,null,1)); await s.close();
