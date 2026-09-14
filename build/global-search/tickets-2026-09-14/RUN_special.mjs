// The nine cases in run 415 that are not "type a query and read a group".
// Each one is a different question -- a keyboard shortcut, a hint in the header, three screen
// widths, where a row takes you, whether re-selecting the record you are on re-navigates, an
// analytics event, a location switch, and how fast a new record becomes findable.
//
// Every check here carries its own POSITIVE CONTROL, because each is a place where "nothing
// happened" is the easy reading and is usually my own fault (Rule 104): the shortcut test proves
// the modal was CLOSED first, the width tests prove the desktop width works before narrowing, the
// navigation test proves a DIFFERENT record does navigate before concluding that the same one does
// not, and the analytics test proves some request was captured at all before reporting none.
//
// Writes nothing except the work order C53587 exists to create, which is the point of that case.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV=`${DIR}/special-evidence`; fs.mkdirSync(EV,{recursive:true});
const STATE=`${DIR}/SPECIAL-RESULTS.json`;
const R=fs.existsSync(STATE)?JSON.parse(fs.readFileSync(STATE,'utf8')):{at:new Date().toISOString(),cases:{}};
const save=()=>fs.writeFileSync(STATE,JSON.stringify(R,null,1));
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const ONLY=process.env.ONLY?new Set(process.env.ONLY.split(',').map(s=>s.replace(/^C/,''))):null;
const want=(id)=>!ONLY||ONLY.has(String(id));

const { browser, page, APIH, APP } = await boot('sv9160','/','admin');
const api=async(path,method='GET',body=null)=>page.evaluate(async([u,m,b])=>{
  try{ const r=await fetch(u,{method:m, headers:{'Accept':'application/json','Content-Type':'application/json'},
        credentials:'include', body:b?JSON.stringify(b):undefined});
    const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){}
    return {status:r.status, json:j, body:t.slice(0,600)};
  }catch(e){ return {error:String(e).slice(0,120)}; }},[`https://${APIH}${path}`,method,body]);

// Pin the location the seeded records live in. The handoff's trap -- "a whole area looks empty, you
// have not set the location" -- is about work orders and part sales being scoped to the current
// workplace; the seeder pins itself to "Heavy Duty" before creating anything, and the browser signs
// in separately, so without this the run could read seeded jobs as missing.
const wps=await api('/api/staff/my-workplaces');
let currentWp=null;
{ const d=(wps.json&&(wps.json.data!==undefined?wps.json.data:wps.json))||[];
  const list=Array.isArray(d)?d:(d.workplaces||d.collection||[]);
  const pick=list.find(x=>/heavy duty/i.test(x.name||''))||list[0];
  if(pick){ const r=await api('/api/iam/change-location','POST',
      {workplace_id:pick.id, workplace_timezone:pick.timezone||'America/Edmonton'});
    currentWp={id:pick.id,name:pick.name,status:r.status};
    L('location pinned ->', pick.name, r.status); }
  R.workplaces=list.map(x=>({id:x.id,name:x.name})); R.location=currentWp; save(); }
await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(5000);

const modalOpen=async()=>page.evaluate(()=>{const e=document.querySelector('[data-test-id="search_modal_input"]');
  if(!e) return false; const r=e.getBoundingClientRect(); return r.width>2&&r.height>2;});
const closeModal=async()=>{ for(let i=0;i<3;i++){ if(!await modalOpen()) return true;
  await page.keyboard.press('Escape'); await page.waitForTimeout(800);} return !(await modalOpen()); };
const openModal=async()=>{ await closeModal();
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id="global_search_trigger"]'); b&&b.click();});
  await page.waitForSelector('[data-test-id="search_modal_input"]',{state:'visible',timeout:20000}); };
