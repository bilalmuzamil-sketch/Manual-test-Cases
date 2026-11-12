// drive the report on screen: tick one customer/vendor, read the screen's "Total for" rows, click ⋯ → Download (PDF) / (CSV); capture request + file
import {sess} from './common.mjs'; import fs from 'fs';
const REP=process.env.REP, NAME=process.env.NAME, TAG=process.env.TAG, ASOF=process.env.ASOF||'2026-11-11';
const KEY=REP.startsWith('ar')?'customerIds':'vendorIds';
const s=await sess({acceptDownloads:true,dir:process.env.QD||'/tmp/qa73'}); const p=s.page; const reqs=[]; p.on('request',r=>{ if(/\/export/.test(r.url())) reqs.push(decodeURIComponent(r.url().replace(/^https:\/\/[^/]+/,''))); });
await s.go('/reports/'+REP+'?asOfDate='+ASOF+(process.env.URLX||'')); await p.waitForTimeout(7000);
await s.glideClick('filter_chip_'+KEY); await p.waitForTimeout(1500); await s.glideClick('filter_search_'+KEY); await p.keyboard.type(NAME.slice(0,18),{delay:30}); await p.waitForTimeout(3000);
const opt=await p.evaluate(([n,K])=>{const e=[...document.querySelectorAll(`[data-test-id^="filter_option_${K}_"]`)].find(x=>x.innerText.trim()===n); if(!e) return null; const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,id:e.getAttribute('data-test-id').split('_').pop()}},[NAME,KEY]);
if(!opt){ console.log('NO OPTION for',NAME); process.exit(1);} await p.mouse.click(opt.x,opt.y); await p.waitForTimeout(1200); await p.keyboard.press('Escape'); await p.waitForTimeout(5000);
console.log('url',p.url().replace(/^https:\/\/[^/]+/,''),'id',opt.id);
// expand everything on screen
const all=p.locator('[data-test-id$="_toggle_all"]').first(); if(await all.count()&&await all.isEnabled()){ await all.click(); await p.waitForTimeout(5000);} 
const tg=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id*="_toggle_"]')].filter(b=>!/toggle_all/.test(b.getAttribute('data-test-id'))&&/arrow_right/.test(b.innerText)).length); 
if(tg){ await p.evaluate(()=>[...document.querySelectorAll('[data-test-id*="_toggle_"]')].filter(b=>!/toggle_all/.test(b.getAttribute('data-test-id'))&&/arrow_right/.test(b.innerText)).forEach(b=>b.click())); await p.waitForTimeout(5000);} 
const screen=await p.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(r=>r.innerText.replace(/\s+/g,' ').trim()).filter(t=>/^Total/.test(t)||/Total for/.test(t)));
console.log('SCREEN total rows:',JSON.stringify(screen));
await p.screenshot({path:`../ev/${TAG}-screen.png`});
for(const fmt of ['PDF','CSV']){ const btn=await p.evaluate(()=>{const b=document.querySelector('[data-test-id^="btn_dropdown_"][data-test-id$="_export"]')||[...document.querySelectorAll('button')].find(x=>/Export report/i.test(x.getAttribute('aria-label')||'')); const r=b.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}}); await p.mouse.click(btn.x,btn.y); await p.waitForTimeout(1200);
  const it=await p.evaluate(f=>{const e=[...document.querySelectorAll('.q-menu .q-item')].find(x=>x.innerText.includes('Download ('+f+')')); const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}},fmt);
  const [dl]=await Promise.all([p.waitForEvent('download',{timeout:60000}),p.mouse.click(it.x,it.y)]); const f=`../ev/${TAG}.${fmt.toLowerCase()}`; await dl.saveAs(f); console.log('downloaded',fmt,dl.suggestedFilename()); await p.waitForTimeout(1500); }
console.log('export requests:',reqs.join(' | '));
fs.writeFileSync(`../ev/${TAG}-screen.json`,JSON.stringify({marker:await s.marker(),url:p.url(),id:opt.id,screen,reqs},null,1)); await s.close(); process.exit(0);
