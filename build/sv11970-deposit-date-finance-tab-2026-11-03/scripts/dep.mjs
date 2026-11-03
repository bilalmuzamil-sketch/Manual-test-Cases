// usage: node dep.mjs <prod|branch> <woId> <tag> [amount]   env WP, TZ (location id + its time zone)
import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs'; import {execSync} from 'child_process';
const [ENV,WO,TAG,AMT0]=process.argv.slice(2); const AMT=AMT0||'5.00'; const WP=process.env.WP, TZ=process.env.TZ;
const OUT=`/home/user/Manual-test-Cases/build/sv11970-deposit-date-finance-tab-2026-11-03/ev/${TAG}`; fs.mkdirSync(OUT,{recursive:true});
const rd=f=>fs.readFileSync('/tmp/sv11970/'+f,'utf8').trim();
const s=ENV==='prod'? await open({env:'prod',dir:'/tmp/qa52',user:'bilal.muzamil+serviceadvisornoreports@shopview.com',pw:fs.readFileSync('/tmp/sv-prod-pw2.txt','utf8').trim(),vp:{width:1440,height:900},dpr:2,tz:TZ})
 : await open({env:'branch',ticket:'11970',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')},quick:'admin',dir:'/tmp/qa51',vp:{width:1440,height:900},dpr:2,tz:TZ});
const p=s.page; const R={env:ENV,wo:WO,marker:await s.marker(),browserNow:null,utcNow:new Date().toISOString()};
const {setLoc}=await import('./loc.mjs'); R.screenLocation=await setLoc(s,process.env.LOCNAME);
let WOID=WO; if(WO==='new'){ const post=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
  const veh=(await s.api('/api/vehicles?company_id='+process.env.COMPANY)).json.data; const vs=veh.collection||veh.vehicles||veh; const vid=(Array.isArray(vs)?vs:[])[0]?.id;
  const today=await p.evaluate(()=>{const d=new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');});
  const c=await post('/api/work-orders/create',{company_id:process.env.COMPANY,vehicle_id:vid,workplace_id:WP,start_date:today,is_vehicle_here:true}); R.create={st:c.status,body:JSON.stringify(c.json||c.text).slice(0,300)};
  WOID=c.json?.data?.id||c.json?.data?.work_order_id||c.json?.data?.workOrder?.id; R.wo=WOID;
  const ct=await post('/api/contacts/create',{company_id:process.env.COMPANY,first_name:'ZZAUTOTEST',last_name:'SV11970 '+TAG}); const cid=ct.json?.data?.contact_id;
  const cc=await post('/api/work-orders/change-contact',{work_order_id:WOID,vehicle_id:vid,contact_id:cid,update_vehicle:true}); R.contact={create:ct.status,id:cid,set:cc.status}; }
R.browserNow=await p.evaluate(()=>new Date().toString());
const caps=[]; p.on('response',async r=>{const u=r.url(); if(r.request().method()!=='GET'&&/deposit/i.test(u)){let b='';try{b=(await r.text()).slice(0,600)}catch{} caps.push({m:r.request().method(),u:u.replace(/^https:\/\/[^/]+/,''),st:r.status(),req:r.request().postData(),res:b});}});
const pay=()=>p.evaluate(()=>{const t=document.body.innerText; return (t.match(/\(Deposit\)[^\n]*/g)||[]);});
await s.go(`/workorders/${WOID}/finance`); await p.waitForTimeout(6000);
const closeDlg=async()=>{ for(let i=0;i<3;i++){ const x=p.locator('.q-dialog [data-test-id="button_close_dialog"], .q-dialog button:has-text("close")').first(); if(await x.count()){ await x.click().catch(()=>{}); await p.waitForTimeout(800);} else { await p.keyboard.press('Escape'); await p.waitForTimeout(600);} if(!(await p.locator('.q-dialog').count())) break; } };
await closeDlg(); if(!/\/finance/.test(p.url())||!(await p.locator('[data-test-id="button_new_deposit"]').count())){ await p.locator('text=Finance').first().click(); await p.waitForTimeout(4000); }
R.url=p.url(); {const d=(await s.api('/api/work-orders/view/'+WOID)).json?.data||{}; const w=d.work_order||d; R.woLocation=Object.fromEntries(Object.entries(w).filter(([k,v])=>/workplace|number|status/i.test(k)).map(([k,v])=>[k,typeof v==='object'?JSON.stringify(v).slice(0,120):v]));} R.payBefore=await pay();
await p.screenshot({path:`${OUT}/1-finance-before.png`});
await p.click('[data-test-id="button_new_deposit"]'); await p.waitForTimeout(1500);
R.modal=await p.evaluate(()=>{const d=document.querySelector('.q-dialog'); return d?{text:d.innerText.replace(/\n+/g,' | ').slice(0,500),inputs:[...d.querySelectorAll('input')].map(i=>(i.closest('[data-test-id]')?.getAttribute('data-test-id')||i.getAttribute('data-test-id')||'')+'='+i.value)}:null;});
await p.click('[data-test-id="select_create_deposit_payment_method"]'); await p.waitForTimeout(900);
const opt=p.locator('.q-menu .q-item',{hasText:/^\s*Cash\s*$/}).first(); if(await opt.count()) await opt.click(); else await p.locator('.q-menu .q-item').first().click(); await p.waitForTimeout(600);
const am=p.locator('[data-test-id="input_create_deposit_amount"] input, input[data-test-id="input_create_deposit_amount"]').first(); await am.click(); await am.fill(AMT);
const mm=p.locator('[data-test-id="input_create_deposit_memo"] input, [data-test-id="input_create_deposit_memo"] textarea, input[data-test-id="input_create_deposit_memo"]').first(); if(await mm.count()){await mm.click(); await mm.fill('ZZAUTOTEST SV-11970 '+TAG);}
if(process.env.DDATE){ const di=p.locator('[data-test-id="date_input_create_deposit_date"] input, input[data-test-id="date_input_create_deposit_date"]').first(); await di.click(); await p.keyboard.press('Control+A'); await p.keyboard.press('Backspace'); await di.type(process.env.DDATE,{delay:60}); await p.keyboard.press('Tab'); await p.waitForTimeout(600); await p.keyboard.press('Escape').catch(()=>{}); await p.waitForTimeout(400); }
await p.waitForTimeout(500); await p.screenshot({path:`${OUT}/2-add-deposit-filled.png`});
R.modalFilled=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog input')].map(i=>(i.closest('[data-test-id]')?.getAttribute('data-test-id')||'')+'='+i.value));
const btn=await p.evaluate(()=>{const b=[...document.querySelectorAll('.q-dialog button')].find(b=>/submit deposit|record deposit/i.test(b.innerText)); if(!b) return null; const r=b.getBoundingClientRect(); return {t:b.innerText.trim(),x:r.x+r.width/2,y:r.y+r.height/2};});
R.submitBtn=btn; if(btn){ await p.mouse.click(btn.x,btn.y); } await p.waitForTimeout(3500);
R.caps=caps; R.toasts=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(n=>n.innerText.replace(/\n/g,' ')));
await s.go(`/workorders/${WOID}/finance`); await p.waitForTimeout(6000); await closeDlg(); R.payAfter=await pay();
await p.screenshot({path:`${OUT}/3-finance-after.png`,fullPage:true});
// download the invoice/estimate PDF from the Finance tab
try{ const [dl]=await Promise.all([p.waitForEvent('download',{timeout:20000}),p.click('[data-test-id="button_download_invoice"]')]); const f=`${OUT}/4-downloaded.pdf`; await dl.saveAs(f); R.pdf=f;
  const txt=execSync(`pdftotext -layout ${f} -`).toString(); R.pdfDeposit=(txt.match(/.*\(Deposit\).*/g)||[]).map(x=>x.trim()); R.pdfDates=(txt.match(/(Date|Issued|Invoice Date)[^\n]{0,60}/g)||[]).slice(0,6);
}catch(e){ R.pdfErr=String(e).slice(0,200); }
// customer Deposits tab
const v=(await s.api('/api/work-orders/view/'+WOID)).json.data; const w=v.work_order||v; const cid=w.company_id||w.company?.id; R.cid=cid; R.woNumber=w.number;
await s.go(`/customers/${cid}/deposits`); await p.waitForTimeout(6000);
R.depRows=await p.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(tr=>tr.innerText.replace(/\s+/g,' ').trim()).filter(t=>/DEP/.test(t)).slice(0,8));
await p.screenshot({path:`${OUT}/5-customer-deposits.png`});
fs.writeFileSync(`${OUT}/result.json`,JSON.stringify(R,null,1)); console.log(JSON.stringify(R,null,1).slice(0,4000));
await s.close(); process.exit(0);