const settle=async(min=5000)=>{ let last=null,st=0,t0=Date.now();
  for(let i=0;i<25;i++){ await page.waitForTimeout(1000);
    const m=await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
      const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!d) return null;
      const tabs={}; d.querySelectorAll('[data-test-id^="search_modal_tab_"]').forEach(e=>{
        const t=(e.innerText||'').match(/\((\d+)\)/); tabs[e.getAttribute('data-test-id').replace('search_modal_tab_','')]=t?+t[1]:null;});
      const rows=[...d.querySelectorAll('[data-test-id^="search_result_row_"]')].map(e=>({
        tid:e.getAttribute('data-test-id'), type:e.getAttribute('data-test-id').replace('search_result_row_','').replace(/_\d+$/,''),
        text:(e.innerText||'').replace(/\s+/g,' ').trim()}));
      return {tabs,rows};});
    if(!m){st=0;continue;}
    const sig=JSON.stringify(m); const has=Object.values(m.tabs).some(v=>v!==null);
    if(has&&sig===last){ if(++st>=3&&Date.now()-t0>=min) return m; } else st=0;
    last=sig; }
  return null; };
const shot=(n)=>page.screenshot({path:`${EV}/${n}.png`});
const run=async(id,name,fn)=>{ const k='C'+id;
  if(!want(id)) return; if(R.cases[k]&&!ONLY){ L('skip',k); return; }
  try{ R.cases[k]={title:name, ...(await fn())}; }
  catch(e){ R.cases[k]={title:name, error:String(e&&e.message||e).slice(0,300)}; }
  save(); L(k, JSON.stringify(R.cases[k]).slice(0,220)); };

// ---------------------------------------------------------------- C45156 keyboard shortcut opens
await run(45156,'The keyboard shortcut opens global search',async()=>{
  const closedFirst=await closeModal();              // control: it must be SHUT before the keypress
  await page.click('body',{position:{x:5,y:5}}).catch(()=>{});
  await page.waitForTimeout(500);
  const before=await modalOpen();
  await page.keyboard.press('Control+k');             // lowercase k: Control+K sends Ctrl+Shift+K
  await page.waitForTimeout(2500);
  const after=await modalOpen();
  const focused=await page.evaluate(()=>{const a=document.activeElement;
    return !!(a&&a.getAttribute&&a.getAttribute('data-test-id')==='search_modal_input');});
  await shot('C45156-after-ctrl-k');
  return {closedFirst, openBefore:before, openAfter:after, inputFocused:focused};});

// ---------------------------------------------------------------- C55683 the hint in the header
await run(55683,'The keyboard shortcut is shown in the search box',async()=>{
  await closeModal();
  const read=async()=>page.evaluate(()=>{
    const t=document.querySelector('[data-test-id="global_search_trigger"]'); if(!t) return null;
    const r=t.getBoundingClientRect();
    return {text:(t.innerText||'').replace(/\s+/g,' ').trim(), title:t.getAttribute('title')||null,
      aria:t.getAttribute('aria-label')||null, placeholder:(t.querySelector('input')||{}).placeholder||null,
      visible:r.width>2&&r.height>2, w:Math.round(r.width)};});
  const out={};
  for(const [label,w] of [['desktop',1600],['tablet',900],['phone',400]]){
    await page.setViewportSize({width:w,height:1000}); await page.waitForTimeout(2500);
    out[label]=await read(); await shot(`C55683-${label}`); }
  await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(1500);
  return out;});

