import {sess,get} from './common.mjs'; import fs from 'fs';
const REC=process.env.REC; const s=await sess({dir:'/tmp/qa82',record:REC||null}); const p=s.page; const L=[]; const log=(k,v)=>{L.push({k,v}); console.log(k,JSON.stringify(v).slice(0,240));};
const chip=async()=>(await p.locator('[data-test-id=filter_chip_asOfDate]').innerText().catch(()=>'?')).replace(/calendar_today|keyboard_arrow_down|\n/g,' ').trim();
const shot=async n=>p.screenshot({path:`../ev/ui/${n}.png`});
const totals=async()=>p.evaluate(()=>{const r=[...document.querySelectorAll('tr,[role=row]')].find(x=>/^\s*Totals/.test(x.innerText)); return r?r.innerText.replace(/\s+/g,' '):null;});
const CAPS={"2026-11-31": "A link with 11/31/2026 (a day that does not exist) opens on today, no error", "9999-12-31": "A link with 12/31/9999 opens on today, no error", "9999-12-30": "12/30/9999 is the last day that can be opened", "2026-10-31": "An earlier day (10/31/2026) works as before"}; const errs=[]; p.on('response',r=>{ if(r.status()>=400 && /api\./.test(r.url())) errs.push(r.status()+' '+r.url().replace(/^.*\/api\//,'').slice(0,100)); });
const toasts=async()=>p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(n=>n.innerText.replace(/\s+/g,' ')));
const step=async(n,fn)=>{ try{await fn();}catch(e){log(n+' ERROR',e.message.slice(0,200));} }; const w=ms=>p.waitForTimeout(ms);
const reqs=[]; p.on('request',r=>{ if(/reporting\/reports\/ar-aging-summary\?/.test(r.url())) reqs.push(decodeURIComponent(r.url()).replace(/^.*\?/,'')); });
await s.go('/reports/ar-aging-summary?asOfDate=2026-12-31'); await w(5000); log('screen req',reqs.at(-1));
// exports from the screen
await step('export',async()=>{ await s.caption('Download (PDF) and (CSV) on 12/31 print the picked day');
  for(const [id,ext] of [['action_arsum_export_pdf','pdf'],['action_arsum_export_csv','csv']]){ await s.glideClick('btn_dropdown_arsum_export'); await w(800);
    const [dl]=await Promise.all([p.waitForEvent('download',{timeout:60000}), s.glideClick(id)]); const f=`../ev/ui/screen-arsum-1231.${ext}`; await dl.saveAs(f); log('export '+ext, dl.suggestedFilename()); await w(1500);} });
// past due filter keeps day
await step('pastdue',async()=>{ await s.caption('Changing a filter keeps the later day'); await s.glideClick('filter_chip_pastDue'); await w(800); await s.glideClick('filter_option_pastDue_1-30'); await w(800); await p.keyboard.press('Escape'); await w(3500);
  log('pastdue chip',(await p.locator('[data-test-id=filter_chip_pastDue]').innerText()).replace(/\s+/g,' ')); log('pastdue asOf',await chip()); log('pastdue url',p.url()); await shot('10-pastdue-keeps-day'); });
// location: tick only Lethbridge
await step('location pick',async()=>{ await s.glideClick('filter_chip_locationIds'); await w(800); await s.glideClick('filter_clear_selection_locationIds'); await w(500); await s.glideClick('filter_option_locationIds_f8a8b802-7780-4b16-bf10-343caeb616b2'); await w(800); await p.keyboard.press('Escape'); await w(3500);
  log('loc chip',(await p.locator('[data-test-id=filter_chip_locationIds]').innerText()).replace(/\s+/g,' ')); log('loc asOf',await chip()); log('loc url',p.url()); });
// customer chip
await step('customer',async()=>{ await s.glideClick('filter_chip_customerIds'); await w(1000); const opts=await p.evaluate(()=>[...document.querySelectorAll('.q-menu [data-test-id^=filter_option_customerIds_]')].slice(0,3).map(e=>e.getAttribute('data-test-id')));
  log('cust opts',opts); if(opts[0]){ await s.glideClick(opts[0]); await w(800);} await p.keyboard.press('Escape'); await w(3500);
  log('cust chip',(await p.locator('[data-test-id=filter_chip_customerIds]').innerText()).replace(/\s+/g,' ')); log('cust asOf',await chip()); });
// clear location chip -> empty state -> Clear all filters
await step('clear loc',async()=>{ await s.caption('Clearing Location, then Clear all filters, keeps the later day'); await s.glideClick('filter_chip_clear_locationIds'); await w(3000);
  const body=(await p.locator('main, .q-page').first().innerText()).replace(/\s+/g,' '); log('empty state text',(body.match(/No locations[^.]*\.?[^.]*\.?/)||[body.slice(0,200)])[0]); await shot('11-no-locations');
  const btn=p.locator('button,a',{hasText:/Clear all filters/i}).first(); log('clear all btn',await btn.count()); const tid=await btn.getAttribute('data-test-id').catch(()=>null); log('clear all tid',tid);
  if(tid) await s.glideClick(tid); else await btn.click(); await w(4000);
  log('after clear asOf',await chip()); log('after clear pastdue',(await p.locator('[data-test-id=filter_chip_pastDue]').innerText()).replace(/\s+/g,' ')); log('after clear loc',(await p.locator('[data-test-id=filter_chip_locationIds]').innerText()).replace(/\s+/g,' ')); log('after clear cust',(await p.locator('[data-test-id=filter_chip_customerIds]').innerText()).replace(/\s+/g,' ')); log('after clear url',p.url()); await shot('12-after-clear-all'); });
// switch location top right
await step('switch',async()=>{ await s.caption('Switching location keeps the later day'); await s.glideClick('profile_menu_button'); await w(1000); await s.glideClick('select_location'); await w(1200);
  const it=p.locator('.q-menu .q-item, [role=option]',{hasText:'Staging Lethbridge - 4310'}).last(); log('switch option count',await it.count()); await it.click(); await w(6000);
  log('switch asOf',await chip()); log('switch url',p.url()); log('switch profile',(await p.locator('[data-test-id=profile_menu_button]').innerText()).replace(/\s+/g,' ')); await shot('13-after-switch'); });
// reload
await step('reload',async()=>{ await s.caption('Reloading the page keeps the later day',{hold:300}); await p.reload(); await w(6000); log('reload asOf',await chip()); log('reload url',p.url()); await shot('14-after-reload'); });
// put the location back
await step('switch back',async()=>{ await s.glideClick('profile_menu_button'); await w(1000); await s.glideClick('select_location'); await w(1200); await p.locator('.q-menu .q-item, [role=option]',{hasText:'Staging Heavy Duty - 9919'}).last().click(); await w(4000); log('back',(await p.locator('[data-test-id=profile_menu_button]').innerText()).replace(/\s+/g,' ')); });
// bad and edge links
for(const [d,n] of [['2026-11-31','15-bad-1131'],['9999-12-31','16-bad-9999-12-31'],['9999-12-30','17-edge-9999-12-30'],['2026-10-31','18-earlier-1031']])
 await step('link '+d,async()=>{ const e0=errs.length; await s.go('/reports/ar-aging-summary?asOfDate='+d); await w(4000); await s.caption(CAPS[d],{hold:2200}); log('link '+d,{chip:await chip(),url:p.url(),toasts:await toasts(),newErrors:errs.slice(e0),totals:await totals()}); await shot(n); });
fs.writeFileSync('../ev/ui/log2.json',JSON.stringify(L,null,1));
fs.writeFileSync('../ev/ui/log2.json',JSON.stringify(L,null,1));
const v=await s.close(); if(v) fs.writeFileSync('/tmp/qa82/rec2.json',JSON.stringify(v)); process.exit(0);
