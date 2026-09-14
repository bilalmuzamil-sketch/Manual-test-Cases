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
let COMPLETE=false;
const save=()=>fs.writeFileSync(STATE,JSON.stringify({...R, complete:COMPLETE},null,1));
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
    const sig=JSON.stringify(m);
    // Settle on the counts where a tab strip exists, and on the ROWS where it does not. At tablet and
    // phone widths the strip may not render its counts at all, and insisting on them made the reading
    // time out and come back null -- which then read as "the customer cannot be found on a phone".
    const ready=Object.values(m.tabs).some(v=>v!==null) || m.rows.length>0 || m.settledEmpty;
    if(ready&&sig===last){ if(++st>=3&&Date.now()-t0>=min) return m; } else st=0;
    last=sig; }
  return await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!d) return null;
    const tabs={}; d.querySelectorAll('[data-test-id^="search_modal_tab_"]').forEach(e=>{
      const t=(e.innerText||'').match(/\((\d+)\)/); tabs[e.getAttribute('data-test-id').replace('search_modal_tab_','')]=t?+t[1]:null;});
    return {tabs, timedOut:true,
      rows:[...d.querySelectorAll('[data-test-id^="search_result_row_"]')].map(e=>({
        tid:e.getAttribute('data-test-id'), type:e.getAttribute('data-test-id').replace('search_result_row_','').replace(/_\d+$/,''),
        text:(e.innerText||'').replace(/\s+/g,' ').trim()}))};}); };
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
      found=!!(m&&m.rows.some(r=>r.type==='customers'&&/Bridgeport/i.test(r.text)));
      out[label+'_readingTimedOut']=!!(m&&m.timedOut);
      out[label+'_tabStripCounts']=m&&m.tabs; }
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
  // Capture the BODY too. Selecting a result also navigates, so a page-view event fires either way;
  // the URL alone cannot tell a search-usage event from the navigation that follows it. GA4 puts the
  // event name in `en=`, so read it rather than infer the verdict from the fact that something fired.
  const h=r=>{const u=r.url(); if(/analytic|telemetry|event|track|mixpanel|segment|amplitude|usage/i.test(u)){
    let body=''; let unreadable=false;
    try{ body=r.postData()||''; }catch(e){}
    if(!body){ try{ const b=r.postDataBuffer&&r.postDataBuffer(); if(b) body=b.toString('utf8'); }catch(e){} }
    if(!body && r.method()==='POST') unreadable=true;   // sendBeacon bodies can be unreadable
    // GA puts the event name in `en=`, in the BODY for POST and sometimes in the URL query.
    const hay=body+'\n'+u;
    const names=[...String(hay).matchAll(/(?:^|&|\n|\?)en=([^&\n]+)/g)].map(m=>decodeURIComponent(m[1]));
    seen.push({call:`${r.method()} ${u.slice(0,110)}`, events:names, bodyUnreadable:unreadable,
      body:String(body).slice(0,400)});}};
  page.on('request',h);
  // Two analytics posts came back with bodies the request listener could not read (sendBeacon).
  // Intercepting the route gives the body reliably, so the verdict rests on what was actually sent
  // rather than on "some traffic happened". Every request is continued untouched.
  const routed=[];
  await page.route(/google-analytics|analytics|telemetry|collect/i, async (route,req)=>{
    let body=''; try{ body=req.postData()||''; }catch(e){}
    if(!body){ try{ const b=req.postDataBuffer&&req.postDataBuffer(); if(b) body=b.toString('utf8'); }catch(e){} }
    routed.push({url:req.url().slice(0,120), method:req.method(), body:String(body).slice(0,900)});
    await route.continue();
  }).catch(()=>{});
  await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(3500);
  const baseline=seen.length; const routedBaseline=routed.length;
  await openModal(); const m=await type2('Bridgeport');
  const row=m&&m.rows.find(r=>r.type==='customers');
  const anyRequest=[];                         // control: prove SOME request is captured at all
  const h2=r=>anyRequest.push(r.url().slice(0,80)); page.on('request',h2);
  if(row) await page.evaluate((tid)=>{const e=document.querySelector(`[data-test-id="${tid}"]`); e&&e.click();}, row.tid);
  await page.waitForTimeout(7000);
  page.off('request',h); page.off('request',h2);
  await shot('C45160-after-selecting-a-result');
  await page.unroute(/google-analytics|analytics|telemetry|collect/i).catch(()=>{});
  const routedAfterClick=routed.slice(routedBaseline);
  const routedEvents=[...new Set(routedAfterClick.flatMap(r=>
    [...String(r.body).matchAll(/(?:^|&|\n)en=([^&\n]+)/g)].map(m=>decodeURIComponent(m[1]))))];
  const eventNames=[...new Set([...seen.flatMap(x=>x.events||[]), ...routedEvents])];
  const unreadable=routedAfterClick.filter(r=>!r.body&&r.method==='POST').length;
  return {rowClicked:!!row, analyticsBefore:baseline, analyticsAfter:seen.length,
    eventNames, searchEventSeen:eventNames.some(n=>/search/i.test(n)),
    // An unreadable body is a THIRD outcome -- not "no search event". Say so rather than conclude.
    postsWithUnreadableBody:unreadable,
    conclusive: unreadable===0,
    interceptedAfterClick:routedAfterClick.length,
    interceptedBodies:routedAfterClick.map(r=>r.body.slice(0,300)),
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
  // capture the recent list BEFORE re-selecting: "was it re-added to the top" cannot be answered
  // from an after-shot alone, because opening it the first time legitimately puts it there.
  await page.waitForTimeout(6000);
  const uOnRecord=page.url();
  const controlNavigated=u0!==uOnRecord;
  const readRecent=async()=>{ await openModal();
    await page.fill('[data-test-id="search_modal_input"]',''); await page.waitForTimeout(3500);
    return page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
      const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!d) return null;
      return [...d.querySelectorAll('[data-test-id^="search_result_row_"]')].slice(0,8)
        .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,70));});};
  const recentBefore=await readRecent(); await closeModal();
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
  const recent=await readRecent();
  await shot('C45154-recent-after-reselect');
  return {controlNavigated, urlOnRecord:uOnRecord.replace(APP,''),
    urlAfterReselect:uAfter&&uAfter.replace(APP,''),
    sameRecordReselected:!!same, pageReloaded:reloaded,
    didNotReNavigate:uAfter===uOnRecord && reloaded===false,
    recentBefore, recentAfter:recent,
    recentUnchanged: JSON.stringify(recentBefore)===JSON.stringify(recent)};});

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
    // Dump every scalar field rather than guessing the timestamp key: updated_at/updatedAt both came
    // back null, which means the field is named something else here -- and a null I guessed my way
    // into looks exactly like a record with no history. Keep the whole set and pick in judging.
    const scal=Object.fromEntries(Object.entries(w).filter(([k,v])=>
      v===null||['string','number','boolean'].includes(typeof v)));
    const timeKeys=Object.fromEntries(Object.entries(scal).filter(([k])=>/updat|modif|creat|date|time/i.test(k)));
    details.push({id, number:w.number, status:w.status&&(w.status.name||w.status),
      timeFields:timeKeys, allFieldNames:Object.keys(w)}); }
  await shot('C53588-ranking');
  return {displayedOrder:numbers, displayedRows:shown, workOrders:details,
    note:'judge the displayed order against these timestamps and statuses, not against a date sort'};});