// ---------------------------------------------------------------- C55674 three screen widths
await run(55674,'Search can be reached on a phone and a tablet as well as a desktop',async()=>{
  const out={};
  for(const [label,w] of [['desktop',1600],['tablet',900],['phone',400]]){
    await page.setViewportSize({width:w,height:1000}); await page.waitForTimeout(2500);
    await closeModal();
    // reach it the way that width allows: the trigger, else a search icon, else the shortcut
    let how=null;
    const clicked=await page.evaluate(()=>{const b=document.querySelector('[data-test-id="global_search_trigger"]');
      if(!b) return false; const r=b.getBoundingClientRect(); if(!(r.width>2&&r.height>2)) return false;
      b.click(); return true;});
    // WAIT for the modal after each attempt. The first version checked immediately after clicking,
    // so desktop "passed" only by winning a race and the two narrow widths read as "search cannot be
    // reached" -- which would have been reported as a V1-to-V2 capability loss caused entirely by a
    // missing await. Each route now gets a real chance to open before the next is tried.
    const waitOpen=async(ms=8000)=>{ const t=Date.now();
      while(Date.now()-t<ms){ if(await modalOpen()) return true; await page.waitForTimeout(400); }
      return false; };
    if(clicked && await waitOpen()) how='search box in the header';
    if(!how){ const icon=await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
        const c=[...document.querySelectorAll('button,[role=button],a')].filter(vis)
          .find(e=>/search/i.test((e.getAttribute('aria-label')||'')+' '+(e.getAttribute('title')||'')+' '+(e.className||'')));
        if(!c) return false; c.click(); return true;});
      if(icon && await waitOpen()) how='a search icon'; }
    if(!how){ await page.keyboard.press('Control+k');
      if(await waitOpen()) how='the keyboard shortcut'; }
    // last resort: a REAL pointer click on the trigger, in case a JS .click() is being swallowed
    if(!how){ await page.locator('[data-test-id="global_search_trigger"]').first()
        .click({timeout:5000}).catch(()=>{});
      if(await waitOpen()) how='a real tap on the search box'; }
    const opened=await modalOpen();
    let found=null, rows=null;
    if(opened){ const m=await type2('Bridgeport');
      rows=m?m.rows.map(r=>`[${r.type}] ${r.text.slice(0,60)}`):null;
      found=!!(m&&m.rows.some(r=>r.type==='customers'&&/Bridgeport/i.test(r.text))); }
    await shot(`C55674-${label}`);
    out[label]={reachedBy:how, modalOpened:opened, customerFound:found, rows};
    await closeModal(); }
  await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(1500);
  return out;});

// ---------------------------------------------------------------- C45158 no feature flag
await run(45158,'Global search is available with no feature-flag toggle',async()=>{
  await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(4000);
  const present=await page.evaluate(()=>{const b=document.querySelector('[data-test-id="global_search_trigger"]');
    if(!b) return false; const r=b.getBoundingClientRect(); return r.width>2&&r.height>2;});
  await openModal(); const m=await type2('Bridgeport');
  await shot('C45158-search-works-unconfigured');
  return {triggerPresentOnLoad:present, searchReturnedRows:m?m.rows.length:null,
    note:'no setting was enabled or changed in this session before this check'};});

// ---------------------------------------------------------------- C45153 each row opens its record
await run(45153,'Selecting each result type opens the right record',async()=>{
  const probes=[
    ['work_orders','Bridgeport'], ['customers','Bridgeport'], ['assets','ZZT-4471'],
    ['parts','ZZT-88-4412'], ['vendors','ZZAUTOTEST Kestrel'], ['purchase_orders','Marlene'],
    ['parts','ZZT-77-3300'],   // the catalogue-only part -- THE POINT of this case
    ['parts','Vernway'],       // the case's own fallback when the part number returns nothing
  ];
  const out=[];
  for(const [type,q] of probes){
    await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(3500);
    await openModal(); const m=await type2(q);
    const row=m&&m.rows.find(r=>r.type===type);
    if(!row){ out.push({type, query:q, rowFound:false, tabs:m&&m.tabs}); continue; }
    const before=page.url();
    await page.evaluate((tid)=>{const e=document.querySelector(`[data-test-id="${tid}"]`); e&&e.click();}, row.tid);
    await page.waitForTimeout(6000);
    const after=page.url();
    const heading=await page.evaluate(()=>{const h=document.querySelector('h1,h2,[class*=title]');
      return h?(h.innerText||'').replace(/\s+/g,' ').trim().slice(0,120):null;});
    await shot(`C45153-${type}-${q.replace(/[^A-Za-z0-9]/g,'')}`);
    out.push({type, query:q, rowFound:true, rowText:row.text.slice(0,90),
      urlBefore:before.replace(APP,''), urlAfter:after.replace(APP,''),
      navigated:before!==after, heading});
  }
  return {probes:out};});

