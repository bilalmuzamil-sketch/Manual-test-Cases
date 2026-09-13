// PRODUCTION -- C53568. "The page contains ZZAUTOTEST" is not evidence: the search box echoes what I
// typed (the mistake L0063 already cost me once). Read the TABLE ROWS only.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`, APP='https://app.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), case:'C53568'};
const save=()=>fs.writeFileSync(`${DIR}/PR65.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
const look=async(url,tag,term)=>{ await page.goto(url,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
  await page.waitForTimeout(13000);
  const d=await page.evaluate((t)=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const rows=[...document.querySelectorAll('tbody tr')].filter(ok).map(tr=>(tr.textContent||'').replace(/\s+/g,' ').trim());
    return {rowCount:rows.length, matching:rows.filter(r=>r.includes(t)).slice(0,5), first:rows.slice(0,3)};}, term);
  await page.screenshot({path:`${EV}/PR65-${tag}.png`, fullPage:true});
  R[tag]=d; L('%-18s rows=%d matching "%s": %d %s', tag, d.rowCount, term, d.matching.length, JSON.stringify(d.matching));
  save(); return d; };
// positive control: a search that MUST return rows
await look(`${APP}/workorders?search=S2-`,'control-S2','S2-');
await look(`${APP}/workorders?search=ZZAUTOTEST`,'search-tag','ZZAUTOTEST');
await look(`${APP}/workorders?search=IMP-001`,'search-impno','IMP-001');
save(); await browser.close();
