// The four checks that were waiting on a part sale existing.
//
//   · find a part sale by its customer's name
//   · click a part sale result and land on the part sale
//   · are part sales limited to the current location
//   · (the create-and-time half of the new-record check is handled separately)
//
// The part sales list answers under the key `partSales`, not `part_sales` -- the same
// write-name/read-name mismatch that has cost this pass several hours, so it is taken from whatever
// array the response actually carries.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const ID='e41ab646-b7ee-444e-bfbe-c280fda74c92';
const { browser, page, APIH, APP } = await boot('sv9160','/','admin');
const api=async(p,method='GET',body=null)=>page.evaluate(async([u,m,b])=>{
  try{ const r=await fetch(u,{method:m,headers:{Accept:'application/json','Content-Type':'application/json'},
        credentials:'include', body:b?JSON.stringify(b):undefined});
    const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){}
    return {status:r.status,json:j,body:t.slice(0,300)};
  }catch(e){ return {error:String(e).slice(0,120)}; }},[`https://${APIH}${p}`,method,body]);
const out={at:new Date().toISOString()};

// pin the workplace the seeded records live in, as every other pass does
{ const w=await api('/api/staff/my-workplaces');
  const d=(w.json&&(w.json.data!==undefined?w.json.data:w.json))||[];
  const list=Array.isArray(d)?d:(d.workplaces||d.collection||[]);
  out.workplaces=list.map(x=>({id:x.id,name:x.name}));
  const A=list.find(x=>/heavy duty/i.test(x.name||''))||list[0];
  if(A) await api('/api/iam/change-location','POST',{workplace_id:A.id, workplace_timezone:A.timezone||'America/Edmonton'});
  out.pinnedTo=A&&A.name; }

// find the part sale, whatever key the list uses
{ const r=await api('/api/part-sales?limit=100');
  const d=r.json&&(r.json.data!==undefined?r.json.data:r.json);
  const arr=Array.isArray(d)?d:(d&&typeof d==='object'?(Object.values(d).find(v=>Array.isArray(v))||[]):[]);
  out.listCount=arr.length;
  const hit=arr.find(x=>x.id===ID)||arr[0];
  out.partSale=hit?Object.fromEntries(Object.entries(hit).filter(([k,v])=>
    v===null||['string','number','boolean'].includes(typeof v))):null;
  out.isTheOneGiven = !!(hit&&hit.id===ID); }
if(!out.partSale){ fs.writeFileSync(`${DIR}/PARTSALE-CASES.json`,JSON.stringify(out,null,2));
  console.log('no part sale could be read'); await browser.close(); process.exit(2); }

const num = out.partSale.number || out.partSale.partSaleNumber || out.partSale.name || null;
const cust = out.partSale.companyName || out.partSale.company_name || out.partSale.customerName
          || out.partSale.customer_name || null;
out.number=num; out.customer=cust;

const openModal=async()=>{ await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(700);
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id="global_search_trigger"]'); b&&b.click();});
  await page.waitForSelector('[data-test-id="search_modal_input"]',{state:'visible',timeout:20000}); };
const read=async()=>page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!d) return null;
  const tabs={}; d.querySelectorAll('[data-test-id^="search_modal_tab_"]').forEach(e=>{
    const t=(e.innerText||'').match(/\((\d+)\)/); tabs[e.getAttribute('data-test-id').replace('search_modal_tab_','')]=t?+t[1]:null;});
  return {tabs, rows:[...d.querySelectorAll('[data-test-id^="search_result_row_"]')].map(e=>({
    tid:e.getAttribute('data-test-id'),
    type:e.getAttribute('data-test-id').replace('search_result_row_','').replace(/_\d+$/,''),
    text:(e.innerText||'').replace(/\s+/g,' ').trim()}))};});
const settle=async()=>{ let last=null,st=0;
  for(let i=0;i<25;i++){ await page.waitForTimeout(1000); const m=await read(); if(!m){st=0;continue;}
    const sig=JSON.stringify(m);
    const typeCounts=Object.entries(m.tabs).filter(([k])=>!['strip','all'].includes(k)).map(([,v])=>v);
    const ready=typeCounts.some(v=>v!==null);
    if(sig===last && ready){ if(++st>=3) return m; } else st=0; last=sig; }
  return await read(); };
