// usage: node listcap2.mjs <branch|prod> <outdir> <search> <nums,...> <locName>
import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const [env,OUT,search,numsCsv,LOCNAME]=process.argv.slice(2); const NUMS=numsCsv.split(','); fs.mkdirSync(OUT,{recursive:true});
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim();
const s=env==='branch'? await open({env:'branch',ticket:'10579',dir:'/tmp/qa1',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}})
  : await open({env:'prod',dir:'/tmp/qa2',user:'bilal.muzamil+serviceadvisornoreports@shopview.com',pw:fs.readFileSync('/tmp/sv-prod-pw2.txt','utf8').trim()});
const p=s.page; const prefW=[]; p.on('request',r=>{ if(/preferences/.test(r.url())&&r.method()!=='GET') prefW.push({m:r.method(),u:r.url(),b:r.postData()}); }); const info={marker:await s.marker(),at:new Date().toISOString(),prefBefore:(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value};
await s.go('/workorders'); await p.waitForTimeout(3000);
const hdr=()=>p.evaluate(()=>document.querySelector('[data-test-id="profile_menu_button"]').innerText.split('\n')[0]);
if(!(await hdr()).includes(LOCNAME)){ await p.click('[data-test-id="profile_menu_button"]'); await p.waitForTimeout(1000); await p.click('[data-test-id="select_location"]'); await p.waitForTimeout(1200);
  for(const e of await p.$$('.q-menu .q-item, [role=option]')){ const t=(await e.innerText()).trim(); if(t.split('\n').pop().trim()===LOCNAME){ await e.click(); await p.waitForTimeout(4000); break; } } await s.go('/workorders'); await p.waitForTimeout(3000); }
info.location=await hdr();
await p.click('[data-test-id="display_option_list"]').catch(()=>{}); await p.waitForTimeout(1500); await p.click('[data-test-id="tab_all"]'); await p.waitForTimeout(2500);
await p.click('[data-test-id="button_column_selection"]'); await p.waitForTimeout(1500);
info.columnMenu=await p.evaluate(()=>[...document.querySelectorAll('.q-menu [data-test-id], .q-menu .q-item, .q-menu label')].map(e=>(e.getAttribute('data-test-id')||'')+'='+(e.innerText||'').trim().replace(/\n/g,' ')).slice(0,40));
const tog=await p.evaluate(()=>{ const el=[...document.querySelectorAll('.q-menu *')].find(e=>e.children.length===0&&/^\s*Waiting On Parts\s*$/i.test(e.textContent)); if(!el) return null; let c=el; for(let i=0;i<5&&c;i++){ if(c.querySelector&&c.querySelector('.q-toggle,.q-checkbox')) break; c=c.parentElement;} const t=c&&c.querySelector('.q-toggle,.q-checkbox'); const r=(t||el).getBoundingClientRect(); return {on:t?(t.getAttribute('aria-checked')==='true'):null,x:r.x+r.width/2,y:r.y+r.height/2}; });
info.waitingToggle=tog; if(tog&&tog.on===false){ await p.mouse.click(tog.x,tog.y); await p.waitForTimeout(1200); }
await p.keyboard.press('Escape'); await p.waitForTimeout(800); await p.mouse.click(10,600); await p.waitForTimeout(600);
await p.click('[data-test-id="page_search_toggle"]').catch(()=>{}); await p.waitForTimeout(800); await p.keyboard.press('Control+A'); await p.keyboard.type(search,{delay:30}); await p.waitForTimeout(3500);
info.rows=await p.evaluate(nums=>{ const heads=[...document.querySelectorAll('th, [role=columnheader]')].map(th=>{const r=th.getBoundingClientRect(); return {t:th.innerText.replace(/arrow_drop_(up|down)/g,'').trim(),cx:r.x+r.width/2};});
  const leaves=[...document.querySelectorAll('body *')].filter(e=>e.children.length===0&&e.textContent.trim()&&e.getBoundingClientRect().width>0);
  return nums.map(n=>{ const numEl=leaves.find(e=>e.textContent.trim()===n&&e.getBoundingClientRect().y>130); if(!numEl) return {n,found:false}; const nr=numEl.getBoundingClientRect(); const cy=nr.y+nr.height/2;
   const band=leaves.filter(e=>{const r=e.getBoundingClientRect(); return r.y<cy+14&&r.y+r.height>cy-14;});
   const get=name=>{ const h=heads.find(h=>h.t===name); if(!h) return null; const hits=band.filter(e=>{const r=e.getBoundingClientRect(); return r.x<=h.cx+60&&r.x+r.width>=h.cx-60;}); if(!hits.length) return {text:'',x:h.cx-40,y:nr.y,w:80,h:nr.height};
     const r0=hits.map(e=>e.getBoundingClientRect()); const x=Math.min(...r0.map(r=>r.x)),y=Math.min(...r0.map(r=>r.y)),x2=Math.max(...r0.map(r=>r.x+r.width)),y2=Math.max(...r0.map(r=>r.y+r.height));
     return {text:hits.map(e=>e.textContent.trim()).join(' '),x,y,w:x2-x,h:y2-y,clickable:hits.some(e=>!!e.closest('a,button,[role=button],.cursor-pointer'))}; };
   return {n,found:true,number:{x:nr.x,y:nr.y,w:nr.width,h:nr.height},status:get('Status'),clocked:get('Clocked In'),waiting:get('Waiting On Parts')}; }); },NUMS);
info.heads=await p.evaluate(()=>[...document.querySelectorAll('th')].map(th=>th.innerText.trim()));
await p.screenshot({path:OUT+'/list.png'});
info.clicks=[]; for(const r of info.rows){ const tgt=r.waiting&&/Part/.test(r.waiting.text)?r.waiting:null; if(!tgt) continue; const before=p.url(); await p.mouse.click(tgt.x+tgt.w/2,tgt.y+tgt.h/2); await p.waitForTimeout(3500); const after=p.url(); info.clicks.push({n:r.n,text:tgt.text,url:after.replace(/^https:\/\/[^/]+/,''),moved:after!==before}); if(after!==before){ await p.screenshot({path:OUT+`/waiting-click-${r.n}.png`}); await p.goBack(); await p.waitForTimeout(4000);} }
info.prefWrites=prefW; fs.writeFileSync(OUT+'/list.json',JSON.stringify(info,null,1));
console.log(JSON.stringify({loc:info.location,heads:info.heads,toggle:info.waitingToggle,rows:info.rows.map(r=>[r.n,'clocked='+(r.clocked?.text??'-'),'waiting='+(r.waiting?.text??'-'),'click='+(r.waiting?.clickable)]),clicks:info.clicks}));
process.exit(0);
