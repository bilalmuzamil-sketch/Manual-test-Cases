// Execute run 415's V1 regression cases (section 6769) with ROW-LEVEL evidence.
//
// Why this replaces RUN_exec.mjs: the first executor judged from the per-type COUNTS in the tab
// strip and captured rows with a guessed selector ([class*=result],[role=option],li) that usually
// returned one row or none. Counts alone already burned this pass once (L0079 -- "Assets (1)"
// beside a tab reading "No results"), and an unsettled count reading made C55670 look like a zero
// when the row is in fact there. The app labels its own rows -- data-test-id="search_result_row_
// <type>_<n>" and "search_group_header_<type>" -- so the row content is readable directly, and
// every verdict below is judged on the ROW, not on a number beside a tab name.
//
// Three independent signals are recorded per query, and they must agree before anything is
// trusted: (1) the tab-strip counts, (2) the modal's own "N results found across M categories"
// line, (3) the /api/search response for the same query. A disagreement is retried with a longer
// settle and, if it survives, recorded as a DIVERGENCE for a human rather than silently resolved.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV=`${DIR}/run-evidence2`; fs.mkdirSync(EV,{recursive:true});
const STATE=`${DIR}/RUN-RESULTS2.json`;
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R=fs.existsSync(STATE)?JSON.parse(fs.readFileSync(STATE,'utf8')):{at:new Date().toISOString(),cases:{}};
const save=()=>fs.writeFileSync(STATE, JSON.stringify(R,null,1));
const ONLY=process.env.ONLY?new Set(process.env.ONLY.split(',').map(s=>s.replace(/^C/,''))):null;
const CASES=JSON.parse(fs.readFileSync(`${DIR}/CASES-6769.json`,'utf8'))
  .filter(c=>c.pairs && c.pairs.length && !c.needs_roles)
  .filter(c=>!ONLY || ONLY.has(String(c.id)));

// The tab strip's own ids, so a tab is clicked by identity and never by matching its label text.
const SLUG={'all':'all','work orders':'work_orders','customers':'customers','assets':'assets',
  'parts':'parts','vendors':'vendors','part sales':'part_sales','purchase orders':'purchase_orders',
  'vendor invoices':'vendor_invoices'};

const { browser, page } = await boot('sv9160','/','admin');

const broken=async()=>page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const m=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop();
  return /search unavailable|an error occurred|Oooops/i.test(((m?m.innerText:document.body.innerText)||''));});

// Everything the modal is currently showing, read from the app's OWN test ids.
const readModal=async()=>page.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const m=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!m) return null;
  const tabs={};
  m.querySelectorAll('[data-test-id^="search_modal_tab_"]').forEach(e=>{
    const k=e.getAttribute('data-test-id').replace('search_modal_tab_','');
    const t=(e.innerText||'').replace(/\s+/g,' ').trim();
    const n=t.match(/\((\d+)\)/); tabs[k]=n?Number(n[1]):null;});
  // UNFILTERED. The rows live in a scrollable body (search-modal__body), so some sit below the
  // fold; a visibility filter here turns "further down the list" into "missing", which is the
  // difference between a clean pass and a fabricated defect.
  const rowEls=[...m.querySelectorAll('[data-test-id^="search_result_row_"]')];
  const rows=rowEls.map(e=>{
    const id=e.getAttribute('data-test-id').replace('search_result_row_','');
    const r=e.getBoundingClientRect();
    return {type:id.replace(/_\d+$/,''), text:(e.innerText||'').replace(/\s+/g,' ').trim(),
      h:Math.round(r.height)};});
  const headers=[...m.querySelectorAll('[data-test-id^="search_group_header_"]')]
    .map(e=>e.getAttribute('data-test-id').replace('search_group_header_',''));
  const cEl=m.querySelector('[data-test-id="search_modal_result_count"]');
  const active=(()=>{const a=[...m.querySelectorAll('[data-test-id^="search_modal_tab_"]')]
      .find(e=>/active|--selected|aria-selected="true"/.test(e.className+' '+(e.getAttribute('aria-selected')==='true'?'aria-selected="true"':'')));
    return a?a.getAttribute('data-test-id').replace('search_modal_tab_',''):null;})();
  return {tabs, rows, headers, activeTab:active, domRowCount:rowEls.length,
    countLine:cEl?(cEl.innerText||'').replace(/\s+/g,' ').trim():null,
    empty:/no results|nothing found/i.test(m.innerText||'')};});

// The same question, asked of the server -- read from the app's OWN request rather than issued
// again by me. An in-page fetch to /api/search resolves against the FRONT-END origin and comes
// back as the SPA's index.html ("<!doctype"), so every cross-check degraded to an error and
// compared nothing. The API lives on a different host (sv9160api...), and the page has already
// asked it the exact question the user asked; this just reads the answer off the wire.
const LASTAPI={};
page.on('response', async r=>{ const u=r.url();
  if(!/\/api\/search\?/.test(u)) return;
  try{ const j=await r.json(); const g={};
    ((j&&j.data&&j.data.groups)||[]).forEach(x=>{ g[x.type]=x.total; });
    // '+' is a legal encoding of a space in a query string and decodeURIComponent does NOT undo
    // it, so 'Dispatch Supervisor' keyed as 'Dispatch+Supervisor' and never matched the lookup --
    // which silently dropped the server cross-check for exactly the queries most worth checking.
    const q=decodeURIComponent(((u.match(/[?&]q=([^&]*)/)||[])[1]||'').replace(/\+/g,'%20'));
    LASTAPI[q]={groups:g, pinned:!!(j&&j.data&&j.data.pinned), status:r.status()};
  }catch(e){}});
