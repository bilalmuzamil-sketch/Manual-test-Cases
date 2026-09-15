// Part sales can be created again (SV-10031 fixed, confirmed by the QA lead 15 Sep 2026).
// That unlocks the three checks that were carried out on a SUBSTITUTE customer, plus the
// part-sale half of the create-and-find timing case.
//
//   C55665  find a part sale by its customer's name -- now with the customer the case NAMES
//   C45153  click a part sale result and land on that part sale -- likewise
//   C53587  a newly created part sale is findable within 30 seconds
//
// Create route is the one already recorded in the playbook (POST /api/part-sales {company_id}).
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const { browser, page, APIH } = await boot('sv9160','/','admin');
const api=async(p,method='GET',body=null)=>page.evaluate(async([u,m,b])=>{
  try{ const r=await fetch(u,{method:m,headers:{Accept:'application/json','Content-Type':'application/json'},
        credentials:'include', body:b?JSON.stringify(b):undefined});
    const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){}
    return {status:r.status,json:j,body:t.slice(0,400)};
  }catch(e){ return {error:String(e).slice(0,160)}; }},[`https://${APIH}${p}`,method,body]);
const out={at:new Date().toISOString()};

// pin the workplace the seeded records live in
{ const w=await api('/api/staff/my-workplaces');
  const d=(w.json&&(w.json.data!==undefined?w.json.data:w.json))||[];
  const list=Array.isArray(d)?d:(d.workplaces||d.collection||[]);
  const A=list.find(x=>/heavy duty/i.test(x.name||''))||list[0];
  if(A) await api('/api/iam/change-location','POST',{workplace_id:A.id, workplace_timezone:A.timezone||'America/Edmonton'});
  out.pinnedTo=A&&A.name; }

// the customer the case names
{ const r=await api('/api/customers?search=Bridgeport&limit=20');
  const d=r.json&&(r.json.data!==undefined?r.json.data:r.json);
  const arr=Array.isArray(d)?d:(d&&typeof d==='object'?(Object.values(d).find(v=>Array.isArray(v))||[]):[]);
  out.customerCandidates=arr.map(x=>({id:x.id,name:x.name||x.company_name}));
  const hit=arr.find(x=>/bridgeport/i.test(x.name||x.company_name||''));
  out.customer=hit?{id:hit.id,name:hit.name||hit.company_name}:null; }
if(!out.customer){ fs.writeFileSync(`${DIR}/PARTSALE-BRIDGEPORT.json`,JSON.stringify(out,null,2));
  console.log('customer not found'); await browser.close(); process.exit(2); }

// POSITIVE CONTROL for the create route: what the list holds before
const listOf=async()=>{ const r=await api('/api/part-sales?limit=200');
  const d=r.json&&(r.json.data!==undefined?r.json.data:r.json);
  const arr=Array.isArray(d)?d:(d&&typeof d==='object'?(Object.values(d).find(v=>Array.isArray(v))||[]):[]);
  return arr; };
const before=await listOf();
out.partSalesBefore=before.length;

const cr=await api('/api/part-sales','POST',{company_id: out.customer.id});
out.create={status:cr.status, body:cr.body.slice(0,200)};
const createdAt=Date.now();
const after=await listOf();
out.partSalesAfter=after.length;
const beforeIds=new Set(before.map(x=>x.id));
const fresh=after.filter(x=>!beforeIds.has(x.id));
out.createdRow=fresh.length?Object.fromEntries(Object.entries(fresh[0]).filter(([k,v])=>
  v===null||['string','number','boolean'].includes(typeof v))):null;
if(!out.createdRow){ fs.writeFileSync(`${DIR}/PARTSALE-BRIDGEPORT.json`,JSON.stringify(out,null,2));
  console.log('no new part sale appeared in the list -- create did not land');
  console.log(JSON.stringify(out,null,2)); await browser.close(); process.exit(3); }
const NUM = out.createdRow.number||out.createdRow.name;
const PSID = out.createdRow.id || fresh[0].id;
out.number=NUM; out.id=PSID;

const openModal=async()=>{ await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(600);
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
const type=async q=>{ await page.click('[data-test-id="search_modal_input"]');
  await page.evaluate(()=>{const i=document.querySelector('[data-test-id="search_modal_input"]'); i.value='';});
  await page.fill('[data-test-id="search_modal_input"]',''); await page.type('[data-test-id="search_modal_input"]',q,{delay:25}); };
const settle=async()=>{ let last=null,st=0;
  for(let i=0;i<40;i++){ await page.waitForTimeout(800); const m=await read(); if(!m) continue;
    const sig=JSON.stringify(m);
    const tc=Object.entries(m.tabs).filter(([k])=>!['strip','all'].includes(k)).map(([,v])=>v);
    const ready=tc.some(v=>v!==null);
    if(sig===last && ready){ if(++st>=3) return m; } else st=0; last=sig; }
  return await read(); };
const allTab=async()=>{ await page.evaluate(()=>{const t=document.querySelector('[data-test-id="search_modal_tab_all"]'); t&&t.click();}); await page.waitForTimeout(600); };

await page.goto(`https://sv9160.qa.shopview.com/workorders`,{waitUntil:'domcontentloaded'}).catch(()=>{});
await page.waitForTimeout(3000);

// ---- C53587 part-sale flow: how long until the new part sale is findable by its number
const NEEDLE = String(NUM||'').replace(/^P/,'');
await openModal();
const timing={needle:NEEDLE, polls:[]};
let foundAt=null;
for(let i=0;i<40;i++){
  await type(NEEDLE); await page.waitForTimeout(2500); await allTab();
  const m=await read();
  const hit = m && m.rows.some(r=>r.type==='part_sales' && r.text.includes(String(NUM)));
  const secs=Math.round((Date.now()-createdAt)/1000);
  timing.polls.push({secs, partSalesTab: m?m.tabs.part_sales:null, hit});
  if(hit){ foundAt=secs; break; }
  await page.waitForTimeout(1500);
}
timing.foundAfterSeconds=foundAt;
timing.requirementSeconds=30;
out.timing=timing;

// ---- C55665: find it by the CUSTOMER'S NAME
await openModal(); await type('Bridgeport'); await allTab();
const byCust=await settle();
out.byCustomer={query:'Bridgeport', tabs:byCust&&byCust.tabs,
  partSaleRows:(byCust?byCust.rows:[]).filter(r=>r.type==='part_sales').map(r=>r.text.slice(0,90)),
  thisOneReturned:(byCust?byCust.rows:[]).some(r=>r.type==='part_sales'&&r.text.includes(String(NUM)))};

// ---- C45153: clicking THAT row opens THAT part sale
if(out.byCustomer.thisOneReturned){
  const urlBefore=new URL(page.url()).pathname;
  await page.evaluate(num=>{ const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop();
    const row=[...d.querySelectorAll('[data-test-id^="search_result_row_part_sales_"]')]
      .find(e=>(e.innerText||'').includes(num)); row&&row.click(); }, String(NUM));
  await page.waitForTimeout(5000);
  const urlAfter=new URL(page.url()).pathname;
  out.clickOpened={urlBefore,urlAfter,navigated:urlBefore!==urlAfter,
    landedOnThisPartSale:urlAfter.includes(PSID)};
}
fs.writeFileSync(`${DIR}/PARTSALE-BRIDGEPORT.json`,JSON.stringify(out,null,2));
console.log(JSON.stringify(out,null,2));
await browser.close();
