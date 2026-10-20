import {open} from './qa.mjs'; import fs from 'fs';
const s=await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa11310',vp:{width:1440,height:900},dpr:2}); const p=s.page;
const out={mk:null,v:{}};
out.mk=await p.evaluate(async()=>{const h=await (await fetch('/index.html',{cache:'no-store'})).text(); return (h.match(/app-version" content="([^"]+)/)||[])[1];});
const pref=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value;
out.pref0=await pref();
const st=()=>p.evaluate(()=>{ const c=document.querySelector('[data-test-id=filter_chip_status]'); const b=c?c.getBoundingClientRect():null; const cs=c?getComputedStyle(c):null;
  const empty=[...document.querySelectorAll('*')].find(e=>/No work orders match/.test(e.textContent)&&e.children.length===0);
  const clearBtn=[...document.querySelectorAll('button,a')].find(e=>/Clear all filters/i.test(e.innerText||''));
  return {url:location.href.replace('https://app.shopview.com',''),rows:document.querySelectorAll('tbody tr').length,empty:empty?empty.textContent.trim():null,
    chip:c?{txt:c.innerText.replace(/\s+/g,' ').trim(),cls:c.className,bg:cs.backgroundColor,border:cs.borderColor,color:cs.color,box:{x:Math.round(b.x),y:Math.round(b.y),w:Math.round(b.width),h:Math.round(b.height)},icons:[...c.querySelectorAll('i,svg,.q-icon')].map(i=>(i.innerText||i.getAttribute('data-test-id')||i.tagName).trim())}:null,
    clear:clearBtn?(()=>{const r=clearBtn.getBoundingClientRect(); return {txt:clearBtn.innerText.trim(),x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)};})():null};});
const menu=()=>p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(i=>{const r=i.getBoundingClientRect(); const cb=i.querySelector('.q-checkbox,[role=checkbox],[aria-checked]'); return {txt:i.innerText.replace(/\s+/g,' ').trim(),checked:cb?(cb.getAttribute('aria-checked')||cb.className.includes('truthy')):null,x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)};}));
const shot=async n=>{ await p.mouse.move(1435,895); await p.waitForTimeout(300); await p.screenshot({path:`/tmp/qa11310/p452/${n}.png`}); };
try{
 // control
 await s.go('/workorders'); await p.waitForTimeout(3500); out.v.control=await st(); await shot('b0-control');
 // in-app: tick two statuses
 await p.click('[data-test-id=filter_chip_status]'); await p.waitForTimeout(1500); out.menuNormal=await menu(); await shot('b1-menu-normal');
 for(const want of ['Approved','Estimate']){ const it=out.menuNormal.find(m=>m.txt.replace(/^check_box(_outline_blank)?\s*/,'')===want || new RegExp('\\b'+want+'$').test(m.txt)); if(it){ await p.mouse.click(it.x+it.w/2,it.y+it.h/2); await p.waitForTimeout(1800);} }
 await p.keyboard.press('Escape'); await p.waitForTimeout(2500); out.v.uiTwo=await st(); await shot('b2-ui-two-statuses');
 out.prefAfterUi=await pref();
 // variants by link
 for(const [k,q] of [['bogus','status=bogus'],['comma','status=approved,estimate'],['capital','status=Approved'],['mixed','status=approved&status=bogus'],['valid','status=approved'],['repeated','status=approved&status=estimate']]){
   await s.go('/workorders?'+q); await p.waitForTimeout(3500); out.v[k]=await st(); await shot('b3-'+k);
   if(k==='bogus'){ await p.click('[data-test-id=filter_chip_status]'); await p.waitForTimeout(1500); out.menuBogus=await menu(); await shot('b4-bogus-menu'); await p.keyboard.press('Escape'); await p.waitForTimeout(1000);
     const c=out.v.bogus.clear; if(c){ await p.mouse.click(c.x+c.w/2,c.y+c.h/2); await p.waitForTimeout(3500); out.v.bogusCleared=await st(); await shot('b5-bogus-cleared'); } }
   console.log(k,JSON.stringify(out.v[k]).slice(0,420));
 }
 await s.go('/workorders'); await p.waitForTimeout(3500); out.v.after=await st(); out.prefEnd=await pref();
}catch(e){ out.err=e.message.slice(0,300); console.log('ERR',out.err); await shot('err'); }
// restore saved prefs if they moved
if(JSON.stringify(out.prefEnd)!==JSON.stringify(out.pref0)){ const r=await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:out.pref0})}); out.restore=r.status; out.prefRestored=await pref(); }
console.log('menuNormal',JSON.stringify(out.menuNormal).slice(0,700)); console.log('uiTwo',JSON.stringify(out.v.uiTwo).slice(0,300)); console.log('menuBogus',JSON.stringify(out.menuBogus).slice(0,500)); console.log('cleared',JSON.stringify(out.v.bogusCleared).slice(0,300)); console.log('after',JSON.stringify(out.v.after).slice(0,200)); console.log('prefs moved by UI?',JSON.stringify(out.prefAfterUi.filters),'end',JSON.stringify(out.prefEnd&&out.prefEnd.filters),'restore',out.restore, 'mk',out.mk);
fs.writeFileSync('/tmp/qa11310/p452/b.json',JSON.stringify(out,null,1)); await s.close();