// ---------------------------------------------------------------- C55673 Enter opens the top result
await run(55673,'Pressing Enter opens the top result without arrowing to it',async()=>{
  // Typing and reading the rows says nothing about what Enter does. Type, press Enter once, and see
  // whether the record opened -- with a control that the top row is the one it opened.
  await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(3500);
  await openModal(); const m=await type2('Bridgeport');
  const top=(m&&m.rows[0])||null;
  const before=page.url();
  // What counts as "highlighted" must be read from the app, not guessed from a class-name substring.
  // The loose match found a row four down the list, which would have made Enter look like it opens
  // the wrong record. Capture the input's aria-activedescendant (the authoritative answer where the
  // app sets it) alongside every row's classes, so the verdict rests on evidence.
  const highlightInfo=await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!d) return null;
    const input=d.querySelector('[data-test-id="search_modal_input"]');
    const rows=[...d.querySelectorAll('[data-test-id^="search_result_row_"]')].map(e=>({
      tid:e.getAttribute('data-test-id'), id:e.id||null,
      cls:(''+(e.className||'')).slice(0,90),
      ariaSelected:e.getAttribute('aria-selected'),
      text:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,45)}));
    return {activeDescendant: input?input.getAttribute('aria-activedescendant'):null,
      firstRow: rows[0]||null,
      rowsWithAriaSelected: rows.filter(r=>r.ariaSelected==='true').map(r=>r.tid),
      // which class token actually varies between rows -- that is the real highlight marker
      distinctClassSets:[...new Set(rows.map(r=>r.cls))].slice(0,4),
      rows: rows.slice(0,10)};});
  const highlighted=highlightInfo&&(highlightInfo.activeDescendant||
    (highlightInfo.rowsWithAriaSelected||[])[0]||null);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(6000);
  const after=page.url();
  await shot('C55673-after-enter');
  return {topRow:top&&top.text, topRowType:top&&top.type, highlightedBeforeEnter:highlighted,
    highlightEvidence:highlightInfo,
    openedTheTopRow: !!(top && after!==before && highlightInfo && highlightInfo.firstRow
      && highlightInfo.firstRow.text && top.text.startsWith(highlightInfo.firstRow.text.slice(0,20))),
    urlBefore:before.replace(APP,''), urlAfter:after.replace(APP,''), navigated:before!==after,
    modalStillOpen:await modalOpen()};});

