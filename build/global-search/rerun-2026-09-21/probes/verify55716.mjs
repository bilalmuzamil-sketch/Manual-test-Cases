// Rule 62-c re-verify of C55716 on today's build, PLUS the confounder check that killed SV-10277:
// are the two fixtures actually TIED? PRD 6.1 Customers score on: >=1 open WO (+0.20),
// open WO count log-scaled (+0.15), viewed in last 7 days (+0.10). Nothing else. The open-WO
// count is DISPLAYED on the row (PRD 4), so it is readable on the screen. The view signal is
// equalised by opening BOTH records before each round.
import { open, ensureOpen, type as tp, SEL } from '/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs';
const API='https://sv9160api.qa.shopview.com';
const OUT='/home/user/Manual-test-Cases/build/global-search/rerun-2026-09-21/';
const { page, browser } = await open('sv9160','/customers','admin');
await page.waitForTimeout(3000);
const marker = await page.evaluate(()=> (document.querySelector('meta[name=app-version]')||{}).content );
console.log('BUILD MARKER:', marker);
const req=(m,u,b)=>page.evaluate(async([m,u,b])=>{const r=await fetch(u,{method:m,credentials:'include',headers:{'Content-Type':'application/json'},body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch{};return{s:r.status,t:t.slice(0,300),j}},[m,API+u,b]);
const list=async()=> (await req('GET','/api/customers?pagination[rowsPerPage]=10&search=ZZTIEBREAK')).j?.data?.collection||[];

async function readRows(shot){
  await page.keyboard.press('Escape'); await page.waitForTimeout(600);
  await ensureOpen(page); await tp(page,'ZZTIEBREAK',4500);
  await page.evaluate(([s])=>{const e=[...document.querySelectorAll(s)].find(x=>/^\s*Customers/i.test((x.innerText||'').trim()));if(e)e.click();},[SEL.tab]);
  await page.waitForTimeout(1800);
  const r=await page.$$eval(SEL.row, es=>es.map(e=>({text:(e.innerText||'').replace(/\s+/g,' ').trim()})));
  if(shot) await page.screenshot({path:OUT+shot});
  await page.keyboard.press('Escape'); await page.waitForTimeout(500); return r;
}

// --- STEP 1: are they tied? read the rows AS SHOWN, including the open-WO count badge
const before = await readRows('v55716-rows-before.png');
console.log('\nROWS AS SHOWN (full text, badge included):');
before.forEach((r,i)=>console.log('  '+(i+1)+'. '+JSON.stringify(r.text)));

const cust = await list();
const One = cust.find(x=>/Transport One/i.test(x.name));
const Two = cust.find(x=>/Transport Two/i.test(x.name));
console.log('\nfixture ids: One='+One?.id+'  Two='+Two?.id);
// open WO count per customer, straight from the work orders list (a SET read, not a judgement)
for (const c of [One,Two]) {
  const w = await req('GET','/api/work-orders?pagination[rowsPerPage]=100&company_id='+c.id);
  const col = w.j?.data?.collection||[];
  console.log('  '+c.name+' -> work orders returned: '+col.length+' | statuses: '+JSON.stringify(col.map(x=>x.status||x.status_name)));
}

// --- STEP 2: equalise the "viewed recently" signal - open BOTH records
for (const c of [One,Two]) { await page.goto('https://sv9160.qa.shopview.com/customers/'+c.id, {waitUntil:'domcontentloaded'}); await page.waitForTimeout(3500); }
await page.goto('https://sv9160.qa.shopview.com/customers', {waitUntil:'domcontentloaded'}); await page.waitForTimeout(2500);
const afterView = await readRows('v55716-rows-bothviewed.png');
console.log('\nAFTER OPENING BOTH RECORDS (view signal equal):');
afterView.forEach((r,i)=>console.log('  '+(i+1)+'. '+JSON.stringify(r.text.slice(0,70))));

// --- STEP 3: two alternating rounds. Touch the one that is currently SECOND; it should come first.
async function round(target, label, shot){
  console.log('\n--- ROUND '+label+': touching "'+target.name+'"');
  const r1 = await req('POST','/api/customers/change', {...target, company_id:target.id, id:target.id, address1:'1 Ranking Way', notes:'tiebreak-'+Date.now()});
  console.log('   write ->', r1.s);
  for (const w of [15000,15000,15000]) {
    await page.waitForTimeout(w);
    const rr = await readRows(null);
    console.log('   order: '+JSON.stringify(rr.map(x=>x.text.slice(0,34))));
  }
  const fin = await readRows(shot);
  return fin.map(x=>x.text.slice(0,34));
}
const orderA = await round(afterView[1].text.match(/Transport One/i)?One:Two, 'A (touch the SECOND row)', 'v55716-roundA.png');
const orderB = await round(orderA[1].match(/Transport One/i)?One:Two, 'B (touch the SECOND row again)', 'v55716-roundB.png');
console.log('\nFINAL A:', JSON.stringify(orderA));
console.log('FINAL B:', JSON.stringify(orderB));
console.log('\nBUILD MARKER:', marker);
await browser.close();
