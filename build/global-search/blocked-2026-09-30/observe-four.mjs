// Observation run for the four HELD cases C146221 / C146241 / C146250 / C146301.
// Their own Expected says "Do not pass or fail it. Record what you saw." — so this probe
// RECORDS, it does not judge. Nothing here awards a verdict.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/staging-cookie-boot.mjs';
import fs from 'fs';

const OUT = '/home/user/Manual-test-Cases/build/global-search/blocked-2026-09-30/observations.json';
const { page, browser } = await boot('/customers', { key:'admin', settle:12000 });
const rec = {};

async function openSearch() {
  // close any open panel first, then re-open clean
  await page.keyboard.press('Escape'); await page.waitForTimeout(400);
  await page.keyboard.press('Control+k'); await page.waitForTimeout(1200);
}
async function typeTerm(t) {
  const sel = '.search-modal input';
  await page.fill(sel, ''); await page.waitForTimeout(300);
  await page.type(sel, t, { delay: 45 });
  await page.waitForTimeout(3500);
}
async function clickTab(label) {
  const ok = await page.evaluate((lab)=>{
    const t=[...document.querySelectorAll('.search-tabs__tab')]
      .find(e=>e.innerText.replace(/\s*\(\d+\)/,'').trim().toLowerCase()===lab.toLowerCase());
    if(!t) return false; t.click(); return true;
  }, label);
  await page.waitForTimeout(2500);
  return ok;
}
async function rows() {
  return await page.evaluate(()=>[...document.querySelectorAll('.search-row')].map(r=>({
    title: r.querySelector('.search-row__title')?.innerText.trim() || null,
    meta:  [...r.querySelectorAll('.search-row__meta, .search-row__meta-part')].map(m=>m.innerText.trim()),
    full:  r.innerText.replace(/\s*\n\s*/g,' | ').trim(),
    marks: [...r.querySelectorAll('mark')].map(m=>m.innerText.trim()),
  })));
}
async function tabCounts() {
  return await page.evaluate(()=>[...document.querySelectorAll('.search-tabs__tab')]
    .map(e=>e.innerText.replace(/\s+/g,' ').trim()));
}

// ---- C146221 : postal code H8A3X9, Customers tab -------------------------
{
  await openSearch(); await typeTerm('H8A3X9');
  const tabsA = await tabCounts();
  const opened = await clickTab('Customers');
  rec.C146221 = { term:'H8A3X9', tab:'Customers', tabOpened:opened, tabs:tabsA, rows: await rows() };
}
// ---- C146241 : category ".Brake Parts", Parts tab ------------------------
{
  await openSearch(); await typeTerm('.Brake Parts');
  const tabsA = await tabCounts();
  const opened = await clickTab('Parts');
  rec.C146241 = { term:'.Brake Parts', tab:'Parts', tabOpened:opened, tabs:tabsA, rows: await rows() };
}
// ---- C146250 : vendor email, Vendors tab ---------------------------------
{
  await openSearch(); await typeTerm('zzhidden.vendor@staging.shopview.local');
  const tabsA = await tabCounts();
  const opened = await clickTab('Vendors');
  rec.C146250 = { term:'zzhidden.vendor@staging.shopview.local', tab:'Vendors', tabOpened:opened, tabs:tabsA, rows: await rows() };
}
// ---- C146301 : one character then two ------------------------------------
{
  await openSearch();
  const sel='.search-modal input';
  await page.fill(sel,''); await page.waitForTimeout(400);
  const errs=[]; page.on('pageerror', e=>errs.push(String(e)));
  await page.type(sel,'9',{delay:0});
  const t0=Date.now(); await page.waitForTimeout(3500);
  const one = { rowCount: (await rows()).length, tabs: await tabCounts(),
                body: (await page.evaluate(()=>document.querySelector('.search-modal')?.innerText.replace(/\s*\n\s*/g,' | ').slice(0,600))) ,
                waitedMs: Date.now()-t0, rows: (await rows()).slice(0,6) };
  await page.type(sel,'9',{delay:0});
  await page.waitForTimeout(3500);
  const two = { rowCount: (await rows()).length, tabs: await tabCounts(),
                body: (await page.evaluate(()=>document.querySelector('.search-modal')?.innerText.replace(/\s*\n\s*/g,' | ').slice(0,600))),
                rows: (await rows()).slice(0,6) };
  // stale check: did the one-char result set survive into the two-char read?
  rec.C146301 = { oneChar:one, twoChars:two, pageErrors:errs,
                  identical: JSON.stringify(one.rows)===JSON.stringify(two.rows) };
}

fs.writeFileSync(OUT, JSON.stringify(rec,null,1));
console.log('written', OUT);
for (const k of Object.keys(rec)) {
  const v=rec[k];
  if (k==='C146301') { console.log(k,'1char rows',v.oneChar.rowCount,'2char rows',v.twoChars.rowCount,'identical',v.identical,'errors',v.pageErrors.length); continue; }
  console.log(k, 'tabOpened',v.tabOpened, 'rows',v.rows.length);
  v.rows.slice(0,4).forEach((r,i)=>console.log('   row'+i+':', r.full.slice(0,180), ' MARKS=', JSON.stringify(r.marks)));
}
await browser.close();
