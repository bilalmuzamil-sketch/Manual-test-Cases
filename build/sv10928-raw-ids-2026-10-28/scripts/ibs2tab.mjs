// "IBS Account Number is not configured for customer" ON SCREEN with two tabs.
// Set-up on screen: Settings → IBS → Location ID Mappings → the location gets an IBS Location ID.
// Tab A: work order Finance tab (IBS customer) → Request IBS Approval dialog open. Tab B: customer → edit → IBS field cleared → Save.
// Tab A: Request Approval → pop-up. Then puts the customer's IBS number and the location mapping back (read back to prove it).
// Usage: node ibs2tab.mjs <env> <customerName> <workOrderOrPartSaleId> <workplaceId>
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env,cname,wo,wp]=process.argv.slice(2); const LOC='b617914c-16e9-4485-8e8b-193cd86aa416'; const H=env==='prod'?{headers:{'x-location-id':LOC}}:{};
const out=`ev/messages/${env}-ibs2tab`; fs.mkdirSync(out,{recursive:true});
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa28'),user:'bilal.muzamil@shopview.com',vp:{width:1440,height:900}});
const A=s.page; if(env==='prod'){ await s.go('/workorders'); await A.evaluate(L=>localStorage.setItem('location',JSON.stringify(L)),LOC); }
const inp=async(pg,t)=>{ const l=pg.locator(`[data-test-id="${t}"]`).first(); return (await l.evaluate(e=>e.tagName))==='INPUT'?l:l.locator('input'); };
const toast=pg=>pg.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' ')));
const mapping=async()=>((await s.api('/api/ibs/settings/workplace-mappings',H)).json?.data?.collection||[]).find(m=>m.workplaceId===wp)?.ibsLocationId??null;
const cust=async()=>((await s.api('/api/customers?limit=5&search='+encodeURIComponent(cname),H)).json?.data?.collection||[]).find(x=>x.name===cname);
const before={mapping:await mapping(), ibs:(await cust())?.ibs}; console.log('before',JSON.stringify(before)); const cid=(await cust()).id;
const setMapping=async v=>{ await s.go('/administration/ibs'); await A.waitForTimeout(5000); await A.locator('[data-test-id="ibs_workplace_edit_button"]').click(); await A.waitForTimeout(1200);
  await (await inp(A,`ibs_location_id_input_${wp}`)).fill(v); await A.waitForTimeout(400); await A.locator('[data-test-id="ibs_workplace_save_button"]').click(); await A.waitForTimeout(3000); console.log('mapping now',JSON.stringify(await mapping()),JSON.stringify(await toast(A))); };
const setIbs=async(pg,v)=>{ await pg.goto(s.host.app+`/customers/${cid}/work-orders`,{waitUntil:'domcontentloaded'}); await pg.waitForTimeout(5000); await pg.locator('[data-test-id="button_base"]').first().click(); await pg.waitForTimeout(2000);
  await (await inp(pg,'input_customer_ibs')).fill(v); await pg.waitForTimeout(400); await pg.locator('[data-test-id="button_save_customer"]').click(); await pg.waitForTimeout(3000); console.log('customer IBS now',JSON.stringify((await cust())?.ibs)); };
await setMapping('ZZ10928');
const path=env==='branch'&&process.env.PS?`/parts/part-sale/${wo}/finance`:`/workorders/${wo}/finance`;
await A.goto(s.host.app+path,{waitUntil:'domcontentloaded'}); await A.waitForTimeout(8000);
await A.locator('[data-test-id="button_request_ibs_approval"]').click(); await A.waitForTimeout(3000); console.log('tab A dialog',JSON.stringify(await A.evaluate(()=>document.querySelector('.q-dialog')?.innerText.replace(/\s+/g,' ').slice(0,300))));
await A.screenshot({path:out+'/1-tabA-dialog.png'});
const B=await s.ctx.newPage(); await B.setViewportSize({width:1440,height:900}); await setIbs(B,''); await B.screenshot({path:out+'/2-tabB-cleared.png'}); await B.close();
await A.bringToFront(); const W=[]; A.on('response',async r=>{ if(/requestIBSApproval/.test(r.url())) W.push(r.status()+' '+(await r.text().catch(()=>'')).slice(0,300)); });
const am=A.locator('.q-dialog [data-test-id="input_ibs_amount"]'); if(await am.count()){ await (await inp(A,'input_ibs_amount')).fill('100'); }
await A.locator('.q-dialog [data-test-id="button_ibs_request_approval"]').click(); await A.waitForTimeout(1800);
const t=await toast(A); console.log('TAB A POP-UP',JSON.stringify(t)); console.log('request',W.join(' | ')); await A.screenshot({path:out+'/3-tabA-popup.png'});
// restore
const B2=await s.ctx.newPage(); await setIbs(B2,before.ibs||''); await B2.close(); await setMapping(before.mapping||'');
const after={mapping:await mapping(), ibs:(await cust())?.ibs}; console.log('after',JSON.stringify(after),'restored',JSON.stringify(after)===JSON.stringify(before));
fs.writeFileSync(out+'/result.json',JSON.stringify({env,cname,wo,wp,before,after,popup:t,request:W},null,1));
await s.close(); process.exit(0);
