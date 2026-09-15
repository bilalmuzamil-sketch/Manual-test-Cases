// The three regression cases in run 415 that were never executed (C55685, C55686, C55684).
//
// They were missed because the pass scoped itself from a snapshot file instead of from the run
// itself. The run is the system of record; the snapshot was not. See UNRUN-REGRESSION-CASES.md.
//
// Each check carries its own positive control (Rule 104):
//   C55685  the query must return SOMETHING, and the exact record must be among it, before
//           "these other rows do not contain what I typed" means anything.
//   C55686  the pointer is PARKED and the parking is VERIFIED before Enter, because hovering a row
//           silently re-targets Enter on this build (SV-10061) and would make the reading a
//           measurement of my own mouse.
//   C55684  the first location must return jobs, and the app must actually move location, before a
//           second, different list says anything at all.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV=`${DIR}/unrun3-evidence`; fs.mkdirSync(EV,{recursive:true});
const STATE=`${DIR}/UNRUN3-RESULTS.json`;
const R=fs.existsSync(STATE)?JSON.parse(fs.readFileSync(STATE,'utf8')):{at:new Date().toISOString(),cases:{}};
const save=()=>fs.writeFileSync(STATE,JSON.stringify(R,null,1));
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const ONLY=process.env.ONLY?new Set(process.env.ONLY.split(',').map(s=>s.replace(/^C/,''))):null;
const want=id=>!ONLY||ONLY.has(String(id));

const { browser, page, APIH, APP } = await boot('sv9160','/','admin');
const api=async(path,method='GET',body=null)=>page.evaluate(async([u,m,b])=>{
  try{ const r=await fetch(u,{method:m, headers:{'Accept':'application/json','Content-Type':'application/json'},
        credentials:'include', body:b?JSON.stringify(b):undefined});
    const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){}
    return {status:r.status, json:j, body:t.slice(0,400)};
  }catch(e){ return {error:String(e).slice(0,120)}; }},[`https://${APIH}${path}`,method,body]);

// pin the location the seeded records live in -- jobs are scoped to the workplace
const wps=await api('/api/staff/my-workplaces');
const WPS=(()=>{ const d=(wps.json&&(wps.json.data!==undefined?wps.json.data:wps.json))||[];
  return Array.isArray(d)?d:(d.workplaces||d.collection||[]); })();
const HD=WPS.find(x=>/heavy duty/i.test(x.name||''))||WPS[0];
if(HD) await api('/api/iam/change-location','POST',{workplace_id:HD.id, workplace_timezone:HD.timezone||'America/Edmonton'});
R.locations=WPS.map(x=>({id:x.id,name:x.name})); save();
await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(5000);

const READ=()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!d) return null;
  const tabs={}; d.querySelectorAll('[data-test-id^="search_modal_tab_"]').forEach(e=>{
    const t=(e.innerText||'').match(/\((\d+)\)/); tabs[e.getAttribute('data-test-id').replace('search_modal_tab_','')]=t?+t[1]:null;});
  return {tabs, rows:[...d.querySelectorAll('[data-test-id^="search_result_row_"]')].map(e=>({
    tid:e.getAttribute('data-test-id'),
    type:e.getAttribute('data-test-id').replace('search_result_row_','').replace(/_\d+$/,''),
    text:(e.innerText||'').replace(/\s+/g,' ').trim()}))};};
const modalOpen=async()=>page.evaluate(()=>{const e=document.querySelector('[data-test-id="search_modal_input"]');
  if(!e) return false; const r=e.getBoundingClientRect(); return r.width>2&&r.height>2;});
const closeModal=async()=>{ for(let i=0;i<3;i++){ if(!await modalOpen()) return true;
  await page.keyboard.press('Escape'); await page.waitForTimeout(800);} return !(await modalOpen()); };
const openModal=async()=>{ await closeModal();
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id="global_search_trigger"]'); b&&b.click();});
  await page.waitForSelector('[data-test-id="search_modal_input"]',{state:'visible',timeout:20000}); };
const settle=async(min=5000)=>{ let last=null,st=0,t0=Date.now();
  for(let i=0;i<25;i++){ await page.waitForTimeout(1000);
    const m=await page.evaluate(READ); if(!m){st=0;continue;}
    const sig=JSON.stringify(m);
    const ready=Object.values(m.tabs).some(v=>v!==null)||m.rows.length>0;
    if(ready&&sig===last){ if(++st>=3&&Date.now()-t0>=min) return m; } else st=0;
    last=sig; }
  return page.evaluate(READ); };
