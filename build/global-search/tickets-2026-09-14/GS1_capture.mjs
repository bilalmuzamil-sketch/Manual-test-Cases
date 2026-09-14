// GLOBAL SEARCH V2 (sv9160) -- capture the screen evidence for all 16 ticket candidates in ONE
// browser session. For each candidate: open the search modal THROUGH THE UI, type the query, wait,
// screenshot, and record the per-type counts actually shown. Positive controls are captured in the
// same pass so no ticket rests on an unproven negative (Rule 104).
// RESUMABLE: anything already in GS1.json with a screenshot on disk is skipped.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV=`${DIR}/evidence`;
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const STATE=`${DIR}/GS1.json`;
const R = fs.existsSync(STATE) ? JSON.parse(fs.readFileSync(STATE,'utf8')) : {at:new Date().toISOString(), queries:{}};
const save=()=>fs.writeFileSync(STATE, JSON.stringify(R,null,1));

// tag = what it proves · q = the query · kind = 'finding' (expect 0) or 'control' (expect >0)
const PLAN=[
  ['A1-unit-number',      'ZZT-4471',                  'finding'],
  ['A1-unit-nodash',      'ZZT4471',                   'finding'],
  ['A1-control-name',     'ZZAUTOTESTBridgeport',      'control'],
  ['A2-vin-full',         '1FUJGLDR9KLZZ4471',         'finding'],
  ['A2-control-vinprefix','1FUJGLDR9KL',               'control'],
  ['A3-vendor-email',     'parts@kestrelsupply-zzt.com','finding'],
  ['A3-control-vendor',   'Kestrel',                   'control'],
  ['A4-part-number',      'ZZT-88-4412',               'finding'],
  ['A4-control-desc',     'Brake Chamber',             'control'],
  ['B1-catalogue-part',   'ZZT-77-3300',               'finding'],
  ['B2-cust-postcode',    '44872-9931',                'finding'],
  ['B3-cust-website',     'bridgeporthauling-zzt.com', 'finding'],
  ['B4-contact-title',    'Dispatch Supervisor',       'finding'],
  ['B5-vendor-postcode',  '43055-2210',                'finding'],
  ['B6-vendor-state',     'Ohio',                      'finding'],
  ['B7-asset-plate',      'OHZZT471',                  'finding'],
  // GROUP C -- these were PREDICTIONS. Running them converts them to measurements (Rule 12).
  ['C1-wo-status',        'Quality Check',             'measure'],
  ['C1-wo-status-nospace','qualitycheck',              'measure'],
  ['C2-partial-number',   '17580',                     'measure'],
  ['C2-control-fullnum',  'S9160-17580',               'control'],
  ['C3-midword',          'ridgeport',                 'measure'],
  ['C3-control-word',     'Bridgeport',                'control'],
  ['C4-broad-many-types', 'ZZAUTOTEST',                'measure'],
  // B6 needs care: 'Ohio' returns a vendor whose NAME contains Ohio, which is not a state match.
  // Prove the seeded Ohio vendor exists and is findable by name, so its absence from 'Ohio' is real.
  ['B6-control-vendorname','ZZAUTOTEST Kestrel Parts Supply','control'],
];
const { browser, page } = await boot('sv9160', '/', 'admin');
const openSearch=async()=>{
  await page.keyboard.press('Escape').catch(()=>{});
  await page.waitForTimeout(600);
  let ok=await page.evaluate(()=>{const b=document.querySelector('[data-test-id="global_search_trigger"]');
    if(b){b.click(); return 'trigger';} return null;});
  if(!ok){ await page.keyboard.press('Control+k'); ok='ctrl+k'; }   // lowercase k -- capital sends Ctrl+Shift+K
  await page.waitForTimeout(1800);
  return ok;
};
const readResults=async()=>page.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect(); return r.width>2&&r.height>2;};
  const modal=[...document.querySelectorAll('.q-dialog, [role=dialog]')].filter(vis).pop();
  const scope=modal||document.body;
  const t=(scope.innerText||'').replace(/\s+/g,' ').trim();
  // scope tabs carry per-type counts
  const tabs=[...scope.querySelectorAll('[role=tab], .q-tab')].filter(vis)
    .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean);
  const groups=[...scope.querySelectorAll('h1,h2,h3,h4,h5,h6,[class*=group],[class*=heading]')].filter(vis)
    .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(x=>x&&x.length<40).slice(0,14);
  const rows=[...scope.querySelectorAll('[class*=result],[role=option],li')].filter(vis)
    .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,12);
  return {modalFound:!!modal, tabs, groups, rowCount:rows.length, rows,
    empty:/no results|nothing found|no matches/i.test(t), text:t.slice(0,320)};
});
for(const [tag,q,kind] of PLAN){
  if(R.queries[tag] && fs.existsSync(`${EV}/GS1-${tag}.png`)){ L('skip (already captured)', tag); continue; }
  const how=await openSearch();
  const typed=await page.evaluate(async(query)=>{
    const vis=e=>{const r=e.getBoundingClientRect(); return r.width>2&&r.height>2;};
    const modal=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop()||document;
    const inp=[...modal.querySelectorAll('input')].filter(vis)[0];
    if(!inp) return null;
    inp.focus();
    const set=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
    set.call(inp,''); inp.dispatchEvent(new Event('input',{bubbles:true}));
    return true;
  }, q);
  if(typed) await page.keyboard.type(q, {delay:45});
  await page.waitForTimeout(4200);
  const res=await readResults();
  await page.screenshot({path:`${EV}/GS1-${tag}.png`, fullPage:false});
  R.queries[tag]={query:q, kind, openedVia:how, typedOk:!!typed, ...res, at:new Date().toISOString()};
  L(`${tag.padEnd(22)} q=${JSON.stringify(q).padEnd(30)} modal=${res.modalFound} rows=${res.rowCount} empty=${res.empty} tabs=${JSON.stringify(res.tabs).slice(0,120)}`);
  save();
}
L('captured %d of %d', Object.keys(R.queries).length, PLAN.length);
await browser.close();
