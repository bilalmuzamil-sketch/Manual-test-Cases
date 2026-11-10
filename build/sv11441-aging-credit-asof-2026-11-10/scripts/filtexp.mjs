// screen: (optional) Past due chip -> tick RANGE; expand KEYS; screenshot; then export CSV (+PDF) via the ... menu; save files
import {sess} from './common.mjs'; import fs from 'fs';
const REP=process.env.REP||'ar-aging-detail', PRE=process.env.PRE||'ardet', TAG=process.env.TAG||REP, Q=process.env.Q||'';
const s=await sess({acceptDownloads:true}); const p=s.page; const reqs=[]; p.on('request',r=>{ if(/reporting\/reports/.test(r.url())) reqs.push(decodeURIComponent(r.url().replace(/^https:\/\/[^/]+/,''))); });
const OUT='../ev/'+TAG; fs.mkdirSync(OUT,{recursive:true}); const R={};
await s.go('/reports/'+REP+Q); await p.waitForTimeout(7000);
if(process.env.RANGE){ await p.click('[data-test-id="filter_chip_pastDue"]'); await p.waitForTimeout(1500); R.options=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item, .q-menu [data-test-id]')].map(e=>(e.getAttribute('data-test-id')||'')+'='+e.innerText.trim().replace(/\s+/g,' ').slice(0,30)));
  await p.click(`[data-test-id="filter_option_pastDue_${process.env.RANGE}"]`); await p.waitForTimeout(1200); await p.keyboard.press('Escape'); await p.waitForTimeout(5000); }
if(process.env.VEND){ await p.click('[data-test-id="filter_chip_vendorIds"]'); await p.waitForTimeout(1500); await p.keyboard.type(process.env.VEND,{delay:60}); await p.waitForTimeout(3000);
  R.vopts=await p.evaluate(()=>[...document.querySelectorAll('.q-menu [data-test-id]')].map(e=>e.getAttribute('data-test-id')+'='+e.innerText.trim().replace(/\s+/g,' ').slice(0,30)).slice(0,12));
  const o=p.locator(process.env.VENDID?`.q-menu [data-test-id="filter_option_vendorIds_${process.env.VENDID}"]`:'.q-menu [data-test-id^="filter_option_vendorIds_"]').first(); if(await o.count()){ await o.click(); await p.waitForTimeout(1000);} await p.keyboard.press('Escape'); await p.waitForTimeout(5000); }
for(const k of (process.env.KEYS||'').split(',').filter(Boolean)){ const b=p.locator(`[data-test-id$="_toggle_${k}"]`).first(); if(await b.count()){ await b.click(); await p.waitForTimeout(5000);} else R['noToggle_'+k]=1; }
R.url=p.url(); await p.screenshot({path:OUT+'/screen.png',fullPage:!!process.env.FULL});
R.rows=await p.evaluate(()=>[...document.querySelectorAll('tbody tr')].filter(r=>r.offsetParent).map(r=>{const b=r.getBoundingClientRect(); return [r.innerText.replace(/\s+/g,' ').slice(0,160),Math.round(b.x),Math.round(b.y),Math.round(b.width),Math.round(b.height)];}));
R.heads=await p.evaluate(()=>[...document.querySelectorAll('thead th')].map(t=>{const b=t.getBoundingClientRect(); return [t.innerText.trim(),Math.round(b.x),Math.round(b.width)];}));
for(const fmt of (process.env.FMTS||'').split(',').filter(Boolean)){ await p.locator(`[data-test-id="btn_dropdown_${PRE}_export"]`).click({timeout:90000}); await p.waitForTimeout(1200);
  const items=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item, .q-menu [data-test-id]')].map(e=>(e.getAttribute('data-test-id')||'')+'='+e.innerText.trim().replace(/\s+/g,' ').slice(0,30))); R['menu_'+fmt]=items;
  const [dl]=await Promise.all([p.waitForEvent('download',{timeout:60000}).catch(e=>null), p.locator('.q-menu .q-item',{hasText:new RegExp(fmt,'i')}).first().click()]);
  if(dl){ const f=OUT+'/'+(dl.suggestedFilename()||('export.'+fmt.toLowerCase())); await dl.saveAs(f); R['file_'+fmt]=f; } await p.waitForTimeout(2500);
  R['toast_'+fmt]=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(n=>n.innerText.replace(/\n/g,' '))); }
R.reqs=reqs.slice(-8); fs.writeFileSync(OUT+'/result.json',JSON.stringify(R,null,1)); console.log(JSON.stringify({vopts:R.vopts,url:R.url,options:R.options,files:Object.entries(R).filter(([k])=>k.startsWith('file_')||k.startsWith('toast_')||k.startsWith('menu_')),reqs:R.reqs.slice(-3)},null,1).slice(0,3000));
console.log(R.rows.filter(r=>/CM11315-419|DEP11315-4705|Current|Total for|C-1366|Andrews|ZZAUTOTEST/.test(r[0])).map(r=>r[0]).join('\n'));
await s.close(); process.exit(0);
