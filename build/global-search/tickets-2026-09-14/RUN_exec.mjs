// Execute the directly-runnable cases of run 415's V1 regression suite (section 6769).
// For each case: open the search modal through the UI, type the query the case names, read the
// per-type counts AND click into the group the case cares about (L0079 -- a count is not a result),
// screenshot, and record. Refuses to record while the search service is unavailable (L0080).
// Resumable: anything already recorded with a screenshot on disk is skipped.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV=`${DIR}/run-evidence`; fs.mkdirSync(EV,{recursive:true});
const STATE=`${DIR}/RUN-RESULTS.json`;
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R=fs.existsSync(STATE)?JSON.parse(fs.readFileSync(STATE,'utf8')):{at:new Date().toISOString(),cases:{}};
const save=()=>fs.writeFileSync(STATE, JSON.stringify(R,null,1));
const CASES=JSON.parse(fs.readFileSync(`${DIR}/CASES-6769.json`,'utf8'))
  .filter(c=>c.queries.length && !c.needs_roles);
const { browser, page } = await boot('sv9160','/','admin');
const broken=async()=>page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const m=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop();
  return /search unavailable|an error occurred|Oooops/i.test(((m?m.innerText:document.body.innerText)||''));});
const search=async(q)=>{
  await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(700);
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id="global_search_trigger"]'); b&&b.click();});
  await page.waitForSelector('[data-test-id="search_modal_input"]',{state:'visible',timeout:20000});
  const sel='[data-test-id="search_modal_input"]';
  await page.fill(sel,''); await page.type(sel,q,{delay:35});
  const v=await page.$eval(sel,e=>e.value).catch(()=>null);
  if(v!==q) throw new Error(`INSTRUMENT: box holds ${JSON.stringify(v)} not ${JSON.stringify(q)}`);
  // WAIT FOR THE COUNTS TO SETTLE, never a fixed timeout. Measured on this build: a 29-character
  // query still reads "All (0)" at 2s and only settles to "All (6)" at 4s. A fixed wait turns that
  // into a confident, wrong zero -- which is what my first two passes recorded.
  let last=null, stable=0;
  for(let i=0;i<20;i++){
    await page.waitForTimeout(1000);
    const now=await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
      const m=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop();
      return m?[...m.querySelectorAll('[role=tab],.q-tab')].filter(vis).map(e=>(e.innerText||'').trim()).join('|'):null;});
    // A tab strip that has rendered WITHOUT its counts is stable-looking but not settled: it yields
    // "All (0)" beside a group that actually holds rows. Require the counts to be present.
    const hasCounts = now && /\(\d+\)/.test(now);
    if(hasCounts && now===last){ if(++stable>=2) return; } else stable=0;
    last=now;
  }
};
const readAll=async()=>page.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const m=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!m) return null;
  const tabs=[...m.querySelectorAll('[role=tab],.q-tab')].filter(vis).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim());
  const rows=[...m.querySelectorAll('[class*=result],[role=option],li')].filter(vis)
    .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,8);
  return {tabs, rowCount:rows.length, rows, text:(m.innerText||'').replace(/\s+/g,' ').slice(0,260)};});
const openTab=async(name)=>{ const ok=await page.evaluate((n)=>{
    const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const m=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!m) return false;
    const t=[...m.querySelectorAll('[role=tab],.q-tab')].filter(vis)
      .find(e=>(e.innerText||'').trim().toLowerCase().startsWith(n.toLowerCase()));
    if(!t) return false; t.click(); return true;}, name);
  await page.waitForTimeout(3500); return ok; };
// The group comes from the case's own steps ("Read the Assets group"), parsed into CASES-6769.json.
// Two earlier attempts to infer it -- from the title, then from the Expected prose -- were both
// wrong in ways that would have produced confident, wrong zeros ("proVINce" matched /vin/; "vendor
// by phone number" resolved to Parts). Inference is retired; the case says which group it means.
let done=0;
for(const c of CASES){
  const key='C'+c.id;
  if(R.cases[key] && fs.existsSync(`${EV}/${key}-q1-all.png`)){ L('skip', key); continue; }
  const rec={title:c.title, queries:c.queries, group:c.group, po_decision:!!c.po_decision, obs:[]};
  let bad=false;
  for(let i=0;i<c.queries.length;i++){
    const q=c.queries[i];
    try{ await search(q); }catch(e){ rec.obs.push({query:q, instrument:String(e.message).slice(0,120)}); bad=true; continue; }
    if(await broken()){ rec.obs.push({query:q, instrument:'search unavailable'}); bad=true; continue; }
    const all=await readAll();
    await page.screenshot({path:`${EV}/${key}-q${i+1}-all.png`});
    let scoped=null, clicked=false;
    if(rec.group){ clicked=await openTab(rec.group); if(clicked){ scoped=await readAll();
      await page.screenshot({path:`${EV}/${key}-q${i+1}-${rec.group.replace(/\s+/g,'')}.png`}); } }
    rec.obs.push({query:q, tabs:all&&all.tabs, allRows:all&&all.rowCount, topRows:(all&&all.rows||[]).slice(0,3),
                  group:rec.group, groupClicked:clicked, groupRows:scoped&&scoped.rowCount,
                  groupText:scoped&&scoped.text.slice(0,140)});
  }
  rec.instrumentTrouble=bad;
  R.cases[key]=rec; save(); done++;
  const o=rec.obs[0]||{};
  L(`${key} ${rec.group||'All'} | q="${c.queries[0]}" tabs=${JSON.stringify((o.tabs||[]).slice(0,4))} allRows=${o.allRows} groupRows=${o.groupRows}`);
}
L('executed %d cases this pass; %d recorded in total', done, Object.keys(R.cases).length);
await browser.close();
