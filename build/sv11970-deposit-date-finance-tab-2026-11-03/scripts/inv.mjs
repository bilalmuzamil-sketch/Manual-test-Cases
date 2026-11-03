// usage: env TZ LOCNAME  node inv.mjs <woId> <tag>   -> invoice the work order (canned-line chain), read Finance tab + invoice PDF + customer tabs
import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs'; import {execSync} from 'child_process';
const [WOID,TAG]=process.argv.slice(2); const OUT=`/home/user/Manual-test-Cases/build/sv11970-deposit-date-finance-tab-2026-11-03/ev/${TAG}`; fs.mkdirSync(OUT,{recursive:true});
const rd=f=>fs.readFileSync('/tmp/sv11970/'+f,'utf8').trim();
const s=await open({env:'branch',ticket:'11970',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')},quick:'admin',dir:'/tmp/qa51',vp:{width:1440,height:900},dpr:2,tz:process.env.TZ});
const p=s.page; const R={wo:WOID,marker:await s.marker(),utcNow:new Date().toISOString()};
const {setLoc}=await import('./loc.mjs'); R.screenLocation=await setLoc(s,process.env.LOCNAME); R.browserNow=await p.evaluate(()=>new Date().toString());
const post=async(u,b)=>{const r=await s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)}); return {st:r.status,j:r.json,t:(JSON.stringify(r.json||r.text)||'').slice(0,250)};};
const cl=(await s.api('/api/work-orders/canned-lines')).json?.data; const cls=cl?.collection||cl?.canned_lines||cl||[]; const can=(Array.isArray(cls)?cls:[]).find(c=>Number(c.total_parts)===0 && c.workplace_id===process.env.WP)||(Array.isArray(cls)?cls:[]).find(c=>Number(c.total_parts)===0); R.canned=[can?.canned_line_name,can?.workplace_id,can?.total_parts];
const L=await post(`/api/work-orders/${WOID}/lines/create-from-canned-line`,{canned_line_id:can.id,status:'authorized'}); R.line=L.st+' '+L.t;
const v0=(await s.api('/api/work-orders/view/'+WOID)).json.data; const w0=v0.work_order||v0; const lines=(await s.api(`/api/work-orders/${WOID}/lines`)).json?.data; const ll=lines?.collection||lines?.lines||lines||[];
const lid=(Array.isArray(ll)?ll:[]).map(x=>x.id)[0]||L.j?.data?.line_id||L.j?.data?.id; R.lineId=lid;
R.mileage=(await post('/api/work-orders/change-mileage',{work_order_id:WOID,mileage:'123456'})).st;
R.story=(await post('/api/work-orders/lines/change-story',{line_id:lid,tech_story:'ZZAUTOTEST SV-11970 story',work_order_id:WOID})).st;
R.lineDone=(await post('/api/work-orders/lines/change-status',{line_id:lid,status:'complete'})).t;
R.woDone=(await post('/api/work-orders/change-status',{id:WOID,status:'complete'})).t;
R.invoice=(await post('/api/invoices/create',{work_order_id:WOID})).t;
await s.go(`/workorders/${WOID}/finance`); await p.waitForTimeout(7000);
for(let i=0;i<3;i++){ const x=p.locator('.q-dialog [data-test-id="button_close_dialog"]').first(); if(await x.count()){await x.click().catch(()=>{}); await p.waitForTimeout(700);} }
R.finance=await p.evaluate(()=>{const t=document.body.innerText; return {dep:t.match(/\(Deposit\)[^\n]*/g)||[], dates:(t.match(/(Invoice Date|Due Date|Date)[^\n]{0,40}/g)||[]).slice(0,6), inv:(t.match(/INV[-\w]*/g)||[]).slice(0,3)};});
await p.screenshot({path:`${OUT}/1-finance-invoiced.png`,fullPage:true});
try{ const [dl]=await Promise.all([p.waitForEvent('download',{timeout:20000}),p.click('[data-test-id="button_download_invoice"]')]); const f=`${OUT}/2-invoice.pdf`; await dl.saveAs(f);
  const txt=execSync(`pdftotext -layout ${f} -`).toString(); R.pdfDeposit=(txt.match(/.*\(Deposit\).*/g)||[]).map(x=>x.trim()); R.pdfDates=(txt.match(/(Invoice Date|Due Date|INVOICE)[^\n]{0,60}/g)||[]).slice(0,6).map(x=>x.trim());
}catch(e){ R.pdfErr=String(e).slice(0,200); }
const cid=w0.company_id||w0.company?.id;
for(const tab of ['deposits','payments','invoices']){ await s.go(`/customers/${cid}/${tab}`); await p.waitForTimeout(6000);
  R['tab_'+tab]=await p.evaluate(n=>[...document.querySelectorAll('tbody tr')].map(tr=>tr.innerText.replace(/\s+/g,' ').trim()).filter(t=>/DEP-|S11970|INV/.test(t)).slice(0,6),tab);
  await p.screenshot({path:`${OUT}/3-customer-${tab}.png`}); }
fs.writeFileSync(`${OUT}/result.json`,JSON.stringify(R,null,1)); console.log(JSON.stringify(R,null,1).slice(0,3500));
await s.close(); process.exit(0);