// ---------------------------------------------------------------- C45160 analytics event
await run(45160,'Selecting a result records a usage analytics event',async()=>{
  const seen=[];
  const h=r=>{const u=r.url(); if(/analytic|telemetry|event|track|mixpanel|segment|amplitude|usage/i.test(u))
    seen.push(`${r.method()} ${u.slice(0,160)}`);};
  page.on('request',h);
  await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(3500);
  const baseline=seen.length;
  await openModal(); const m=await type2('Bridgeport');
  const row=m&&m.rows.find(r=>r.type==='customers');
  const anyRequest=[];                         // control: prove SOME request is captured at all
  const h2=r=>anyRequest.push(r.url().slice(0,80)); page.on('request',h2);
  if(row) await page.evaluate((tid)=>{const e=document.querySelector(`[data-test-id="${tid}"]`); e&&e.click();}, row.tid);
  await page.waitForTimeout(7000);
  page.off('request',h); page.off('request',h2);
  await shot('C45160-after-selecting-a-result');
  return {rowClicked:!!row, analyticsBefore:baseline, analyticsAfter:seen.length,
    analyticsRequests:seen.slice(0,10), requestsCapturedAtAll:anyRequest.length,
    note:anyRequest.length?'the listener demonstrably captured traffic during the click':
      'NO traffic captured during the click -- the listener, not the app, is what this proves'};});

// ---------------------------------------------------------------- C45154 re-selecting current record
await run(45154,'Selecting the record you are already on does not re-navigate',async()=>{
  // control first: a DIFFERENT record must navigate, or "did not navigate" proves nothing
  await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(3500);
  await openModal(); let m=await type2('Bridgeport');
  const cust=m&&m.rows.find(r=>r.type==='customers');
  if(!cust) return {control:'could not find the customer row to open -- nothing concluded'};
  const u0=page.url();
  await page.evaluate(t=>{const e=document.querySelector(`[data-test-id="${t}"]`); e&&e.click();},cust.tid);
  await page.waitForTimeout(6000);
  const uOnRecord=page.url();
  const controlNavigated=u0!==uOnRecord;
  // now select the SAME record while already on it
  await openModal(); m=await type2('Bridgeport');
  const same=m&&m.rows.find(r=>r.type==='customers');
  let reloaded=null, uAfter=null;
  if(same){ await page.evaluate(()=>{window.__navMark=Date.now();});
    await page.evaluate(t=>{const e=document.querySelector(`[data-test-id="${t}"]`); e&&e.click();},same.tid);
    await page.waitForTimeout(6000);
    uAfter=page.url();
    reloaded=await page.evaluate(()=>typeof window.__navMark==='undefined'); }
  // and whether it was pushed back to the top of recent activity
  await openModal(); await page.fill('[data-test-id="search_modal_input"]',''); await page.waitForTimeout(3500);
  const recent=await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!d) return null;
    return [...d.querySelectorAll('[data-test-id^="search_result_row_"]')].slice(0,6)
      .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,70));});
  await shot('C45154-recent-after-reselect');
  return {controlNavigated, urlOnRecord:uOnRecord.replace(APP,''),
    urlAfterReselect:uAfter&&uAfter.replace(APP,''),
    sameRecordReselected:!!same, pageReloaded:reloaded,
    didNotReNavigate:uAfter===uOnRecord && reloaded===false, recentActivityTop:recent};});