// ---------------------------------------------------------------- C55680 arrows skip the headings
await run(55680,'Arrow keys move between results and skip the group headings',async()=>{
  await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(3500);
  await openModal(); const m=await type2('ZZAUTOTEST');
  const readHighlight=async()=>page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!d) return null;
    const cand=[...d.querySelectorAll('[data-test-id^="search_result_row_"],[data-test-id^="search_group_header_"]')];
    const h=cand.find(e=>/active|selected|highlight/i.test(e.className)||e.getAttribute('aria-selected')==='true');
    return h?{tid:h.getAttribute('data-test-id'), text:(h.innerText||'').replace(/\s+/g,' ').trim().slice(0,50)}:null;});
  const down=[]; for(let i=0;i<12;i++){ await page.keyboard.press('ArrowDown'); await page.waitForTimeout(400);
    down.push(await readHighlight()); }
  const up=[]; for(let i=0;i<6;i++){ await page.keyboard.press('ArrowUp'); await page.waitForTimeout(400);
    up.push(await readHighlight()); }
  await shot('C55680-arrowing');
  const headers=[...down,...up].filter(x=>x&&/^search_group_header_/.test(x.tid));
  return {rowsPresent:m?m.rows.length:0, goingDown:down, comingBack:up,
    // the control: if NOTHING was ever highlighted, this says nothing about headings
    anyHighlightSeen:[...down,...up].some(Boolean),
    headingsEverHighlighted:headers.map(h=>h.tid)};});

