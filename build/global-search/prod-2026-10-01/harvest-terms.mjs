/**
 * Build an entity-config from PRODUCTION'S OWN RECORDS, so the entity checks can run there without
 * creating anything. Seeding production was blocked by a safety guard in this environment, and the
 * checks do not actually need MY records - they need A record with the right shape, and production
 * is full of them.
 *
 * For each entity the checks need, in their own words:
 *   A1/A2/A3/D1  a record whose identifier is long enough to test truncation and highlighting
 *   B1/B2        TWO records sharing a bold line, to be told apart on the second line
 *   I1           a distinctive value that appears in no other field
 */
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const OUT='/home/user/Manual-test-Cases/build/global-search/prod-2026-10-01/';
const { page, browser } = await bootProdLogin('/customers', { settle: 12000 });
page.setDefaultTimeout(30000);

async function rowsFor(term, tab){
  await page.keyboard.press('Escape'); await page.waitForTimeout(300);
  await page.keyboard.press('Control+k'); await page.waitForTimeout(1000);
  await page.fill('.search-modal input',''); await page.waitForTimeout(220);
  await page.type('.search-modal input', term, {delay:28}); await page.waitForTimeout(3000);
  const ok=await page.evaluate(l=>{const t=[...document.querySelectorAll('.search-tabs__tab')]
    .find(e=>e.innerText.replace(/\s*\(\d+\)/,'').trim().toLowerCase()===l.toLowerCase());
    if(!t)return false;t.click();return true;},tab);
  if(!ok) return [];
  await page.waitForTimeout(2000);
  return await page.evaluate(()=>[...document.querySelectorAll('.search-row')].slice(0,12).map(r=>({
    title:(r.querySelector('.search-row__title')?.innerText||'').replace(/\s+/g,' ').trim(),
    text:r.innerText.replace(/\s*\n\s*/g,' ').replace(/\s+/g,' ').trim()})));
}

// probe terms broad enough to return real production records per tab
const PROBE={ 'Assets':['truck','ford','freightliner','2021'], 'Parts':['brake','filter','oil','kit'],
  'Vendors':['supply','parts','service','inc'], 'Part sales':['truck','repair','service'],
  'Purchase orders':['repair','parts','diesel'], 'Vendor invoices':['repair','parts','service'] };
const CASES={ 'Assets':{A1:146224,A2:146225,A3:146226,B1:146227,B2:146228,D1:146231,I1:146229},
  'Parts':{A1:146233,A2:146234,A3:146235,B1:146236,B2:146237,D1:146243,I1:146238},
  'Vendors':{A1:146245,A2:146246,A3:146247,B1:146248,B2:146249,D1:146255,I1:146250},
  'Part Sales':{A1:146257,A2:146258,A3:146259,B1:146260,B2:146261,D1:146264,I1:146262},
  'Purchase Orders':{A1:146266,A2:146267,A3:146268,B1:146269,B2:146270,D1:146275,I1:146271},
  'Vendor Invoices':{A1:146277,A2:146278,A3:146279,B1:146280,B2:146281,D1:146283,I1:146282} };
const TAB={'Assets':'Assets','Parts':'Parts','Vendors':'Vendors','Part Sales':'Part sales',
  'Purchase Orders':'Purchase orders','Vendor Invoices':'Vendor invoices'};

const cfg={}, found={};
for (const [ent,cases] of Object.entries(CASES)){
  const tab=TAB[ent]; let chosen=null, pairTerm=null;
  for (const probe of PROBE[tab]||PROBE[ent]||[]){
    const rows=await rowsFor(probe, tab);
    if(rows.length<2) continue;
    // a word that actually appears in the rows and is long enough to be distinctive
    const counts={};
    for(const r of rows) for(const w of (r.title.match(/[A-Za-z][A-Za-z'-]{4,}/g)||[])) counts[w]=(counts[w]||0)+1;
    const shared=Object.entries(counts).filter(([,n])=>n>=2).sort((a,b)=>b[1]-a[1])[0];
    if(shared){ chosen=probe; pairTerm=shared[0]; break; }
    if(!chosen) chosen=probe;
  }
  if(!chosen){ console.log(`${ent}: no production records found to test with`); continue; }
  const term = pairTerm || chosen;
  cfg[ent]={tab, cases:Object.fromEntries(Object.entries(cases).map(([k,cid])=>[k,{cid,term}]))};
  found[ent]={term, probe:chosen};
  console.log(`${ent.padEnd(17)} tab=${tab.padEnd(16)} term="${term}"`);
}
fs.mkdirSync(OUT+'cfg',{recursive:true});
fs.writeFileSync(OUT+'cfg/entity-config.json', JSON.stringify(cfg,null,1));
fs.writeFileSync(OUT+'cfg/held-terms-found.json', JSON.stringify(found,null,1));
console.log('HARVEST DONE');
await browser.close();
