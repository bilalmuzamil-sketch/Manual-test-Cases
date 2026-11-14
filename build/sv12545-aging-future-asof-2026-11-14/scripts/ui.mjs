import {sess} from './common.mjs'; import fs from 'fs';
const REC=process.env.REC; const s=await sess({dir:'/tmp/qa81',record:REC||null}); const p=s.page; const L=[]; const log=(k,v)=>{L.push({k,v,at:new Date().toISOString()}); console.log(k,JSON.stringify(v).slice(0,260));};
const CUST='72ccef1e-6cf2-4910-a5c6-3e20cbac7e73', VEND='68c72fe7-8fbe-4795-85aa-7e91fbb54c7e';
const chip=async()=>(await p.locator('[data-test-id=filter_chip_asOfDate]').innerText().catch(()=>'?')).replace(/calendar_today|keyboard_arrow_down|\n/g,' ').trim();
const geo=async(name,sels)=>{ const g={}; for(const [k,sel] of Object.entries(sels)) g[k]=await p.locator(sel).first().evaluate(e=>{const r=e.getBoundingClientRect(); return [r.x,r.y,r.width,r.height]}).catch(()=>null);
  await p.screenshot({path:`../ev/ui/${name}.png`}); fs.writeFileSync(`../ev/ui/${name}.json`,JSON.stringify({url:p.url(),g})); };
const totals=async()=>p.evaluate(()=>{const r=[...document.querySelectorAll('tr,[role=row]')].find(x=>/^\s*Totals/.test(x.innerText)); return r?r.innerText.replace(/\s+/g,' '):null;});
const step=async(name,fn)=>{ try{ await fn(); }catch(e){ log(name+' ERROR',e.message.slice(0,200)); } };
const wait=ms=>p.waitForTimeout(ms);
// 1 open from Reports menu
await step('1 reports menu',async()=>{ await s.go('/dashboard'); await wait(3000);
  await s.caption('A/R Aging Summary, opened from the Reports menu, starts on today');
  await s.glideClick('button_desktop_nav_link'+'') .catch(()=>{});
  await p.locator('[data-test-id=button_desktop_nav_link]',{hasText:'Reports'}).first().click(); await wait(2500);
  await s.glideClick('report_nav_aging_summary_report'); await wait(5000);
  log('1 chip today',await chip()); log('1 url',p.url()); log('1 totals today',await totals());
  await geo('01-today',{chip:'[data-test-id=filter_chip_asOfDate]',row:'[data-test-id^=aging_summary_report_row_'+CUST+']'}); });
// 2 open menu, show days after today enabled, next month, pick 31
await step('2 pick dec 31',async()=>{ await s.caption('Days after today can be picked; the next-month arrow works');
  await s.glideClick('filter_chip_asOfDate'); await wait(1200);
  const st=await p.evaluate(()=>{const c=document.querySelector('[data-test-id=filter_single_date_asOfDate]'); const b=[...c.querySelectorAll('button[aria-label$="2026"]')]; return b.map(x=>[x.getAttribute('aria-label'),x.disabled||x.classList.contains('disabled')]);});
  { const d=p.locator('[aria-label="20 November 2026"]'); const b=await d.boundingBox(); await p.mouse.move(b.x-30,b.y+b.height/2,{steps:15}); await p.waitForTimeout(2200); }
  log('2 november days disabled',st.filter(x=>x[1]).map(x=>x[0])); log('2 november days total',st.length);
  await geo('02-menu-november',{cal:'[data-test-id=filter_single_date_asOfDate]',d15:'[aria-label="15 November 2026"]',d30:'[aria-label="30 November 2026"]',next:'[aria-label="Next month"]'});
  const nb=p.locator('[data-test-id=filter_single_date_asOfDate] [aria-label="Next month"]'); const bb=await nb.boundingBox(); await p.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2,{steps:15}); await p.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); await wait(1200);
  log('2 month after next',(await p.locator('[data-test-id=filter_single_date_asOfDate]').innerText()).split('\n').slice(0,6).join(' '));
  await geo('03-menu-december',{cal:'[data-test-id=filter_single_date_asOfDate]',d31:'[aria-label="31 December 2026"]'});
  await s.caption('December: pick the 31st',{hold:1500});
  const d=p.locator('[aria-label="31 December 2026"]'); const db=await d.boundingBox(); await p.mouse.move(db.x+db.width/2,db.y+db.height/2,{steps:15}); await p.mouse.click(db.x+db.width/2,db.y+db.height/2); await wait(4000);
  log('2 chip after pick',await chip()); log('2 url after pick',p.url()); log('2 totals 12/31',await totals());
  log('2 10 Trucking row',(await p.locator('[data-test-id=aging_summary_report_row_'+CUST+']').innerText().catch(()=>'?')).replace(/\s+/g,' '));
  await s.caption('As of 12/31/2026: the date is in the chip and in the address'); await wait(600);
  await geo('04-after-dec31',{chip:'[data-test-id=filter_chip_asOfDate]',row:'[data-test-id=aging_summary_report_row_'+CUST+']',cur:'[data-test-id=header_arsum_current]'}); });