// ---------------------------------------------------------------- C55682 a type icon on every row
await run(55682,'Each result row shows an icon telling you what kind of record it is',async()=>{
  await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(3500);
  await openModal(); await type2('ZZAUTOTEST');
  const rows=await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!d) return null;
    return [...d.querySelectorAll('[data-test-id^="search_result_row_"]')].map(e=>{
      const ic=e.querySelector('svg,i,img,[class*=icon]');
      const cls=ic?((ic.className&&ic.className.baseVal!==undefined?ic.className.baseVal:''+ic.className)||''):'';
      const use=ic?ic.querySelector&&ic.querySelector('use'):null;
      // Every row's icon carries the SAME generic class, so the class cannot answer "does the icon
      // differ by type". The picture itself is in the SVG's shapes -- take those as the identity.
      let shape=null;
      if(ic&&ic.tagName&&ic.tagName.toLowerCase()==='svg'){
        shape=[...ic.querySelectorAll('path,circle,rect,line,polyline,polygon')]
          .map(n=>n.tagName.toLowerCase()+':'+((n.getAttribute('d')||n.getAttribute('points')||
            [n.getAttribute('cx'),n.getAttribute('cy'),n.getAttribute('r'),
             n.getAttribute('x'),n.getAttribute('y')].filter(Boolean).join(',')||'')).slice(0,60))
          .join('|').slice(0,240);
      } else if(ic){ shape=(ic.getAttribute('src')||ic.textContent||'').slice(0,120); }
      return {type:e.getAttribute('data-test-id').replace('search_result_row_','').replace(/_\d+$/,''),
        hasIcon:!!ic, iconClass:cls.slice(0,80),
        iconShape:shape,
        iconRef:use?(use.getAttribute('href')||use.getAttribute('xlink:href')||''):null,
        iconName:ic?(ic.getAttribute('data-icon')||ic.getAttribute('aria-label')||ic.getAttribute('name')||null):null};});});
  await shot('C55682-row-icons');
  const ident=r=>r.iconShape||r.iconRef||r.iconName||r.iconClass;
  const byType={}; (rows||[]).forEach(r=>{ (byType[r.type]=byType[r.type]||new Set()).add(ident(r)); });
  const perType=Object.fromEntries(Object.entries(byType).map(([k,v])=>[k,[...v]]));
  const oneEach=Object.entries(perType).filter(([k,v])=>v.length===1).map(([k,v])=>[k,v[0]]);
  return {rows:(rows||[]).map(r=>({type:r.type,hasIcon:r.hasIcon,icon:(ident(r)||'').slice(0,60)})),
    everyRowHasAnIcon:(rows||[]).length>0&&(rows||[]).every(r=>r.hasIcon),
    typesSeen:Object.keys(perType),
    eachTypeUsesOneIcon: oneEach.length===Object.keys(perType).length,
    distinctIconsAcrossTypes:[...new Set(oneEach.map(([k,v])=>v))].length,
    iconsDifferByType: [...new Set(oneEach.map(([k,v])=>v))].length===oneEach.length,
    iconPerType:perType};});

// ---------------------------------------------------------------- C55679 recents after a no-match
await run(55679,'Your recent items come back when a search finds nothing',async()=>{
  await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(3500);
  await openModal();
  // control: with an EMPTY box the recent list must be there, or "it did not come back" means nothing
  await page.fill('[data-test-id="search_modal_input"]',''); await page.waitForTimeout(3500);
  const readRows=async()=>page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!d) return null;
    return {rows:[...d.querySelectorAll('[data-test-id^="search_result_row_"]')].map(e=>
        (e.innerText||'').replace(/\s+/g,' ').trim().slice(0,60)),
      text:(d.innerText||'').replace(/\s+/g,' ').slice(0,300)};});
  const emptyBox=await readRows();
  await page.type('[data-test-id="search_modal_input"]','ZZNOSUCHRECORD9999',{delay:35});
  await page.waitForTimeout(8000);
  const noMatch=await readRows();
  await shot('C55679-no-match');
  return {recentShownWithEmptyBox:emptyBox&&emptyBox.rows.length,
    rowsAfterNoMatch:noMatch&&noMatch.rows.length, messageAfterNoMatch:noMatch&&noMatch.text,
    recentsCameBack:!!(noMatch&&noMatch.rows.length>0)};});

