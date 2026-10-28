// reverses, ON SCREEN, the payment whose row text contains <match> (Payments tab -> bin icon -> every confirmation)
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env,tag,match]=process.argv.slice(2); const S=JSON.parse(fs.readFileSync(`/tmp/s11744/seed-${env}-${tag}.json`,'utf8'));
const cookies=JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8'));
const s=await open({env,ticket:'11744',cookies,dir:(process.env.QA_DIR||'/tmp/qa23'),user:'bilal.muzamil@shopview.com'}); const p=s.page;
const dir=`/tmp/s11744/${env}-${tag}`; fs.mkdirSync(dir,{recursive:true});
const caps=[]; p.on('response',async r=>{ if(r.request().method()!=='GET'&&/shopview\.com\/api\//.test(r.url())&&!/recent-entities/.test(r.url())) caps.push(r.request().method()+' '+r.status()+' '+r.url().replace(/^https:\/\/[^/]+/,'')+' :: '+(r.request().postData()||'').slice(0,300)); });
await s.go(`/customers/${S.cid}/payments`); await p.waitForTimeout(3000);
const tid=await p.evaluate(m=>{ const tr=[...document.querySelectorAll('[data-test-id="table_transactions_payment"] tbody tr')].find(t=>(t.innerText||'').replace(/\s+/g,' ').includes(m)); return tr?.querySelector('[data-test-id^="button_remove_payment_"]')?.getAttribute('data-test-id'); },match);
console.log('remove button',tid); if(!tid){ await s.close(); process.exit(1); }
await p.evaluate(t=>document.querySelector(`[data-test-id="${t}"]`).scrollIntoView({block:'center'}),tid);
const tip=await s.hoverTip(tid); console.log('tooltip',JSON.stringify(tip.tips.map(t=>t.text)));
await p.screenshot({path:`${dir}/reverse-0-hover.png`});
const c=await s.confirm(tid,{shotPrefix:`${dir}/reverse`}); console.log('confirm steps',JSON.stringify(c.steps));
await p.waitForTimeout(3000); console.log('requests:\n'+caps.join('\n'));
const toasts=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' '))); console.log('toasts',JSON.stringify(toasts));
await s.close();
