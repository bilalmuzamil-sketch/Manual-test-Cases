import {session,toView} from './rec.mjs'; import fs from 'fs';
const s=await session({vp:{width:1440,height:900},dpr:2}); const p=s.page; const out={mk:await s.marker()};
const loc=async name=>{ await p.click('[data-test-id=profile_menu_button]'); await p.waitForTimeout(900); await p.click('[data-test-id=select_location]'); await p.waitForTimeout(1200); await p.locator('.q-menu .q-item').filter({hasText:name}).last().click(); await p.waitForTimeout(6000); };
const where=()=>p.evaluate(()=>document.querySelector('[data-test-id=profile_menu_button]')?.innerText.replace(/\s+/g,' ').trim());
const empty=()=>p.evaluate(()=>{
 const txt=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&e.innerText?.trim()&&e.getBoundingClientRect().y>220&&e.getBoundingClientRect().y<880&&e.getBoundingClientRect().height>0&&!e.closest('thead,tr,[data-test-id^=board_column_header],header,.q-tabs')).map(e=>e.innerText.trim());
 const svg=[...document.querySelectorAll('svg[data-icon], i.q-icon')].filter(e=>{const r=e.getBoundingClientRect(); return r.y>220&&r.y<700&&r.width>=20&&!e.closest('thead,tr,header,button,[data-test-id^=board_column_header]');}).map(e=>(e.getAttribute('data-icon')||('MAT:'+e.innerText.trim()))+' '+Math.round(e.getBoundingClientRect().width)+'px bg '+getComputedStyle(e.parentElement).backgroundColor);
 const btns=[...document.querySelectorAll('button')].filter(b=>{const r=b.getBoundingClientRect(); return r.y>220&&r.y<880&&r.height>0&&!b.closest('thead,tr,[data-test-id^=board_column_header],[data-test-id^=board_card_]');}).map(b=>b.innerText.trim()+'#'+(b.dataset.testId||''));
 return {txt:txt.slice(0,6),svg,btns,rows:document.querySelectorAll('[data-test-id^=tech_view_row_],[data-test-id^=board_card_],tbody tr').length,url:location.search};});
const chips=()=>p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.getBoundingClientRect().y>60&&e.getBoundingClientRect().y<140&&/chip|filter|assigned|status|asset/i.test(e.dataset.testId)).map(e=>e.dataset.testId+':'+e.innerText.trim().slice(0,20)));
try{
 await s.go('/workorders?tab=estimates'); await p.waitForTimeout(3500); if(!/Empty Shop/.test(await where())) await loc('ZZAUTOTEST F2 Empty Shop');
 out.chips=await chips(); console.log('chips',JSON.stringify(out.chips));
 // 1 search only, empty location estimates
 for(const v of ['tech_view','board_view','list']){ await s.go('/workorders?tab=estimates&search=zzqnomatch'); await p.waitForTimeout(3000); await toView(p,v); await p.waitForTimeout(2000); out['emptyloc-search|'+v]=await empty(); await p.screenshot({path:`/tmp/qa11310/ev08/emptyloc-search-${v}.png`}); console.log('emptyloc search',v,JSON.stringify(out['emptyloc-search|'+v]).slice(0,400)); }
 // 2 filter only (Assigned to me), empty location estimates
 const am=out.chips.find(c=>/assigned/i.test(c))?.split(':')[0];
 for(const v of ['tech_view','board_view','list']){ await s.go('/workorders?tab=estimates'); await p.waitForTimeout(3000); await toView(p,v); await p.waitForTimeout(1500); if(am){ await p.click(`[data-test-id=${am}]`); await p.waitForTimeout(2500);} out['emptyloc-filter|'+v]=await empty(); await p.screenshot({path:`/tmp/qa11310/ev08/emptyloc-filter-${v}.png`}); console.log('emptyloc filter',v,JSON.stringify(out['emptyloc-filter|'+v]).slice(0,400));
   const clr=await p.$('button:has-text("Clear all filters")'); if(clr&&v!=='list'){ await clr.click(); await p.waitForTimeout(2500); out['afterClear|'+v]=await empty(); console.log('  after Clear all filters',JSON.stringify(out['afterClear|'+v]).slice(0,300)); } else if(am) { await p.click(`[data-test-id=${am}]`); await p.waitForTimeout(1500);} }
 // 3 filter + search, empty location
 for(const v of ['tech_view','board_view']){ await s.go('/workorders?tab=estimates&search=zzqnomatch'); await p.waitForTimeout(3000); await toView(p,v); await p.waitForTimeout(1500); if(am){ await p.click(`[data-test-id=${am}]`); await p.waitForTimeout(2500);} out['emptyloc-both|'+v]=await empty(); console.log('emptyloc filter+search',v,JSON.stringify(out['emptyloc-both|'+v]).slice(0,400)); if(am){ await p.click(`[data-test-id=${am}]`); await p.waitForTimeout(1500);} }
}catch(e){ out.err=e.message.slice(0,300); console.log('ERR',out.err); }
try{ await s.go('/workorders?tab=all'); await p.waitForTimeout(3000); await toView(p,'tech_view'); if(!/Heavy Duty/.test(await where())) await loc('Staging Heavy Duty - 9919'); out.locEnd=await where(); console.log('restored',out.locEnd);}catch(e){console.log('restore err',e.message);}
fs.writeFileSync('/tmp/qa11310/ev08/e11408c.json',JSON.stringify(out,null,1)); await s.close();