// ---------------------------------------------------------------- C53587 new job findable in 30s
await run(53587,'A new work order or part sale is findable within 30 seconds',async()=>{
  // Create a real job for the seeded customer and time how long until search returns it. The part
  // sale half cannot be run: part sales cannot be created on this branch (SV-10031).
  const live=JSON.parse(fs.readFileSync('/home/user/Manual-test-Cases/build/global-search/seeding/seed-state-live.json','utf8')).live_ids;
  const c=await api('/api/work-orders/create','POST',
    {is_vehicle_here:false, company_id:live.customer, vehicle_id:live.asset});
  const d=c.json&&(c.json.data||c.json); let wo=(d&&(d.work_order||d))||{};
  // The create answered 201 and the job really was made -- it turned up in another case's results
  // minutes later -- but `number` was not where this looked for it, so the case reported "could not
  // create" and skipped the very thing it exists to measure. Dig for the number, and if it still
  // cannot be found, fall back to the id and say plainly which was used.
  const findNum=(o,depth=0)=>{ if(!o||typeof o!=='object'||depth>4) return null;
    for(const [k,v] of Object.entries(o)){
      if(/^number$/i.test(k) && (typeof v==='string'||typeof v==='number')) return String(v);
      if(typeof v==='object'){ const r=findNum(v,depth+1); if(r) return r; } }
    return null; };
  const number=findNum(c.json)||findNum(wo);
  if(!(c.status>=200&&c.status<300))
    return {created:false, status:c.status, head:c.head,
      note:'the job could not be created, so the 30-second window was never tested'};
  if(!number)
    return {created:true, status:c.status, numberFound:false, responseHead:c.head,
      note:'the job was created but its number could not be read from the response, so the window was not timed'};
  const bare=(number.match(/(\d+)\s*$/)||[])[1]||number;   // people type the bare number
  const t0=Date.now(); let foundAfter=null, lastRows=null;
  for(let i=0;i<8;i++){
    await openModal(); const m=await type2(bare);
    lastRows=m&&m.rows.map(r=>`[${r.type}] ${r.text.slice(0,60)}`);
    if(m&&m.rows.some(r=>r.type==='work_orders'&&r.text.includes(bare))){
      foundAfter=Math.round((Date.now()-t0)/1000); break; }
    await closeModal(); await page.waitForTimeout(5000);
  }
  await shot('C53587-new-work-order');
  return {created:true, number, searched:bare, id:wo.id,
    foundAfterSeconds:foundAfter, withinThirty:foundAfter!==null&&foundAfter<=30,
    rowsAtEnd:lastRows,
    partSaleHalf:'not run - part sales cannot be created on this branch (SV-10031)'};});

// ---------------------------------------------------------------- C45152 switching location
await run(45152,'Switching location refreshes results to the new location',async()=>{
  // Jobs and part sales belong to a location. Search at one, switch, search again, and compare.
  // The control is that the FIRST location returns jobs at all -- otherwise "the second shows
  // different jobs" is just two empty lists.
  const wps=await api('/api/staff/my-workplaces');
  const dd=(wps.json&&(wps.json.data!==undefined?wps.json.data:wps.json))||[];
  const list=Array.isArray(dd)?dd:(dd.workplaces||dd.collection||[]);
  if(list.length<2) return {note:`only ${list.length} location available to this user - the case needs two`,
    locations:list.map(x=>x.name)};
  const A=list.find(x=>/heavy duty/i.test(x.name||''))||list[0];
  const B=list.find(x=>x.id!==A.id);
  // Which location does the APP think it is on? Changing it through the back end is not proof the
  // screen followed -- and "the results did not change" means nothing if the location never did.
  const shownLocation=async()=>page.evaluate(()=>{
    let loc=null; try{ loc=JSON.parse(localStorage.getItem('location')||'null'); }catch(e){}
    const name=loc&&(loc.name||(loc.data&&loc.data.name))||null;
    const header=(document.body.innerText||'').match(/Staging [A-Za-z ]+- ?\d+/);
    return {fromStorage:name, onScreen:header?header[0]:null};});
  const searchJobs=async(label)=>{
    await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(4000);
    const where=await shownLocation();
    await openModal(); const m=await type2('Bridgeport');
    await shot(`C45152-${label}`);
    return {appThinksItIsOn:where, tabs:m&&m.tabs,
      jobs:(m?m.rows:[]).filter(r=>r.type==='work_orders').map(r=>r.text.slice(0,60)),
      partSales:(m?m.rows:[]).filter(r=>r.type==='part_sales').map(r=>r.text.slice(0,60))};};
  await api('/api/iam/change-location','POST',{workplace_id:A.id, workplace_timezone:A.timezone||'America/Edmonton'});
  const at1=await searchJobs('location1');
  await closeModal();
  const sw=await api('/api/iam/change-location','POST',{workplace_id:B.id, workplace_timezone:B.timezone||'America/Edmonton'});
  const at2=await searchJobs('location2');
  await closeModal();
  // put it back where the rest of the pass expects it
  await api('/api/iam/change-location','POST',{workplace_id:A.id, workplace_timezone:A.timezone||'America/Edmonton'});
  const locationReallyChanged = JSON.stringify(at1.appThinksItIsOn)!==JSON.stringify(at2.appThinksItIsOn);
  return {location1:{name:A.name, ...at1}, location2:{name:B.name, switchStatus:sw.status, ...at2},
    firstLocationHadJobs:at1.jobs.length>0,
    locationReallyChanged,
    jobsChanged:JSON.stringify(at1.jobs)!==JSON.stringify(at2.jobs),
    // Without BOTH controls -- the first location had jobs, and the app actually moved -- an
    // unchanged result list says nothing about whether search respects the location.
    conclusive: at1.jobs.length>0 && locationReallyChanged,
    restoredTo:A.name};});

