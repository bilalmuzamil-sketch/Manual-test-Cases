// usage: node capture.mjs <branch|prod> <outdir> <searchText> <woId,...>
import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const [env,OUT,search,idsCsv,numsCsv,LOCNAME]=process.argv.slice(2); const IDS=idsCsv.split(','); const NUMS=numsCsv.split(','); fs.mkdirSync(OUT,{recursive:true});
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim();
const s=env==='branch'? await open({env:'branch',ticket:'10579',dir:'/tmp/qa1',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}})
  : await open({env:'prod',dir:'/tmp/qa2',user:'bilal.muzamil+serviceadvisornoreports@shopview.com',pw:fs.readFileSync('/tmp/sv-prod-pw2.txt','utf8').trim()});
const p=s.page; const info={marker:await s.marker(),at:new Date().toISOString()};
const prefBefore=(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; info.prefBefore=prefBefore;
await s.go('/workorders'); await p.waitForTimeout(3000);
const hdr=()=>p.evaluate(()=>document.querySelector('[data-test-id="profile_menu_button"]').innerText.split('\n')[0]);
if(LOCNAME && !(await hdr()).includes(LOCNAME)){ await p.click('[data-test-id="profile_menu_button"]'); await p.waitForTimeout(1000); await p.click('[data-test-id="select_location"]'); await p.waitForTimeout(1200);
  for(const e of await p.$$('.q-menu .q-item, [role=option]')){ const t=(await e.innerText()).trim(); if(t.split('\n').pop().trim()===LOCNAME){ await e.click(); await p.waitForTimeout(4000); break; } } await s.go('/workorders'); await p.waitForTimeout(3000); }
info.location=await hdr();
await p.click('[data-test-id="display_option_list"]').catch(()=>{}); await p.waitForTimeout(1500);
await p.click('[data-test-id="tab_all"]'); await p.waitForTimeout(2500);
// columns: make sure Waiting On Parts + Clocked In are on
await p.click('[data-test-id="button_column_selection"]'); await p.waitForTimeout(1200);
const colItems=await p.$$('.q-menu .q-item'); for(const e of colItems){ const t=(await e.innerText()).trim(); if(/Waiting On Parts|Clocked In/i.test(t)){ const on=await e.evaluate(el=>!!el.querySelector('.q-checkbox__inner--truthy, .q-toggle__inner--truthy, [aria-checked=true]')); if(!on){ await e.click(); await p.waitForTimeout(600);} } }
await p.keyboard.press('Escape'); await p.waitForTimeout(800);
await p.click('[data-test-id="page_search_toggle"]'); await p.waitForTimeout(800); await p.keyboard.type(search,{delay:30}); await p.waitForTimeout(3500);
const head=await p.evaluate(()=>[...document.querySelectorAll('thead th')].map(th=>th.innerText.trim()));
const rows=await p.evaluate(([ids,head,nums])=>ids.map((id,k)=>{ const tr=[...document.querySelectorAll('tbody tr')].find(t=>[...t.children].some(td=>td.innerText.trim()===nums[k])); if(!tr) return {id,found:false};
  const tds=[...tr.children]; const cell=n=>{const i=head.indexOf(n); if(i<0) return null; const td=tds[i]; const r=td.getBoundingClientRect(); return {text:td.innerText.trim(),x:r.x,y:r.y,w:r.width,h:r.height,link:!!td.querySelector('a,button,[role=button],.cursor-pointer')};};
  return {id,found:true,number:cell('Number'),clocked:cell('Clocked In'),waiting:cell('Waiting On Parts'),tr:(()=>{const r=tr.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height};})()}; }),[IDS,head,NUMS]);
info.head=head; info.listRows=rows; await p.screenshot({path:OUT+'/list.png'});
// click the Waiting On Parts badge of each row that has one, record where it goes
info.waitingClicks=[];
for(const r of rows){ if(!r.found||!r.waiting||!r.waiting.text) continue; const before=p.url(); await p.mouse.click(r.waiting.x+r.waiting.w/2,r.waiting.y+r.waiting.h/2); await p.waitForTimeout(3500);
  const after=p.url(); info.waitingClicks.push({id:r.id,number:r.number?.text,badge:r.waiting.text,url:after,moved:after!==before}); if(after!==before){ await p.screenshot({path:OUT+`/waiting-click-${r.number.text}.png`}); await p.goBack(); await p.waitForTimeout(3500);} }
// board view with Clocked in + Line technicians on
await p.click('[data-test-id="display_option_board_view"]'); await p.waitForTimeout(4000);
await p.click('[data-test-id="button_board_fields_selection"]'); await p.waitForTimeout(1200);
for(const tid of ['toggle_board_field_clocked_in_technicians','toggle_board_field_line_technicians']){ const on=await p.evaluate(t=>{const e=document.querySelector(`[data-test-id="${t}"]`); return e && (e.getAttribute('aria-checked')==='true'||!!e.querySelector('[aria-checked=true], .q-toggle__inner--truthy, .q-checkbox__inner--truthy'));},tid); if(!on){ await p.click(`[data-test-id="${tid}"]`); await p.waitForTimeout(800);} }
await p.keyboard.press('Escape'); await p.waitForTimeout(2500);
info.cards=await p.evaluate(ids=>ids.map(id=>{ const c=document.querySelector(`[data-test-id="board_card_${id}"]`); if(!c) return {id,found:false}; c.scrollIntoView({block:'center',inline:'center'});
  const g=t=>{const e=c.querySelector(`[data-test-id="${t}"]`); if(!e) return null; const r=e.getBoundingClientRect(); return {text:e.innerText.trim().replace(/\n/g,' '),x:r.x,y:r.y,w:r.width,h:r.height};};
  const r=c.getBoundingClientRect(); return {id,found:true,number:g('board_card_number'),clocked:g('board_card_field_clocked_in_technicians')||g('clockedInTechnicians'),lineTechs:g('board_card_field_line_technicians')||g('lineTechnicians'),text:c.innerText.replace(/\n/g,' | ').slice(0,300),box:{x:r.x,y:r.y,w:r.width,h:r.height}}; }),IDS);
await p.screenshot({path:OUT+'/board.png'});
info.prefAfter=(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value;
fs.writeFileSync(OUT+'/capture.json',JSON.stringify(info,null,1));
console.log(JSON.stringify({loc:info.location,marker:info.marker.version,rows:rows.map(r=>[r.number?.text,'clocked='+r.clocked?.text,'waiting='+r.waiting?.text]),clicks:info.waitingClicks.map(c=>[c.number,c.badge,c.url.replace(/^https:\/\/[^/]+/,'')]),cards:info.cards.map(c=>[c.number?.text,c.found,'clocked='+c.clocked?.text,'lineTechs='+c.lineTechs?.text])}));
process.exit(0);