// ---------------------------------------------------------------- C53586 new customer findable
await run(53586,'A newly created customer is findable within 30 seconds',async()=>{
  // This case CANNOT be run by searching alone. The query pass typed a name and read whatever
  // happened to match -- but nothing by that name had been created, so the reading said nothing
  // about the 30-second index window. Create the record, then time it. Rule 14: seed the state.
  const name=`ZZAUTOTEST Halloway Freight ${Date.now().toString().slice(-6)}`;
  const c=await api('/api/customers/create','POST',{name, address:'12 Halloway Bend', city:'Fernvale',
    state_or_province:'Ohio', postal_code:'44872-9931', phone:'(419) 555-0177', country_code:'US',
    email:'ops@halloway-zzt.com'});
  if(!(c.status>=200&&c.status<300)) return {created:false, status:c.status, head:c.head,
    note:'the customer could not be created, so the 30-second window was never tested'};
  const t0=Date.now(); let foundAfter=null, last=null;
  for(let i=0;i<8;i++){                      // poll to 40s: the case allows 30 and says so
    await openModal(); const m=await type2(name);
    last=m&&m.rows.map(r=>`[${r.type}] ${r.text.slice(0,60)}`);
    if(m&&m.rows.some(r=>r.type==='customers'&&r.text.includes('Halloway'))){
      foundAfter=Math.round((Date.now()-t0)/1000); break; }
    await closeModal(); await page.waitForTimeout(5000);
  }
  await shot('C53586-new-customer');
  // and it should also show under recent activity, because creating counts as viewing
  await openModal(); await page.fill('[data-test-id="search_modal_input"]',''); await page.waitForTimeout(3500);
  const recent=await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!d) return null;
    return [...d.querySelectorAll('[data-test-id^="search_result_row_"]')].slice(0,8)
      .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,70));});
  return {created:true, name, foundAfterSeconds:foundAfter,
    withinThirty: foundAfter!==null && foundAfter<=30, rowsAtEnd:last,
    recentActivityTop:recent,
    inRecentActivity: !!(recent&&recent.some(r=>r.includes('Halloway')))};});

// ---------------------------------------------------------------- C53588 recency ranking
await run(53588,'More recent work orders rank above older ones of equal relevance',async()=>{
  // Ranking cannot be judged from the order alone -- it has to be compared against the thing the
  // order is supposed to reflect. Read each matching work order's own updated timestamp and status,
  // then say whether the displayed order is consistent with "more recently updated first among
  // equals". The Expected explicitly warns NOT to demand strict newest-first.
  await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(3500);
  await openModal(); const m=await type2('Bridgeport');
  const shown=(m?m.rows:[]).filter(r=>r.type==='work_orders').map(r=>r.text);
  const numbers=shown.map(t=>(t.match(/S\d*-?\d+/)||[])[0]).filter(Boolean);
  const live=JSON.parse(fs.readFileSync('/home/user/Manual-test-Cases/build/global-search/seeding/seed-state-live.json','utf8'));
  const details=[];
  for(const id of (live.live_ids.work_orders||[])){
    const r=await api(`/api/work-orders/view/${id}`);
    const d=r.json&&(r.json.data||r.json); const w=(d&&(d.work_order||d))||{};
    details.push({id, number:w.number, status:w.status&&(w.status.name||w.status),
      updated:w.updated_at||w.updatedAt||null, created:w.created_at||w.createdAt||null}); }
  await shot('C53588-ranking');
  return {displayedOrder:numbers, displayedRows:shown, workOrders:details,
    note:'judge the displayed order against these timestamps and statuses, not against a date sort'};});

console.log('SPECIAL PASS DONE');
await browser.close();

// typing helper declared after use above is hoisted only for function declarations, so define it here
function type2(q){ return (async()=>{ const s='[data-test-id="search_modal_input"]';
  await page.fill(s,''); await page.type(s,q,{delay:35});
  // select All explicitly -- the modal remembers the last scope tab across open/close (L0082)
  await settle();
  await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop();
    const t=d&&d.querySelector('[data-test-id="search_modal_tab_all"]'); t&&t.click();});
  await page.waitForTimeout(2000);
  return settle(); })(); }
