import {open} from './qa.mjs'; import fs from 'fs';
const s=await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa11310',vp:{width:1440,height:900},dpr:2}); const p=s.page;
const out={};
const pref=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; out.pref0=await pref();
const statuses=()=>p.evaluate(()=>{const m={}; for(const tr of document.querySelectorAll('tbody tr')){ const t=(tr.querySelector('td:nth-child(2)')?.innerText||'').replace(/\d+/g,'').replace(/\s+/g,' ').trim(); if(t) m[t]=(m[t]||0)+1;} return m;});
const chip=()=>p.evaluate(()=>{const c=document.querySelector('[data-test-id=filter_chip_status]'); return c.innerText.replace(/\s+/g,' ').trim()+' | active='+c.className.includes('filter-chip--active');});
const ticks=()=>p.evaluate(()=>{const m=document.querySelector('.q-menu'); if(!m) return null; return [...m.querySelectorAll('.q-checkbox,[role=checkbox]')].map(c=>{const l=(c.closest('label,div')?.innerText||c.innerText||'').trim(); return l.split('\n')[0]+':'+(c.getAttribute('aria-checked')||'');});});
const shot=async n=>{ await p.mouse.move(1435,895); await p.waitForTimeout(300); await p.screenshot({path:`/tmp/qa11310/p452/${n}.png`}); };
try{
 await s.go('/workorders'); await p.waitForTimeout(3500); out.control={st:await statuses(),chip:await chip()};
 await s.go('/workorders?status=approved'); await p.waitForTimeout(3500); out.valid={st:await statuses(),chip:await chip()}; await p.click('[data-test-id=filter_chip_status]'); await p.waitForTimeout(1500); out.valid.ticks=await ticks(); await shot('c1-valid-menu'); await p.keyboard.press('Escape'); await p.waitForTimeout(800);
 await s.go('/workorders?status=Approved'); await p.waitForTimeout(3500); out.capital={st:await statuses(),chip:await chip()}; await p.click('[data-test-id=filter_chip_status]'); await p.waitForTimeout(1500); out.capital.ticks=await ticks(); await shot('c2-capital-menu'); await p.keyboard.press('Escape'); await p.waitForTimeout(800);
 await s.go('/workorders?status=bogus'); await p.waitForTimeout(3500); out.bogus={st:await statuses(),chip:await chip()}; await p.click('[data-test-id=filter_chip_status]'); await p.waitForTimeout(1500); out.bogus.ticks=await ticks(); await shot('c3-bogus-menu'); await p.keyboard.press('Escape'); await p.waitForTimeout(800);
 // in-app: tick two
 await s.go('/workorders'); await p.waitForTimeout(3500); await p.click('[data-test-id=filter_chip_status]'); await p.waitForTimeout(1500);
 for(const w of ['Approved','Estimate']){ await p.locator('.q-menu').getByText(w,{exact:true}).click(); await p.waitForTimeout(1800); }
 out.ui={url:p.url().replace('https://app.shopview.com',''),ticks:await ticks()}; await shot('c4-ui-two-menu'); await p.keyboard.press('Escape'); await p.waitForTimeout(2000);
 out.ui.chip=await chip(); out.ui.st=await statuses(); out.ui.url2=p.url().replace('https://app.shopview.com',''); await shot('c5-ui-two'); out.prefUi=await pref();
 // clear via menu Clear selection
 await p.click('[data-test-id=filter_chip_status]'); await p.waitForTimeout(1200); await p.locator('.q-menu').getByText('Clear selection',{exact:true}).click().catch(()=>{}); await p.waitForTimeout(1500); await p.keyboard.press('Escape'); await p.waitForTimeout(1500);
 // dashboard links
 await s.go('/dashboard'); await p.waitForTimeout(6000); out.dash=await p.evaluate(()=>[...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href')).filter(h=>/workorders\?/.test(h)));
}catch(e){ out.err=e.message.slice(0,300); console.log('ERR',out.err); await shot('c-err'); }
out.prefEnd=await pref();
if(JSON.stringify(out.prefEnd)!==JSON.stringify(out.pref0)){ const r=await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:out.pref0})}); out.restore=r.status; out.prefRestored=JSON.stringify(await pref())===JSON.stringify(out.pref0); }
for(const k of ['control','valid','capital','bogus','ui']) console.log(k,JSON.stringify(out[k]).slice(0,600));
console.log('prefUi filters',JSON.stringify(out.prefUi&&out.prefUi.filters),'| dash',JSON.stringify(out.dash).slice(0,400),'| restore',out.restore,out.prefRestored);
fs.writeFileSync('/tmp/qa11310/p452/c.json',JSON.stringify(out,null,1)); await s.close();
