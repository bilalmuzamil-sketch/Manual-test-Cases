// "Manual return belongs to a different vendor" ON SCREEN with two tabs.
// Tab A: Parts → Returns → tick manual returns M1+M2 (same vendor) → Receive Credit (combined page), credit memo # filled, not posted.
// Tab B: the single Receive Credit page for M2 → Vendor changed to another → Post Credit with a credit memo # already used
//        (the vendor update saves, the credit is refused, so M2 stays open with the new vendor). Tab A → Post Credit → pop-up.
// Usage: node mr2tab.mjs <env> <M1> <M2> <usedCreditMemoNo> [otherVendorText]
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env,M1,M2,used,ov]=process.argv.slice(2); const LOC='b617914c-16e9-4485-8e8b-193cd86aa416'; const out=`ev/messages/${env}-mr2tab`; fs.mkdirSync(out,{recursive:true});
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa28'),user:'bilal.muzamil@shopview.com',vp:{width:1440,height:900}});
const A=s.page; if(env==='prod'){ await s.go('/workorders'); await A.evaluate(L=>localStorage.setItem('location',JSON.stringify(L)),LOC); }
const toast=pg=>pg.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' ')));
const val=(pg,t)=>pg.evaluate(t=>{const e=document.querySelector(`[data-test-id="${t}"]`); const f=e&&(e.closest('.q-field')||e); return f?f.innerText.replace(/\s+/g,' ').replace('arrow_drop_down','').trim():null;},t);
const fill=async(pg,t,v)=>{ const l=pg.locator(`[data-test-id="${t}"]`).first(); await ((await l.evaluate(e=>e.tagName))==='INPUT'?l:l.locator('input')).fill(v); await pg.waitForTimeout(400); };
const W=[]; s.ctx.on('response',async r=>{ if(r.request().method()==='POST'&&/\/api\/(part\/manual|inventory\/returns|returns)/.test(r.url())) W.push(r.status()+' '+r.url().replace(/^https:\/\/[^/]+/,'')+' '+(r.request().postData()||'').slice(0,200)+' => '+(await r.text().catch(()=>'')).slice(0,300)); });
await A.goto(s.host.app+`/parts/confirm-return?manualIds=${M1}&manualIds=${M2}&isManualReturn=0`,{waitUntil:'domcontentloaded'}); await A.waitForTimeout(6000);
await fill(A,'input_credit_memo_number','ZZCMA'+Date.now()%100000); console.log('tab A vendor',await val(A,'select_vendor')); await A.screenshot({path:out+'/1-tabA-before.png'});
const B=await s.ctx.newPage(); await B.setViewportSize({width:1440,height:900});
await B.goto(s.host.app+`/parts/confirm-return?id=${M2}&isManualReturn=1`,{waitUntil:'domcontentloaded'}); await B.waitForTimeout(6000);
await B.locator('[data-test-id="select_vendor"]').click(); await B.waitForTimeout(800); if(ov){ await B.keyboard.type(ov,{delay:40}); await B.waitForTimeout(2500); }
const cur=await val(B,'select_vendor'); const opts=await B.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.replace(/\s+/g,' ').replace('check','').trim()));
await B.locator('.q-menu .q-item').nth(opts.findIndex(o=>o&&!cur.includes(o)&&!/No results/.test(o))).click(); await B.waitForTimeout(1200);
console.log('tab B vendor now',await val(B,'select_vendor')); await fill(B,'input_credit_memo_number',used);
await B.locator('[data-test-id="button_post_credit"]').click(); await B.waitForTimeout(4000); console.log('tab B pop-up',JSON.stringify(await toast(B))); await B.screenshot({path:out+'/2-tabB.png'});
await A.bringToFront(); await A.locator('[data-test-id="button_post_credit"]').click(); await A.waitForTimeout(1800);
const t=await toast(A); console.log('TAB A POP-UP',JSON.stringify(t)); await A.screenshot({path:out+'/3-tabA-popup.png'});
console.log('requests\n'+W.join('\n'));
fs.writeFileSync(out+'/result.json',JSON.stringify({env,M1,M2,popup:t,requests:W},null,1));
await s.close(); process.exit(0);
