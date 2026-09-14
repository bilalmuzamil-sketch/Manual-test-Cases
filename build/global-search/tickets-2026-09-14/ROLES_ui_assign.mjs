// Give one spare staff member a narrower role THROUGH THE SCREEN, observe, then put it back.
//
// Behind the app this is impossible: the staff-change endpoint refuses the id every staff member is
// listed under. The screen is the seventh route and the one a person would use anyway -- the staff
// page lists everyone with their role and an edit control on each row.
//
// 🛑 SAFETY, in order:
//   · never the administrator account, never a quick-login account
//   · read the person's CURRENT role off the list first, and keep it
//   · make the change, prove it took by reading the list back
//   · observe
//   · put the role back by the SAME route, and prove THAT by reading the list back
//   · if the restore cannot be proved, say so loudly and repeatedly in the record
// The restore is the same screen operation as the change, so it is symmetric: anything that could
// make the change work can make it go back.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const STATE=`${DIR}/ROLES-UI.json`;
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const TARGET=process.env.TARGET_ROLE||'Time Clock User';
const QUERY='ZZAUTOTEST';
const R=fs.existsSync(STATE)?JSON.parse(fs.readFileSync(STATE,'utf8')):{at:new Date().toISOString()};
const save=()=>fs.writeFileSync(STATE,JSON.stringify(R,null,1));

const { browser, page, APP, APIH } = await boot('sv9160','/administration/staff','admin');
await page.waitForTimeout(7000);

// Read the staff table: name, email, role, and the row's own edit control.
const readTable=async()=>page.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  return [...document.querySelectorAll('tr')].filter(vis).map(tr=>{
    const cells=[...tr.querySelectorAll('td')].map(td=>(td.innerText||'').replace(/\s+/g,' ').trim());
    return {cells, text:(tr.innerText||'').replace(/\s+/g,' ').trim().slice(0,140)};
  }).filter(r=>r.cells.length>2);});

const roleOf=async(email)=>{ const rows=await readTable();
  const row=rows.find(r=>r.text.includes(email));
  if(!row) return null;
  // the role is the cell that names one of the known roles
  const known=/^(Admin|Technician|Foreman|Office User|Parts Manager|Parts Technician|Sales Representative|Senior Service Advisor|Service Advisor|Service Manager|Time Clock User)$/;
  return row.cells.find(c=>known.test(c))||null; };

const rows=await readTable();
R.tableRows=rows.length;
// a spare person: not the administrator account, not a quick-login account, currently a Technician
const known=/^(Admin|Technician|Foreman|Office User|Parts Manager|Parts Technician|Sales Representative|Senior Service Advisor|Service Advisor|Service Manager|Time Clock User)$/;
const candidate=rows.find(r=>{
  const email=(r.text.match(/[\w.+-]+@[\w.-]+/)||[])[0]||'';
  const role=r.cells.find(c=>known.test(c));
  return email && !/^admin@|^tech@/i.test(email) && /staging\.shopview\.local$/.test(email) && role==='Technician';});
if(!candidate){ R.abort='no spare technician row found on the staff page -- nothing was changed';
  save(); L(R.abort); await browser.close(); process.exit(2); }
const email=(candidate.text.match(/[\w.+-]+@[\w.-]+/)||[])[0];
R.subject={email, rowText:candidate.text.slice(0,110), roleBefore:candidate.cells.find(c=>known.test(c))};
save(); L('subject:', email, '| role now:', R.subject.roleBefore);

// open that person's editor via the row's edit control
const openEditor=async()=>page.evaluate((em)=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const tr=[...document.querySelectorAll('tr')].filter(vis).find(t=>(t.innerText||'').includes(em));
  if(!tr) return false;
  const btn=[...tr.querySelectorAll('button,[role=button],a,i,span')].filter(vis)
    .find(e=>/edit/i.test((e.getAttribute('data-test-id')||'')+' '+(e.innerText||'')+' '+(e.className||'')));
  if(!btn) return false; (btn.closest('button,[role=button],a')||btn).click(); return true;}, email);

const describeEditor=async()=>page.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const dlg=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop();
  const scope=dlg||document.body;
  return {isDialog:!!dlg,
    selects:[...scope.querySelectorAll('.q-select,select,label.q-field')].filter(vis)
      .map(e=>({tid:e.getAttribute('data-test-id'), cls:(''+(e.className||'')).slice(0,50),
        text:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,60),
        value:(e.querySelector('input')||{}).value||null})).slice(0,12),
    buttons:[...scope.querySelectorAll('button')].filter(vis)
      .map(e=>({tid:e.getAttribute('data-test-id'), text:(e.innerText||'').trim().slice(0,30)})).slice(0,12),
    text:(scope.innerText||'').replace(/\s+/g,' ').slice(0,300)};});

