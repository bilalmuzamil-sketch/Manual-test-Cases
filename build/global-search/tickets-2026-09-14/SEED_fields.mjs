// Put the missing field values onto the seeded records so the cases that search them can run.
//
// Rule 14: a case is never marked not-verified for a missing DATA STATE -- seed it and run the case.
// Rule 107: on a QA branch this needs no further permission. Three cases were unrunnable because the
// customer record carries no state, no address line 2 and no telephone, though the manifest declares
// all three: C53582 (search the state), C53604 (search address line 2), C55662 (search the company's
// own phone). This sets them, reads the record back, and reports what actually landed -- a 200 is
// not evidence that a write took (Rule 104).
//
// It writes ONLY to the ZZAUTOTEST records named in the manifest, and refuses to touch anything whose
// name does not carry the tag.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const SEED='/home/user/Manual-test-Cases/build/global-search/seeding';
const man=JSON.parse(fs.readFileSync(`${SEED}/seed-manifest.json`,'utf8'));
const live=JSON.parse(fs.readFileSync(`${SEED}/seed-state-live.json`,'utf8')).live_ids;
const TAG=man.environment.tag;
const { browser, page, APIH } = await boot('sv9160','/','admin');
const api=async(p,method='GET',body=null)=>page.evaluate(async([u,m,b])=>{
  try{ const r=await fetch(u,{method:m,headers:{Accept:'application/json','Content-Type':'application/json'},
        credentials:'include', body:b?JSON.stringify(b):undefined});
    const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){}
    return {status:r.status,json:j,head:t.slice(0,400)};
  }catch(e){ return {error:String(e).slice(0,140)}; }},[`https://${APIH}${p}`,method,body]);

const read=async()=>{ const f=man.records.find(r=>r.key==='customer').find;
  const r=await api(`${f.list}?search=${encodeURIComponent(f.value)}&limit=25`);
  const d=r.json&&(r.json.data!==undefined?r.json.data:r.json);
  const list=Array.isArray(d)?d:((d&&(d[f.coll]||d.collection))||[]);
  return (list||[]).find(x=>String(x.name||'')===f.value)||null; };

const before=await read();
if(!before){ console.log('the seeded customer could not be read back -- nothing changed'); await browser.close(); process.exit(2); }
if(!String(before.name||'').includes(TAG)){ console.log(`refusing: ${before.name} is not a ${TAG} record`); await browser.close(); process.exit(2); }

const out={at:new Date().toISOString(), customerId:before.id||live.customer, before:{}, after:{}};
const WANT={state_or_province:'Ohio', address_2:'Dock 7B', telephone:'(419) 555-0143',
            phone:'(419) 555-0143', website:'bridgeporthauling-zzt.com'};
for(const k of Object.keys(WANT)) out.before[k]=before[k]===undefined?'(absent)':before[k];

// Send the record back with the missing values filled in. The change endpoint on this API expects
// the record, not a sparse patch, so start from what it already holds.
const payload={...before, ...WANT, id:before.id||live.customer};
const w=await api('/api/customers/change','POST',payload);
out.write={status:w.status, head:w.head};

await page.waitForTimeout(3000);
const after=await read();
for(const k of Object.keys(WANT)) out.after[k]=after&&(after[k]===undefined?'(absent)':after[k]);
out.landed=Object.fromEntries(Object.keys(WANT).map(k=>[k,
  String((after&&after[k])||'').toLowerCase()===String(WANT[k]).toLowerCase()]));
fs.writeFileSync(`${DIR}/SEED-FIELDS.json`, JSON.stringify(out,null,1));
console.log(JSON.stringify({write:out.write.status, before:out.before, after:out.after, landed:out.landed},null,1));
await browser.close();
