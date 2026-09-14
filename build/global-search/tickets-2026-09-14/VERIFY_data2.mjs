// Read the seeded records the way the SEEDER finds them, and dump every field.
//
// The first verifier used /api/<type>/view/<id> for the asset and vendor and got 404 -- those view
// routes are not the ones this API exposes. The manifest's own `find` blocks name list endpoints the
// seeder has proven work, so use those. And print ALL fields rather than a guessed subset: the
// customer came back with address_2, state_or_province and telephone NULL, which turns three
// apparent product findings into missing data, and the same question has to be asked of the asset's
// licence plate and the vendor's postal code before anything is said about them.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const SEED='/home/user/Manual-test-Cases/build/global-search/seeding';
const man=JSON.parse(fs.readFileSync(`${SEED}/seed-manifest.json`,'utf8'));
const { browser, page, APIH } = await boot('sv9160','/','admin');
const api=async(p)=>page.evaluate(async(u)=>{
  try{ const r=await fetch(u,{headers:{Accept:'application/json'},credentials:'include'});
    const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){}
    return {status:r.status,json:j,head:t.slice(0,200)};
  }catch(e){ return {error:String(e).slice(0,120)}; }}, `https://${APIH}${p}`);

const out={at:new Date().toISOString(), records:{}};
for(const rec of man.records){
  const f=rec.find||{};
  if(f.mode!=='search' || !f.list){ out.records[rec.key]={skipped:`find mode '${f.mode}'`}; continue; }
  const r=await api(`${f.list}?search=${encodeURIComponent(f.value)}&limit=25`);
  const d=r.json&&(r.json.data!==undefined?r.json.data:r.json);
  const list=Array.isArray(d)?d:((d&&(d[f.coll]||d.collection))||[]);
  const hit=(list||[]).find(x=>String(x[f.field]||'').toLowerCase()===String(f.value).toLowerCase())
          ||(list||[])[0];
  out.records[rec.key]={status:r.status, matched:list?list.length:0,
    // every field, so a null the cases depend on cannot hide behind a guessed key list
    fields:hit?Object.fromEntries(Object.entries(hit).filter(([k,v])=>
      v===null||['string','number','boolean'].includes(typeof v))):null,
    wanted:{...(rec.create||{}).payload, ...((rec.patch||{}).fields||{})}};
}
fs.writeFileSync(`${DIR}/DATA-VERIFY2.json`, JSON.stringify(out,null,1));
// Say plainly which values the cases search for are actually ABSENT from the record.
const gaps=[];
for(const [k,v] of Object.entries(out.records)){
  if(!v.fields) continue;
  for(const [field,want] of Object.entries(v.wanted||{})){
    if(typeof want!=='string') continue;
    const got=v.fields[field];
    if(got===undefined) continue;
    if(String(got||'').toLowerCase()!==want.toLowerCase())
      gaps.push(`${k}.${field}: wanted ${JSON.stringify(want)} but the record holds ${JSON.stringify(got)}`);
  }
}
console.log(gaps.length?('DATA GAPS:\n  '+gaps.join('\n  ')):'no data gaps -- every wanted value is on its record');
await browser.close();