R.openedEditor=await openEditor();
await page.waitForTimeout(5000);
R.editor=await describeEditor();
await page.screenshot({path:`${DIR}/roles-evidence/ui-editor.png`}).catch(()=>{});
save();
L('editor opened:', R.openedEditor, '| dialog:', R.editor&&R.editor.isDialog,
  '| selects:', JSON.stringify((R.editor&&R.editor.selects||[]).map(s=>s.value||s.text)).slice(0,200));

if(!R.openedEditor){ R.abort='could not open that person\'s record from the staff page -- nothing was changed';
  save(); L(R.abort); await browser.close(); process.exit(2); }

// change the role control to the target, save, and prove it took
const setRole=async(name)=>{
  const opened=await page.evaluate(()=>{
    const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const dlg=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop()||document.body;
    // The role field's label is exactly "Role"; the box above it is "Job Title" and holds
    // "Automotive Technician", which a looser match grabs instead -- it is a text box, so clicking it
    // opens nothing and the run reports no options.
    const sel=[...dlg.querySelectorAll('.q-select,label.q-field')].filter(vis)
      .find(e=>/^Role\b/.test((e.innerText||'').replace(/\s+/g,' ').trim()));
    if(!sel) return false; sel.click(); return true;});
  if(!opened) return {opened:false};
  await page.waitForTimeout(2500);
  const options=await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    return [...document.querySelectorAll('[role=option],.q-item')].filter(vis)
      .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,40)).slice(0,20);});
  const picked=await page.evaluate((n)=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const o=[...document.querySelectorAll('[role=option],.q-item')].filter(vis)
      .find(e=>(e.innerText||'').replace(/\s+/g,' ').trim()===n);
    if(!o) return false; o.click(); return true;}, name);
  await page.waitForTimeout(2000);
  const saved=await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const dlg=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop()||document.body;
    const b=[...dlg.querySelectorAll('button')].filter(vis)
      .find(e=>/^(save|update|apply|confirm)\b/i.test((e.innerText||'').replace(/\s+/g,' ').trim()));
    if(!b) return false; b.click(); return true;});
  await page.waitForTimeout(7000);
  return {opened:true, options, picked, saved};
};

R.change=await setRole(TARGET);
await page.goto(APP+'/administration/staff',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(7000);
R.roleAfterChange=await roleOf(email);
R.changeLanded = R.roleAfterChange===TARGET;
save(); L('change:', JSON.stringify(R.change).slice(0,200), '| role now:', R.roleAfterChange);

if(R.changeLanded){
  // observe as that person
  const api=async(p,method='GET',body=null)=>page.evaluate(async([u,m,b])=>{
    try{ const r=await fetch(u,{method:m,headers:{Accept:'application/json','Content-Type':'application/json'},
          credentials:'include', body:b?JSON.stringify(b):undefined});
      const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){}
      return {status:r.status,json:j,body:t.slice(0,200)};
    }catch(e){ return {error:String(e).slice(0,120)}; }},[`https://${APIH}${p}`,method,body]);
  const st=await api('/api/staff?limit=200');
  const sd=st.json&&(st.json.data!==undefined?st.json.data:st.json);
  const slist=Array.isArray(sd)?sd:((sd&&(sd.collection||sd.staff))||[]);
  const person=slist.find(x=>x.email===email);
  if(person){
    const sw=await api('/api/switch-user','POST',{user_id:person.id});
    R.switch={status:sw.status, body:sw.body};
    if(sw.status>=200&&sw.status<300){
      const fe=await api('/api/auth/me/fe-permissions');
      const fd=fe.json&&(fe.json.data||fe.json); const fl=fd&&(fd.fe_permissions||fd.fePermissions);
      R.serverIdentity={templateSlug:fd&&(fd.template_slug||fd.templateSlug),
        nPerms:Array.isArray(fl)?fl.length:(fl?Object.keys(fl).length:null)};
      await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
      R.url=page.url();
      const trig=await page.evaluate(()=>{const b=document.querySelector('[data-test-id="global_search_trigger"]');
        if(!b) return false; const r=b.getBoundingClientRect(); return r.width>2&&r.height>2;});
      R.searchReachable=trig;
      if(trig){
        await page.evaluate(()=>{const b=document.querySelector('[data-test-id="global_search_trigger"]'); b&&b.click();});
        await page.waitForSelector('[data-test-id="search_modal_input"]',{state:'visible',timeout:20000}).catch(()=>{});
        await page.fill('[data-test-id="search_modal_input"]','').catch(()=>{});
        await page.type('[data-test-id="search_modal_input"]',QUERY,{delay:35}).catch(()=>{});
        let last=null,st2=0;
        for(let i=0;i<25;i++){ await page.waitForTimeout(1000);
          const m=await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
            const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!d) return null;
            const tabs={}; d.querySelectorAll('[data-test-id^="search_modal_tab_"]').forEach(e=>{
              const t=(e.innerText||'').match(/\((\d+)\)/); tabs[e.getAttribute('data-test-id').replace('search_modal_tab_','')]=t?+t[1]:null;});
            return {tabs, rows:[...d.querySelectorAll('[data-test-id^="search_result_row_"]')].map(e=>
              e.getAttribute('data-test-id').replace('search_result_row_','').replace(/_\d+$/,'')),
              noResults:/no results/i.test(d.innerText||''),
              countLine:(()=>{const c=d.querySelector('[data-test-id="search_modal_result_count"]');
                return c?(c.innerText||'').trim():null;})()};});
          if(!m){st2=0;continue;}
          const sig=JSON.stringify(m);
          if(sig===last){ if(++st2>=3){ R.search=m; break; } } else st2=0; last=sig; }
        R.typesShown=R.search?[...new Set(R.search.rows||[])]:null;
        await page.screenshot({path:`${DIR}/roles-evidence/ui-${TARGET.replace(/\s+/g,'-')}.png`}).catch(()=>{});
      }
    }
  }
  save();
}

