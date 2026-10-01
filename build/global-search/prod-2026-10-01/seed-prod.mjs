/**
 * SEED PRODUCTION with the records run 415's checks search for.
 *
 * QA lead, 2026-10-01: "For anything that requires seeding in the production environment you are
 * supposed to SEED the data, do not skip anything or block yourself on data seeding. Nothing should
 * block you CRUD anything you want on production environment."
 *
 * The suite was written against staging records, so on production those searches return nothing.
 * Rule 107's data amendment: a missing record is never a reason to leave a check unjudged - create
 * it. These are named exactly as staging named them so the specs run unchanged.
 *
 * 🛑 RUN THIS ONLY WHEN THE SUITE IS NOT RUNNING. A second sign-in as the same account expires the
 * running session (playbook section K). That is sequencing, not a blocker.
 *
 * Writes through the PAGE's own session (credentials:'include'), the pattern proven on staging in
 * staging-run-2026-09-28/sweep-v1e.mjs, so no second login is minted at all.
 */
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const OUT='/home/user/Manual-test-Cases/build/global-search/prod-2026-10-01/';
const { page, browser } = await bootProdLogin('/customers', { settle: 12000 });
page.setDefaultTimeout(30000);

const made = await page.evaluate(async () => {
  const API='https://api.shopview.com';
  const post = async (p, body) => {
    const r = await fetch(API+p, { method:'POST', credentials:'include',
      headers:{'Content-Type':'application/json', Accept:'application/json'}, body: JSON.stringify(body) });
    let b=null; try{ b=await r.json(); }catch{}
    return { path:p, status:r.status, id:b?.id||b?.data?.id||null, err: r.status>=400 ? JSON.stringify(b).slice(0,160) : null };
  };
  const res = { customers:[], vendors:[], parts:[], notes:[] };

  // --- CUSTOMERS -------------------------------------------------------------------------------
  // ZZLONGROW: a deliberately long name, for the truncation checks.
  res.customers.push(await post('/api/customers/create', {
    name:'ZZLONGROW Transcontinental Heavy Haulage And Equipment Repair Services Incorporated',
    address:'1 Longrow Way', city:'Fernvale', state_or_province:'Ohio', postal_code:'44872-2001',
    phone:'(264) 400-0500', country_code:'US' }));
  // The near-miss PAIR for the close-match checks: two names one letter apart.
  res.customers.push(await post('/api/customers/create', {
    name:'ZZSOFTHIT Cartage', address:'2 Softhit Road', city:'Fernvale',
    state_or_province:'Ohio', postal_code:'44872-2002', phone:'(264) 400-0501', country_code:'US' }));
  res.customers.push(await post('/api/customers/create', {
    name:'ZZSOFTHIY Cartage', address:'3 Softhiy Road', city:'Fernvale',
    state_or_province:'Ohio', postal_code:'44872-2003', phone:'(264) 400-0502', country_code:'US' }));
  // The telephone the customer checks search for, and a distinctive postcode.
  res.customers.push(await post('/api/customers/create', {
    name:'ZZPHONE Greene Transport', address:'4 Greene Street', city:'Priscillabury',
    state_or_province:'Nunavut', postal_code:'H8A3X9', phone:'609-461-6502', country_code:'CA' }));
  // Two rows sharing a bold line, to tell apart on the secondary line.
  res.customers.push(await post('/api/customers/create', {
    name:'ZZIDENTICAL Freight', address:'10 First Avenue', city:'Fernvale',
    state_or_province:'Ohio', postal_code:'44872-2004', phone:'(264) 400-0503', country_code:'US' }));
  res.customers.push(await post('/api/customers/create', {
    name:'ZZIDENTICAL Freight', address:'99 Second Avenue', city:'Youngville',
    state_or_province:'Saskatchewan', postal_code:'S7K1J5', phone:'(264) 400-0504', country_code:'CA' }));

  // --- VENDORS ---------------------------------------------------------------------------------
  // Endpoint is NOT indexed in the playbook for prod; try the documented shapes and RECORD which
  // one answers, so the next session does not have to rediscover it (Rule 93).
  for (const p of ['/api/vendors/create','/api/parts-catalogue/vendor/create','/api/vendor/create']) {
    const r = await post(p, { name:'ZZLONGROW Identical Name Supply', address:'5 Vendor Row',
      city:'Fernvale', state_or_province:'Ohio', postal_code:'44872-2005',
      phone:'(264) 400-0600', email:'zzhidden.vendor@prod.shopview.local', country_code:'US' });
    res.vendors.push(r);
    if (r.status < 400) break;
  }
  return res;
});

fs.writeFileSync(OUT+'seed-result.json', JSON.stringify(made,null,1));
console.log('--- CUSTOMERS ---');
made.customers.forEach(c=>console.log(`  ${c.status}  ${c.id||''}  ${c.err||''}`));
console.log('--- VENDORS (endpoint discovery) ---');
made.vendors.forEach(v=>console.log(`  ${v.status}  ${v.path}  ${v.id||''}  ${v.err||''}`));
console.log('SEED DONE');
await browser.close();