// 3 next-year arrow
await step('3 next year',async()=>{ await s.caption('The next-year arrow works too',{hold:300}); await s.glideClick('filter_chip_asOfDate'); await wait(1000);
  const ny=p.locator('[data-test-id=filter_single_date_asOfDate] [aria-label="Next year"]'); const b=await ny.boundingBox(); await p.mouse.move(b.x+b.width/2,b.y+b.height/2,{steps:12}); await p.mouse.click(b.x+b.width/2,b.y+b.height/2); await wait(1800);
  log('3 after next year',(await p.locator('[data-test-id=filter_single_date_asOfDate]').innerText()).split('\n').slice(0,6).join(' '));
  await geo('05-next-year',{cal:'[data-test-id=filter_single_date_asOfDate]'}); await p.keyboard.press('Escape'); await wait(800); log('3 chip unchanged',await chip()); });
// 4 drill to A/R Collection
await step('4 drill AR',async()=>{ await s.caption('Clicking a customer opens A/R Collection on the same later day');
  await s.glideClick('link_arsum_party_'+CUST); await wait(5000);
  log('4 url',p.url()); log('4 chip',await chip()); log('4 cust chip',(await p.locator('[data-test-id=filter_chip_customerIds]').innerText().catch(()=>'?')).replace(/\s+/g,' '));
  const all=p.locator('[data-test-id$=_toggle_all]').first(); if(await all.count() && await all.isEnabled()){ await all.click(); await wait(2500);} 
  const row=await p.evaluate(()=>{const r=[...document.querySelectorAll('tr,[role=row]')].filter(x=>/S2-4022[0-9]|S2-402/.test(x.innerText)); return r.map(x=>x.innerText.replace(/\s+/g,' '));});
  log('4 rows',row); await geo('06-ar-collection',{chip:'[data-test-id=filter_chip_asOfDate]'}); });
fs.writeFileSync('../ev/ui/log1.json',JSON.stringify(L,null,1));
// 5 A/P Summary link
await step('5 AP link',async()=>{ await s.caption('A saved link with a later day opens on that day'); await s.go('/reports/ap-aging-summary?asOfDate=2026-12-31'); await wait(5000);
  log('5 chip',await chip()); log('5 url',p.url()); log('5 totals',await totals()); await geo('07-ap-summary-link',{chip:'[data-test-id=filter_chip_asOfDate]'});
  const lk=p.locator('[data-test-id=link_apsum_party_'+VEND+']'); log('5 vendor link exists',await lk.count());
  if(await lk.count()){ await s.glideClick('link_apsum_party_'+VEND); await wait(5000); log('5 drill url',p.url()); log('5 drill chip',await chip());
    const all=p.locator('[data-test-id$=_toggle_all]').first(); if(await all.count() && await all.isEnabled()){ await all.click(); await wait(2500);} 
    log('5 rows',await p.evaluate(()=>[...document.querySelectorAll('tr,[role=row]')].filter(x=>/ZZPV10282011/.test(x.innerText)).map(x=>x.innerText.replace(/\s+/g,' '))));
    await geo('08-ap-unpaid',{chip:'[data-test-id=filter_chip_asOfDate]'}); } });
// 6 detail reports
for(const [name,url,pat] of [['ar-detail',`/reports/ar-aging-detail?asOfDate=2026-12-31&customerIds=${CUST}`,/S2-40221/],['ap-detail',`/reports/ap-aging-detail?asOfDate=2026-12-31&vendorIds=${VEND}`,/ZZPV10282011/]])
 await step('6 '+name,async()=>{ await s.caption(name==='ar-detail'?'A/R Aging Detail on 12/31: the invoice sits in the bucket for that day':'A/P Aging Detail on 12/31: Past Due counted to that day'); await s.go(url); await wait(5000);
  const all=p.locator('[data-test-id$=_toggle_all]').first(); if(await all.count() && await all.isEnabled()){ await all.click(); await wait(3000);} 
  log('6 '+name+' chip',await chip()); log('6 '+name+' url',p.url());
  log('6 '+name+' groups',await p.evaluate(()=>[...document.querySelectorAll('tr,[role=row]')].map(x=>x.innerText.replace(/\s+/g,' ')).filter(t=>/days past due|^\s*Current|Total for/i.test(t)).slice(0,12)));
  log('6 '+name+' row',await p.evaluate(src=>{const re=new RegExp(src); return [...document.querySelectorAll('tr,[role=row]')].filter(x=>re.test(x.innerText)).map(x=>x.innerText.replace(/\s+/g,' '));},pat.source));
  await geo('09-'+name,{chip:'[data-test-id=filter_chip_asOfDate]'}); });
fs.writeFileSync('../ev/ui/log1.json',JSON.stringify(L,null,1));
const v=await s.close(); if(v) fs.writeFileSync('/tmp/qa81/rec1.json',JSON.stringify(v)); process.exit(0);
