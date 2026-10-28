// Customer with no contacts -> Part Sales -> New Part Sale -> Save; then on the part sale: Change Customer (and type a search).
// usage: node ps_change.mjs <branch|prod> <customerId>
import {open} from '../../testing-tools/qa-session.mjs'; import * as D from './detect.mjs'; import {click} from './scenarios.mjs'; import fs from 'fs';
const [env,cid]=process.argv.slice(2); const out=`/tmp/s10928/${env}-pschange`; fs.mkdirSync(out,{recursive:true});
const cookies=JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8'));
const s=await open({env,ticket:'10928',cookies,dir:(process.env.QA_DIR||'/tmp/qa24'),user:'bilal.muzamil@shopview.com'});
const ctl={ms:3500,maxShots:0}; await D.install(s,ctl); const p=s.page; const R={env};
const hl=async()=>(await D.hits(p)).map(h=>h.text.slice(0,60)+' @'+(h.path||'').slice(-60));
await s.go(`/customers/${cid}/part-sales`); await p.waitForTimeout(4000); await D.reset(p);
await click(s,'button_new_part_sale'); await p.waitForTimeout(3000);
R.newPS={hits:await hl(), customer:await p.evaluate(()=>document.querySelector('[data-test-id="select_customer"]')?.closest('.q-field')?.innerText.replace(/\s+/g,' ').trim())};
await p.screenshot({path:out+'/1-new-part-sale.png'});
const caps=[]; p.on('response',async r=>{ if(r.request().method()==='POST'&&/shopview\.com\/api\//.test(r.url())) caps.push(r.status()+' '+r.url().replace(/^https:\/\/[^/]+/,'')+' '+(await r.text().catch(()=>'')).slice(0,200)); });
R.saveDisabled=await p.evaluate(()=>{const e=document.querySelector('[data-test-id="button_save_part_sale"]'); return e?.disabled||e?.getAttribute('aria-disabled');});
await click(s,'button_save_part_sale'); await p.waitForTimeout(400); R.toasts=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' '))); await p.waitForTimeout(4500); R.posts=caps; R.afterSave=p.url().replace(s.host.app,'');
await p.screenshot({path:out+'/2-after-save.png'}); console.log(JSON.stringify(R));
if(/part-sale\//.test(R.afterSave)){ await D.reset(p);
  const tids=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(t=>/change|customer/i.test(t)));
  R.tids=tids; console.log('tids',tids.join(' '));
  try{ await click(s,'customer_card_change_action'); await p.waitForTimeout(3500);
    R.change={hits:await hl(), field:await p.evaluate(()=>{ const f=[...document.querySelectorAll('.q-dialog .q-field')].find(x=>/Customer/.test(x.querySelector('.q-field__label')?.innerText||'')); return f?f.innerText.replace(/\s+/g,' ').trim():null; })};
    await p.screenshot({path:out+'/3-change-customer.png'}); }catch(e){ R.change={err:e.message}; } }
console.log(JSON.stringify(R,null,1)); fs.writeFileSync(out+'/result.json',JSON.stringify(R,null,1)); await s.close();