const apiFor=async(q)=> LASTAPI[q] || {error:'no /api/search response seen for this query'};

const openModal=async()=>{
  await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(700);
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id="global_search_trigger"]'); b&&b.click();});
  await page.waitForSelector('[data-test-id="search_modal_input"]',{state:'visible',timeout:20000});
};

// Settle on BOTH the tab strip and the modal's own count line, three consecutive identical reads
// and a floor on elapsed time. A long query was measured still reading "All (0)" at 2s and only
// settling at ~4s; two reads a second apart is not enough to see that.
const settle=async(minMs=5000)=>{
  let last=null, stable=0; const t0=Date.now();
  for(let i=0;i<30;i++){
    await page.waitForTimeout(1000);
    const m=await readModal(); if(!m) { stable=0; continue; }
    const sig=JSON.stringify([m.tabs, m.countLine, m.rows.length]);
    const hasCounts=Object.values(m.tabs).some(v=>v!==null);
    if(hasCounts && sig===last){ if(++stable>=3 && Date.now()-t0>=minMs) return m; } else stable=0;
    last=sig;
  }
  return await readModal();
};

const typeQuery=async(q)=>{
  delete LASTAPI[q];   // never let an earlier pass's answer stand in for this one
  const sel='[data-test-id="search_modal_input"]';
  await page.fill(sel,''); await page.type(sel,q,{delay:35});
  const v=await page.$eval(sel,e=>e.value).catch(()=>null);
  if(v!==q) throw new Error(`INSTRUMENT: box holds ${JSON.stringify(v)} not ${JSON.stringify(q)}`);
};

const clickTab=async(group)=>{
  const slug=SLUG[String(group||'').toLowerCase().trim()]; if(!slug) return null;
  const ok=await page.evaluate((s)=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const m=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!m) return false;
    const t=m.querySelector(`[data-test-id="search_modal_tab_${s}"]`); if(!t) return false; t.click(); return true;}, slug);
  if(!ok) return null;
  // SETTLE the scoped view too, never a flat wait. The counts were measured settling at ~4-5s, so a
  // 2.5s read of a section can come back empty while it is still loading -- and "counted under All
  // but its own section is empty" is precisely the failure the QA lead found by hand. A harness that
  // can manufacture that finding is worse than no harness.
  await page.waitForTimeout(1200);
  const view=await settle(4000);
  return {slug, view:view||await readModal()};
};

let done=0;
for(const c of CASES){
  const key='C'+c.id;
  if(R.cases[key] && !ONLY){ L('skip', key); continue; }
  const rec={title:c.title, override:!!c.override, obs:[]}; let bad=false;
  for(let i=0;i<c.pairs.length;i++){
    const {q, group}=c.pairs[i];
    try{ await openModal(); await typeQuery(q); }
    catch(e){ rec.obs.push({query:q, group, instrument:String(e.message).slice(0,120)}); bad=true; continue; }
    if(await broken()){ rec.obs.push({query:q, group, instrument:'search unavailable'}); bad=true; continue; }
    let pre=await settle();                       // tabs exist only once a query has been typed
    const openedOn=pre&&pre.activeTab;
    await clickTab('All');                        // make the All view explicit, never assumed
    let all=await settle();
    let api=await apiFor(q);
    // Three signals must agree. If the UI and the server disagree, give the UI a longer settle and
    // look again before believing either -- and if it survives that, say so rather than pick one.
    const cmp=(m,a)=>{ if(!m||!a||a.error) return null;
      const d=[]; for(const [t,n] of Object.entries(a.groups||{})){ const u=m.tabs[t];
        if(u!==undefined && u!==null && u!==n) d.push(`count ${t}: screen ${u} vs server ${n}`);
        // The count agreeing is not the test. The QA lead's finding was a type the strip counted
        // and the list never showed -- so check that a counted type actually renders rows.
        if(n>0 && !m.rows.some(r=>r.type===t)) d.push(`rows ${t}: server ${n} but no row rendered`);
      } return d; };
    let diff=cmp(all,api);
    if(diff && diff.length){ await page.waitForTimeout(4000); all=await settle(8000); api=await apiFor(q); diff=cmp(all,api); }
    await page.screenshot({path:`${EV}/${key}-q${i+1}-all.png`});
    let scoped=null;
    if(group){ const s=await clickTab(group);
      if(s){ scoped=s.view; await page.screenshot({path:`${EV}/${key}-q${i+1}-${s.slug}.png`}); } }
    rec.obs.push({query:q, group, openedOnTab:openedOn,
      tabs:all&&all.tabs, countLine:all&&all.countLine,
      allRows:all?all.rows:null, headers:all&&all.headers,
      api:api&&(api.groups||{error:api.error}),
      divergence:(diff&&diff.length)?diff:null,
      scopedRows:scoped?scoped.rows:null, scopedEmpty:scoped?scoped.empty:null,
      groupClicked:!!scoped});
    if(diff&&diff.length) bad=true;
  }
  rec.instrumentTrouble=bad;
  R.cases[key]=rec; save(); done++;
  const o=rec.obs[0]||{};
  L(`${key} ${c.pairs.length}q q1="${o.query}" grp=${o.group||'-'} allRows=${o.allRows?o.allRows.length:'-'} scoped=${o.scopedRows?o.scopedRows.length:'-'} div=${o.divergence?'YES':'no'}`);
}
L(`executed ${done} cases this pass; ${Object.keys(R.cases).length} recorded in total`);
await browser.close();