const type2=async q=>{ const s='[data-test-id="search_modal_input"]';
  await page.fill(s,''); await page.type(s,q,{delay:35}); await settle();
  await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop();
    const t=d&&d.querySelector('[data-test-id="search_modal_tab_all"]'); t&&t.click();});
  await page.waitForTimeout(2000); return settle(); };
// PARK THE POINTER AND PROVE IT. Reading a row while the mouse rests on another one measures the
// mouse, not the build (L0117).
const park=async()=>{ await page.mouse.move(5,5); await page.waitForTimeout(400);
  return page.evaluate(()=>{const el=document.elementFromPoint(5,5);
    return {parkedOn:el?(el.tagName+'.'+(el.className||'').toString().slice(0,40)):null,
      onARow:!!(el&&el.closest&&el.closest('[data-test-id^="search_result_row_"]'))};}); };
const shot=n=>page.screenshot({path:`${EV}/${n}.png`});
const run=async(id,name,fn)=>{ const k='C'+id; if(!want(id)) return;
  try{ R.cases[k]={title:name, ...(await fn())}; }
  catch(e){ R.cases[k]={title:name, error:String(e&&e.message||e).slice(0,300)}; }
  save(); L(k, JSON.stringify(R.cases[k]).slice(0,300)); };

// ------------------------------------------------- C55685 near-spellings come back too
await run(55685,'Typing a name does not bring back other differently spelled names',async()=>{
  await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(3500);
  await openModal(); await park();
  const all=await type2('Marlene');
  await shot('C55685-all');
  // the Customers tab as well -- the case asks for it by name
  await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop();
    const t=d&&d.querySelector('[data-test-id="search_modal_tab_customers"]'); t&&t.click();});
  await page.waitForTimeout(2500);
  const cust=await settle(2000);
  await shot('C55685-customers');
  const has=t=>/marlene/i.test(t);
  const rows=(all&&all.rows)||[];
  return {
    tabs:all&&all.tabs,
    totalRows:rows.length,
    rowsContainingWhatWasTyped:rows.filter(r=>has(r.text)).map(r=>`[${r.type}] ${r.text.slice(0,70)}`),
    rowsNOTContainingIt:rows.filter(r=>!has(r.text)).map(r=>`[${r.type}] ${r.text.slice(0,70)}`),
    customersTabRows:((cust&&cust.rows)||[]).map(r=>`[${r.type}] ${r.text.slice(0,70)}`),
    // controls: the search worked at all, and the record the case names is present
    control_searchReturnedSomething: rows.length>0,
    control_exactRecordPresent: rows.some(r=>/Marlene Freight Lines/i.test(r.text)),
  };});

// ------------------------------------------------- C55686 the real match is listed first
await run(55686,'The record that actually matches what you typed is listed first',async()=>{
  await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(3500);
  await openModal();
  const parked=await park();
  const m=await type2('Marlene');
  const parkedAgain=await park();
  const customers=((m&&m.rows)||[]).filter(r=>r.type==='customers').map(r=>r.text.replace(/\s+/g,' ').trim());
  await shot('C55686-order');
  const idxExact=customers.findIndex(t=>/Marlene Freight Lines/i.test(t));
  // Enter WITHOUT arrowing, pointer parked and the parking verified
  const urlBefore=page.url();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(6000);
  const urlAfter=page.url();
  await shot('C55686-after-enter');
  let opened=null;
  if(urlAfter!==urlBefore){
    opened=await page.evaluate(()=>((document.querySelector('h1,h2,.page-title')||{}).innerText||document.title||'').replace(/\s+/g,' ').trim().slice(0,120)); }
  return {customersInOrder:customers.map(t=>t.slice(0,70)),
    exactMatchPosition: idxExact<0?null:idxExact+1,
    exactMatchIsFirst: idxExact===0,
    pointerParkedBeforeTyping:parked, pointerParkedBeforeEnter:parkedAgain,
    urlBefore, urlAfter, navigated:urlAfter!==urlBefore, openedRecordLooksLike:opened,
    control_customersGroupHadRows: customers.length>0};});

