import {open} from './qa.mjs'; import fs from 'fs';
const s=await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa11310',vp:{width:1440,height:900},dpr:2}); const p=s.page;
const out={st:{}}; out.mk0=await p.evaluate(async()=>{const h=await (await fetch('/index.html',{cache:'no-store'})).text(); return (h.match(/app-version" content="([^"]+)/)||[])[1];});
const pref=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; out.pref0=await pref();
const geo=()=>p.evaluate(()=>{const R=e=>{if(!e)return null; const b=e.getBoundingClientRect(); return {x:Math.round(b.x),y:Math.round(b.y),w:Math.round(b.width),h:Math.round(b.height)};};
  const chip=document.querySelector('[data-test-id=filter_chip_status]');
  const empty=[...document.querySelectorAll('*')].find(e=>/No work orders match/.test(e.textContent)&&e.children.length===0);
  const clr=[...document.querySelectorAll('button,a')].find(e=>/Clear all filters/i.test(e.innerText||''));
  const menu=document.querySelector('.q-menu');
  const pills=[...document.querySelectorAll('tbody tr')].slice(0,4).map(tr=>{const td=tr.querySelector('td:nth-child(2)'); return td?{r:R(td),t:td.innerText.replace(/\d+/g,'').replace(/\s+/g,' ').trim()}:null;}).filter(Boolean);
  const ticks=menu?[...menu.querySelectorAll('.q-checkbox,[role=checkbox]')].map(c=>({t:(c.closest('label,div')?.innerText||'').split('\n')[0].trim(),on:c.getAttribute('aria-checked'),r:R(c)})):null;
  return {url:location.pathname+location.search,chip:R(chip),chipTxt:chip&&chip.innerText.replace(/\s+/g,' ').trim(),empty:R(empty),emptyTxt:empty&&empty.textContent.trim(),clear:R(clr),menu:R(menu),pills,ticks};});
const snap=async n=>{ await p.mouse.move(1435,895); await p.waitForTimeout(400); out.st[n]=await geo(); await p.screenshot({path:`/tmp/qa11310/p452/d-${n}.png`}); };
try{
 await s.go('/workorders'); await p.waitForTimeout(3500); await p.click('[data-test-id=filter_chip_status]'); await p.waitForTimeout(1500);
 for(const w of ['Approved','Estimate']){ await p.locator('.q-menu').getByText(w,{exact:true}).click(); await p.waitForTimeout(1800); }
 await snap('app-two-menu'); await p.keyboard.press('Escape'); await p.waitForTimeout(2000); await snap('app-two');
 await p.click('[data-test-id=filter_chip_status]'); await p.waitForTimeout(1200); await p.locator('.q-menu').getByText('Clear selection',{exact:true}).click().catch(()=>{}); await p.waitForTimeout(1500); await p.keyboard.press('Escape'); await p.waitForTimeout(1200);
 for(const [k,q] of [['bogus','status=bogus'],['capital','status=Approved'],['comma','status=approved,estimate']]){
   await s.go('/workorders?'+q); await p.waitForTimeout(3500); await snap(k);
   await p.click('[data-test-id=filter_chip_status]'); await p.waitForTimeout(1500); await snap(k+'-menu'); await p.keyboard.press('Escape'); await p.waitForTimeout(1000);
 }
 await s.go('/workorders?status=bogus'); await p.waitForTimeout(3500); const c=(await geo()).clear; if(c){ await p.mouse.click(c.x+c.w/2,c.y+c.h/2); await p.waitForTimeout(3500); await snap('bogus-cleared'); }
}catch(e){ out.err=e.message.slice(0,300); console.log('ERR',out.err); }
out.prefEnd=await pref(); if(JSON.stringify(out.prefEnd)!==JSON.stringify(out.pref0)){ const r=await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:out.pref0})}); out.restore=r.status; out.prefOk=JSON.stringify(await pref())===JSON.stringify(out.pref0); }
out.mk1=await p.evaluate(async()=>{const h=await (await fetch('/index.html',{cache:'no-store'})).text(); return (h.match(/app-version" content="([^"]+)/)||[])[1];});
out.when=new Date().toISOString();
for(const k in out.st) console.log(k,out.st[k].url,'|',out.st[k].chipTxt,'| empty',!!out.st[k].empty,'| ticks',JSON.stringify((out.st[k].ticks||[]).filter(t=>t.on==='true').map(t=>t.t)),'| pills',JSON.stringify(out.st[k].pills.map(p=>p.t)));
console.log('mk',out.mk0,out.mk1,'restore',out.restore,out.prefOk,out.when);
fs.writeFileSync('/tmp/qa11310/p452/d.json',JSON.stringify(out,null,1)); await s.close();
