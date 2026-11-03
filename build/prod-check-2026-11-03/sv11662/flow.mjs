import {prod1,post} from '../common.mjs'; import fs from 'fs'; const WO=process.argv[2]; const TAG=process.argv[3]||'wo'; const s=await prod1('/tmp/qa75'); const p=s.page; const R={marker:await s.marker(),utc:new Date().toISOString(),wo:WO}; let n=10;
const shot=async t=>{n++; await p.screenshot({path:`sv11662/${TAG}-${n}-${t}.png`});};
const dlg=()=>p.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].pop(); return d?{text:d.innerText.replace(/\n+/g,' | ').slice(0,500),btns:[...d.querySelectorAll('button')].map(b=>b.innerText.trim()+'['+(b.getAttribute('data-test-id')||'')+']'+(b.disabled||b.getAttribute('aria-disabled')==='true'?'(disabled)':''))}:null;});
const arm=()=>p.evaluate(()=>{ window.__toasts=[]; const seen=new Set(); const grab=()=>document.querySelectorAll('.q-notification').forEach(x=>{const t=x.innerText.replace(/\s+/g,' '); if(!seen.has(t)){seen.add(t); window.__toasts.push(t);} }); grab(); if(!window.__obs){ window.__obs=new MutationObserver(grab); window.__obs.observe(document.body,{childList:true,subtree:true,characterData:true}); } });
const toasts=()=>p.evaluate(()=>window.__toasts||[]);
const resp=[]; p.on('response',async r=>{ const q=r.request(); if(q.method()!=='GET'&&/portal|approval|request-customer/i.test(r.url())) resp.push(r.status()+' '+q.method()+' '+r.url().replace(/^https:\/\/[^/]+/,'')+' '+(await r.text().catch(()=>'')).slice(0,200)); });
const PAGE=process.env.PAGE||`/workorders/${WO}/lines`;
const openDlg=async()=>{ await s.go(PAGE); await p.waitForTimeout(6000); for(let i=0;i<2;i++){ const x=p.locator('.q-dialog [data-test-id="button_close_dialog"]').first(); if(await x.count()){await x.click(); await p.waitForTimeout(700);} } await p.click('[data-test-id="button_send_to_portal"]'); await p.waitForTimeout(2500); return dlg(); };
const send=async(tag)=>{ const d=await dlg(); const b=d?.btns.find(x=>/send/i.test(x)&&!/disabled/.test(x)); if(!b) return {noSend:true,d}; const tid=b.match(/\[(.*?)\]/)[1]; await shot(tag+'-dialog'); await arm();
  if(tid) await p.click(`.q-dialog [data-test-id="${tid}"]`); else await p.locator('.q-dialog button',{hasText:/send/i}).last().click(); await p.waitForTimeout(1800);
  const again=await dlg(); if(again&&again.btns.some(x=>/are you sure/i.test(x))){ await p.locator('.q-dialog button',{hasText:/are you sure/i}).first().click(); } await p.waitForTimeout(3500);
  return {clicked:b,toasts:await toasts(),dialogAfter:await dlg()}; };
const audit=async()=>{ await s.go(`/workorders/${WO}/lines`); await p.waitForTimeout(5000); for(let i=0;i<2;i++){ const x=p.locator('.q-dialog [data-test-id="button_close_dialog"]').first(); if(await x.count()){await x.click(); await p.waitForTimeout(700);} }
  await p.click('[data-test-id="button_work_order_nav_bar_menu"]'); await p.waitForTimeout(900); await p.click('[data-test-id="menu_item_audit_log"]'); await p.waitForTimeout(3000); const t=await p.evaluate(()=>(document.querySelector('.q-dialog')||document.body).innerText); return {sentToPortal:(t.match(/Sent to Portal/g)||[]).length,sample:t.replace(/\s+/g,' ').slice(0,300)}; };
if(!process.env.ONLYSUCCESS){
R.d1=await openDlg(); R.send1=await send('1-nocontact'); await shot('after-send1');
R.d2=await openDlg(); await shot('reopen'); await p.keyboard.press('Escape'); R.audit1=await audit(); await shot('audit1'); }
// assign the contact
if(TAG==='wo'){ const v=(await s.api('/api/work-orders/view/'+WO)).json?.data?.work_order||{}; const vid=v.vehicle_id||v.vehicle?.id||v.asset_id; R.vid=vid; R.assign=(await post(s,'/api/work-orders/change-contact',{work_order_id:WO,vehicle_id:vid,contact_id:'176fd89d-920d-412c-8abc-632f1ef16934',update_vehicle:true})).t; }
R.d3=await openDlg(); R.send2=await send('2-withcontact'); await shot('after-send2');
R.d4=await openDlg(); await shot('reopen-after-success'); await p.keyboard.press('Escape'); if(TAG==='wo'){ R.audit2=await audit(); await shot('audit2'); }
R.resp=resp; fs.writeFileSync(`sv11662/${TAG}-result.json`,JSON.stringify(R,null,1)); console.log(JSON.stringify(R,null,1).slice(0,7000)); await s.close(); process.exit(0);
