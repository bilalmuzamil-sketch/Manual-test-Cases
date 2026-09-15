// The last report left to rework, SV-10056: a job you have just created cannot be found by its
// number for about a minute and a half. The Head of Product asked every regression report to carry a
// comparison with the version people use today - and for a report about TIME, the only honest
// comparison is to do the same thing on both: make a job, then start typing its number and see how
// long before it comes back.
//
// Runs on whichever side is named: WHERE=prod or WHERE=qa. On production it uses the second admin
// account, tags nothing (a job carries no name of its own) and DELETES the job it made when it is
// done, so nothing is left behind.
import fs from 'fs';
const WHERE=process.env.WHERE||'qa';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV=`${DIR}/timing-${WHERE}`; fs.mkdirSync(EV,{recursive:true});
const R={at:new Date().toISOString(), where:WHERE};
const save=()=>fs.writeFileSync(`${DIR}/TIMING-${WHERE.toUpperCase()}.json`,JSON.stringify(R,null,1));
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));

let page, browser, APP, APIH, SEARCH_SEL, isV1;
if (WHERE==='prod') {
  const m=await import('/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs');
  const b=await m.bootProdLogin('/workorders',{settle:13000});
  browser=b.browser; page=b.page; APP='https://app.shopview.com'; APIH='api.shopview.com';
  SEARCH_SEL='[data-test-id="select_global_search"]'; isV1=true; R.appVersion=b.version;
} else {
  const m=await import('/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs');
  const b=await m.boot('sv9160','/','admin');
  browser=b.browser; page=b.page; APP=b.APP; APIH=b.APIH; isV1=false;
}
L('on', WHERE, 'at', APP);
const api=async(p,mm='GET',bb=null)=>page.evaluate(async([u,method,body])=>{ try{
    const r=await fetch(u,{method,headers:{Accept:'application/json','Content-Type':'application/json'},
      credentials:'include',body:body?JSON.stringify(body):undefined});
    const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){}
    return {status:r.status,json:j,head:t.slice(0,300)};}catch(e){return {error:String(e).slice(0,120)};}},
  [`https://${APIH}${p}`,mm,bb]);

// --- find a customer and one of its vehicles, by walking the customer list
await page.goto(`${APP}/customers`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
const row=await page.evaluate(()=>{const rs=[...document.querySelectorAll('tbody tr')];
  const r=rs.find(e=>/ZZAUTOTEST/i.test(e.innerText||''))||rs[1]||rs[0];
  if(!r) return null; r.click(); return (r.innerText||'').replace(/\s+/g,' ').trim().slice(0,60);});
await page.waitForTimeout(8000);
const custId=(page.url().match(/customers\/([0-9a-f-]{20,})/)||[])[1];
R.customer={row, id:custId, url:page.url()};
L('customer:', row, '|', custId);
await page.goto(page.url().replace(/\/[^/]*$/,'/vehicles'),{waitUntil:'domcontentloaded'}); await page.waitForTimeout(8000);
const veh=await page.evaluate(()=>{const rs=[...document.querySelectorAll('tbody tr')].filter(e=>(e.innerText||'').trim());
  if(!rs.length) return null; rs[0].click(); return (rs[0].innerText||'').replace(/\s+/g,' ').trim().slice(0,60);});
await page.waitForTimeout(8000);
const vehId=(page.url().match(/vehicle\/([0-9a-f-]{20,})/)||[])[1];
R.vehicle={row:veh, id:vehId, url:page.url()};
L('vehicle :', veh, '|', vehId);
save();
if(!custId||!vehId){ L('could not reach a customer and a vehicle - stopping rather than guessing'); await browser.close(); process.exit(1); }

// --- make the job
const c=await api('/api/work-orders/create','POST',{is_vehicle_here:false, company_id:custId, vehicle_id:vehId});
R.create={status:c.status, head:c.head};
L('created ->', c.status, (c.head||'').slice(0,140));
const dig=(o,re,d=0)=>{ if(!o||typeof o!=='object'||d>5) return null;
  for(const [k,v] of Object.entries(o)){ if(re.test(k)&&(typeof v==='string'||typeof v==='number')) return String(v); }
  for(const v of Object.values(o)){ if(typeof v==='object'){ const r=dig(v,re,d+1); if(r) return r; } } return null; };
const newId=dig(c.json,/(^|_)id$/i);
let number=dig(c.json,/^number$/i);
if(!number && newId){ const v=await api(`/api/work-orders/view/${newId}`); number=dig(v.json,/^number$/i); }
R.job={id:newId, number};
L('the job is', number, '|', newId);
if(!number){ L('the job was made but its number could not be read - stopping'); save(); await browser.close(); process.exit(1); }
const bare=(number.match(/(\d+)\s*$/)||[])[1]||number;
save();

// --- type its number, over and over, until it comes back
const typeIt=async()=>{
  if(isV1){
    await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(3500);
    await page.click(SEARCH_SEL).catch(()=>{}); await page.fill(SEARCH_SEL,'').catch(()=>{});
    await page.type(SEARCH_SEL,bare,{delay:45}); await page.waitForTimeout(6000);
    return page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
      const p=[...document.querySelectorAll('.q-menu,[role=listbox]')].filter(vis)
        .sort((a,b)=>b.getBoundingClientRect().height-a.getBoundingClientRect().height)[0];
      return {text:p?(p.innerText||'').replace(/\s+/g,' ').trim().slice(0,220):null,
        rows:p?[...p.querySelectorAll('.q-item')].map(e=>(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,60)):[]};});
  }
  await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(3200);
  await page.keyboard.press('Escape').catch(()=>{});
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id="global_search_trigger"]'); b&&b.click();});
  await page.waitForSelector('[data-test-id="search_modal_input"]',{state:'visible',timeout:20000});
  await page.fill('[data-test-id="search_modal_input"]','');
  await page.type('[data-test-id="search_modal_input"]',bare,{delay:45}); await page.waitForTimeout(6000);
  return page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')]
      .filter(e=>e.getBoundingClientRect().width>2).pop();
    return {text:d?(d.innerText||'').replace(/\s+/g,' ').trim().slice(0,220):null,
      rows:[...document.querySelectorAll('[data-test-id^="search_result_row_work_orders"]')]
        .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,60))};});
};
const t0=Date.now(); R.attempts=[];
for(let i=0;i<14;i++){
  const m=await typeIt();
  const secs=Math.round((Date.now()-t0)/1000);
  const hit=(m&&m.rows||[]).some(r=>r.includes(bare));
  R.attempts.push({afterSeconds:secs, found:hit, rows:(m&&m.rows||[]).slice(0,3), text:(m&&m.text||'').slice(0,150)});
  L(`  ${String(secs).padStart(3)}s  ${hit?'FOUND':'not yet'}  ${JSON.stringify((m&&m.rows||[]).slice(0,2)).slice(0,110)}`);
  await page.screenshot({path:`${EV}/try-${String(i).padStart(2,'0')}-${secs}s.png`});
  if(hit){ R.foundAfterSeconds=secs; await page.screenshot({path:`${EV}/FOUND-${secs}s.png`}); break; }
  save(); await page.waitForTimeout(4000);
}
if(R.foundAfterSeconds===undefined) R.foundAfterSeconds=null;
L('the job came back after', R.foundAfterSeconds, 'seconds');
save();

// --- put it back the way it was
const del=await api('/api/work-orders/delete','POST',{work_order_id:newId, ids:[newId], id:newId});
R.deleted={status:del.status, head:(del.head||'').slice(0,160)};
L('deleted the job ->', del.status, (del.head||'').slice(0,120));
save(); L('DONE'); await browser.close();