// PUT IT BACK, by the same route, with a fresh administrator session
await browser.close();
const back=await boot('sv9160','/administration/staff','admin');
await back.page.waitForTimeout(7000);
const page2=back.page;
const restore=async()=>{
  const ok=await page2.evaluate((em)=>{
    const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const tr=[...document.querySelectorAll('tr')].filter(vis).find(t=>(t.innerText||'').includes(em));
    if(!tr) return false;
    const btn=[...tr.querySelectorAll('button,[role=button],a,i,span')].filter(vis)
      .find(e=>/edit/i.test((e.getAttribute('data-test-id')||'')+' '+(e.innerText||'')+' '+(e.className||'')));
    if(!btn) return false; (btn.closest('button,[role=button],a')||btn).click(); return true;}, email);
  if(!ok) return {opened:false};
  await page2.waitForTimeout(5000);
  const opened=await page2.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const dlg=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop()||document.body;
    const sel=[...dlg.querySelectorAll('.q-select,label.q-field')].filter(vis)
      .find(e=>/^Role\b/.test((e.innerText||'').replace(/\s+/g,' ').trim()));
    if(!sel) return false; sel.click(); return true;});
  await page2.waitForTimeout(2500);
  const picked=await page2.evaluate((n)=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const o=[...document.querySelectorAll('[role=option],.q-item')].filter(vis)
      .find(e=>(e.innerText||'').replace(/\s+/g,' ').trim()===n);
    if(!o) return false; o.click(); return true;}, R.subject.roleBefore);
  await page2.waitForTimeout(2000);
  const saved=await page2.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const dlg=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop()||document.body;
    const b=[...dlg.querySelectorAll('button')].filter(vis)
      .find(e=>/^(save|update|apply|confirm)\b/i.test((e.innerText||'').replace(/\s+/g,' ').trim()));
    if(!b) return false; b.click(); return true;});
  await page2.waitForTimeout(7000);
  return {opened, picked, saved};
};
R.restore=await restore();
await page2.goto(APP+'/administration/staff',{waitUntil:'domcontentloaded'}); await page2.waitForTimeout(7000);
const finalRole=await page2.evaluate((em)=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const tr=[...document.querySelectorAll('tr')].filter(vis).find(t=>(t.innerText||'').includes(em));
  if(!tr) return null;
  const known=/^(Admin|Technician|Foreman|Office User|Parts Manager|Parts Technician|Sales Representative|Senior Service Advisor|Service Advisor|Service Manager|Time Clock User)$/;
  return [...tr.querySelectorAll('td')].map(td=>(td.innerText||'').trim()).find(c=>known.test(c))||null;}, email);
R.restore.roleNow=finalRole;
R.restore.proved = finalRole===R.subject.roleBefore;
save();
if(!R.restore.proved) L('🛑🛑 RESTORE NOT PROVED --', email, 'is on', finalRole, 'and should be on', R.subject.roleBefore);
else L('restored:', email, 'is back on', finalRole);
L('DONE. changeLanded=',R.changeLanded,' identity=',R.serverIdentity&&R.serverIdentity.templateSlug,
  ' types=',JSON.stringify(R.typesShown),' restored=',R.restore.proved);
await back.browser.close();