// ---------------------------------------------------------------- C53589 typing is never lost
await run(53589,'Typing is never lost while search results are loading',async()=>{
  // Carried as role-gated, but nothing about it needs a role: it is about the input box keeping
  // every character while a search is in flight. Type fast, keep typing while results arrive, then
  // compare the box against what was meant to be typed and the results against the box.
  await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(3500);
  await openModal();
  const sel='[data-test-id="search_modal_input"]';
  await page.fill(sel,'');
  const first='Bridgeport', rest=' Hauling';
  await page.type(sel,first,{delay:15});          // fast, no pause
  const boxRightAfterFirst=await page.$eval(sel,e=>e.value);
  // keep typing immediately, without waiting for the first search to come back
  await page.type(sel,rest,{delay:15});
  const boxRightAfterRest=await page.$eval(sel,e=>e.value);
  // did it ever look broken while fetching?
  const midFlight=await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop();
    return d?{text:(d.innerText||'').replace(/\s+/g,' ').slice(0,160),
      spinner:!!d.querySelector('.q-spinner,[class*=spinner],[class*=loading]'),
      looksBroken:/error|unavailable|oooops/i.test(d.innerText||'')}:null;});
  const settled=await settle(6000);
  const boxAtEnd=await page.$eval(sel,e=>e.value);
  await shot('C53589-typing-not-lost');
  const wanted=first+rest;
  return {wanted, boxAfterFirstBurst:boxRightAfterFirst, boxAfterSecondBurst:boxRightAfterRest,
    boxAtEnd, everyCharacterKept: boxAtEnd===wanted,
    midFlight,
    // the results must match the FULL text, not the half-typed version
    rowsAtEnd:(settled?settled.rows:[]).map(r=>`[${r.type}] ${r.text.slice(0,60)}`),
    resultsMatchFullText: !!(settled&&settled.rows.some(r=>/Bridgeport Hauling/i.test(r.text))),
    settledAtAll: !!settled};});

// ---------------------------------------------------------------- C45150 no other organisation
await run(45150,"Results never include another organization's records",async()=>{
  // One signed-in user belongs to one organisation, so what this can establish honestly is whether
  // anything OUTSIDE this organisation's own records ever appears. Compare what search returns
  // against what the organisation's own lists hold.
  await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(3500);
  await openModal(); const m=await type2('ZZAUTOTEST');
  const rows=(m?m.rows:[]).map(r=>({type:r.type,text:r.text}));
  // cross-check each customer row against this organisation's own customer list
  const cust=await api('/api/customers?search=ZZAUTOTEST&limit=50');
  const cd=cust.json&&(cust.json.data||cust.json);
  const clist=(Array.isArray(cd)?cd:((cd&&(cd.collection||cd.customers))||[])).map(x=>x.name);
  const shownCustomers=rows.filter(r=>r.type==='customers').map(r=>r.text);
  const notInOwnList=shownCustomers.filter(t=>!clist.some(n=>n&&t.includes(n)));
  await shot('C45150-one-organisation');
  return {rowsShown:rows.length, customersShown:shownCustomers,
    ownCustomerListSize:clist.length,
    customersNotInThisOrganisationsOwnList:notInOwnList,
    note:'a single signed-in user belongs to one organisation, so this shows whether anything outside its own records appears; it cannot prove what a second organisation would see'};});

COMPLETE=true; save();
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