// ------------------------------------------------- C55684 no flash of the old location's jobs
await run(55684,'After switching location you never see the old location records',async()=>{
  if(WPS.length<2) return {note:`only ${WPS.length} location is available to this user - the case needs two`};
  const A=HD, B=WPS.find(x=>x.id!==A.id);
  const shownLocation=async()=>page.evaluate(()=>{
    const header=(document.body.innerText||'').match(/Staging [A-Za-z ]+- ?\d+/);
    return header?header[0]:null;});
  await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(4000);
  await openModal(); await park();
  const at1=await type2('Bridgeport');
  const jobsAtA=((at1&&at1.rows)||[]).filter(r=>r.type==='work_orders').map(r=>r.text.slice(0,60));
  const locA=await shownLocation();
  await shot('C55684-at-heavy-duty');
  // switch through the SCREEN -- the profile menu's Change Location dropdown
  await closeModal();
  const sw={};
  sw.menu=await page.evaluate(()=>{const b=document.querySelector('[data-test-id="profile_menu_button"]');
    if(!b) return false; b.click(); return true;});
  await page.waitForTimeout(2500);
  sw.dropdown=await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const sel=[...document.querySelectorAll('.q-select,label.q-field')].filter(vis)
      .filter(e=>/Staging [A-Za-z ]+- ?\d+/.test(e.innerText||''))[0];
    if(!sel) return false; sel.click(); return true;});
  await page.waitForTimeout(3000);
  sw.picked=await page.evaluate(n=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const opt=[...document.querySelectorAll('[role=option],.q-item,li,button,div,label')].filter(vis)
      .filter(e=>(e.innerText||'').replace(/\s+/g,' ').trim().startsWith(n)&&(e.innerText||'').length<90)
      .sort((a,b)=>(a.innerText||'').length-(b.innerText||'').length)[0];
    if(!opt) return false; (opt.closest('[role=option],.q-item,li,button,label')||opt).click(); return true;}, B.name);
  await page.waitForTimeout(7000);
  if(!sw.picked){ const r=await api('/api/iam/change-location','POST',
      {workplace_id:B.id, workplace_timezone:B.timezone||'America/Edmonton'});
    sw.viaBackEnd=r.status; sw.note='the screen control could not be driven, so the location was changed behind the app';
    await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(4000); }
  const locB=await shownLocation();
  // SAMPLE WHILE IT LOADS. The case is about a FLASH, so a single reading after the list settles
  // cannot answer it -- record the rows every 120ms from the first keystroke.
  await openModal(); await park();
  await page.evaluate(()=>{ window.__samples=[];
    window.__t=setInterval(()=>{ const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
      const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!d) return;
      window.__samples.push({t:Date.now(),
        rows:[...d.querySelectorAll('[data-test-id^="search_result_row_"]')]
          .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,60))});},120); });
  const s='[data-test-id="search_modal_input"]';
  await page.fill(s,''); await page.type(s,'Bridgeport',{delay:35});
  const at2=await settle();
  const samples=await page.evaluate(()=>{ clearInterval(window.__t); return window.__samples; });
  await shot('C55684-at-second-location');
  const jobsAtB=((at2&&at2.rows)||[]).filter(r=>r.type==='work_orders').map(r=>r.text.slice(0,60));
  // a Heavy Duty job number seen at the second location, at any instant, is the flash
  const hdNumbers=[...new Set(jobsAtA.map(t=>(t.match(/S9160-\d+/)||[])[0]).filter(Boolean))];
  const flashes=samples.map((sm,i)=>({i, ms:sm.t-samples[0].t,
      hd:sm.rows.filter(r=>hdNumbers.some(n=>r.includes(n)))}))
    .filter(x=>x.hd.length);
  await closeModal();
  await api('/api/iam/change-location','POST',{workplace_id:A.id, workplace_timezone:A.timezone||'America/Edmonton'});
  return {locationA:A.name, locationB:B.name, headerAtA:locA, headerAtB:locB,
    switchedVia:sw, jobsAtA, jobsAtB, heavyDutyJobNumbers:hdNumbers,
    samplesTaken:samples.length, samplesShowingOldLocationJobs:flashes.slice(0,6),
    oldLocationJobsEverShown: flashes.length>0 || jobsAtB.some(t=>hdNumbers.some(n=>t.includes(n))),
    control_firstLocationHadJobs: jobsAtA.length>0,
    control_locationActuallyChanged: locA!==locB,
    control_sampledWhileLoading: samples.length>3,
    restoredTo:A.name};});

console.log('UNRUN3 DONE');
await browser.close();