const search=async(q)=>{ await openModal();
  await page.fill('[data-test-id="search_modal_input"]','');
  await page.type('[data-test-id="search_modal_input"]',q,{delay:35});
  await settle();
  await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop();
    const t=d&&d.querySelector('[data-test-id="search_modal_tab_all"]'); t&&t.click();});
  await page.waitForTimeout(2000);
  return settle(); };

await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(4000);

// --- find a part sale by its customer's name
if(cust){
  const m=await search(cust);
  out.byCustomer={query:cust, tabs:m&&m.tabs,
    partSaleRows:(m?m.rows:[]).filter(r=>r.type==='part_sales').map(r=>r.text.slice(0,70))};
  await page.screenshot({path:`${DIR}/run-evidence2/partsale-by-customer.png`}).catch(()=>{});
}
// --- find it by its number, then click it and see where it lands
if(num){
  const m=await search(String(num).replace(/^\D+/,''));
  const row=(m?m.rows:[]).find(r=>r.type==='part_sales');
  out.byNumber={query:String(num).replace(/^\D+/,''), tabs:m&&m.tabs,
    partSaleRows:(m?m.rows:[]).filter(r=>r.type==='part_sales').map(r=>r.text.slice(0,70))};
  if(row){
    const before=page.url();
    await page.evaluate(t=>{const e=document.querySelector(`[data-test-id="${t}"]`); e&&e.click();},row.tid);
    await page.waitForTimeout(6000);
    out.clickOpened={urlBefore:before.replace(APP,''), urlAfter:page.url().replace(APP,''),
      navigated:before!==page.url(), landedOnThisPartSale:page.url().includes(ID)};
    await page.screenshot({path:`${DIR}/run-evidence2/partsale-opened.png`}).catch(()=>{});
  }
}
// --- are part sales limited to the current location
if(cust && (out.workplaces||[]).length>1){
  const A=out.workplaces.find(w=>/heavy duty/i.test(w.name))||out.workplaces[0];
  const B=out.workplaces.find(w=>w.id!==A.id);
  const switchInUI=async(name)=>{
    await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(800);
    const menu=await page.evaluate(()=>{const b=document.querySelector('[data-test-id="profile_menu_button"]');
      if(!b) return false; b.click(); return true;});
    if(!menu) return false;
    await page.waitForTimeout(2500);
    const opened=await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
      const sel=[...document.querySelectorAll('.q-select,label.q-field')].filter(vis)
        .find(e=>/Staging [A-Za-z ]+- ?\d+/.test(e.innerText||''));
      if(!sel) return false; sel.click(); return true;});
    if(!opened) return false;
    await page.waitForTimeout(3000);
    const picked=await page.evaluate((n)=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
      const o=[...document.querySelectorAll('[role=option],.q-item')].filter(vis)
        .find(e=>(e.innerText||'').replace(/\s+/g,' ').trim().replace(/^check /,'')===n);
      if(!o) return false; (o.closest('[role=option],.q-item')||o).click(); return true;}, name);
    await page.waitForTimeout(8000);
    return picked;
  };
  const at=async(w, viaUI)=>{ 
    if(viaUI){ out.uiSwitch=await switchInUI(w.name); }
    else await api('/api/iam/change-location','POST',{workplace_id:w.id, workplace_timezone:'America/Edmonton'});
    await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(5000);
    const shown=await page.evaluate(()=>{const m=(document.body.innerText||'').match(/Staging [A-Za-z ]+- ?\d+/); return m?m[0]:null;});
    const m=await search(cust);
    return {location:w.name, appShows:shown, partSales:(m&&m.tabs&&m.tabs.part_sales),
      workOrders:(m&&m.tabs&&m.tabs.work_orders)}; };
  out.location1=await at(A,false);
  out.location2=await at(B,true);
  out.locationReallyChanged = out.location1.appShows!==out.location2.appShows;
  await api('/api/iam/change-location','POST',{workplace_id:A.id, workplace_timezone:'America/Edmonton'});
}
fs.writeFileSync(`${DIR}/PARTSALE-CASES.json`, JSON.stringify(out,null,2));
console.log(JSON.stringify({number:num, customer:cust, isTheOneGiven:out.isTheOneGiven,
  byCustomer:out.byCustomer, byNumber:out.byNumber, clickOpened:out.clickOpened,
  location1:out.location1, location2:out.location2, locationReallyChanged:out.locationReallyChanged},null,1).slice(0,1800));
await browser.close();
