import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const P=JSON.parse(fs.readFileSync('/tmp/sv10579/prod-seed.json','utf8')); const OUT='../ev/prod';
const s=await open({env:'prod',dir:'/tmp/qa2',user:'bilal.muzamil+serviceadvisornoreports@shopview.com',pw:fs.readFileSync('/tmp/sv-prod-pw2.txt','utf8').trim()});
const p=s.page; const before=(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value;
await s.go('/workorders'); await p.waitForTimeout(3000); const loc=await p.evaluate(()=>document.querySelector('[data-test-id="profile_menu_button"]').innerText.split('\n')[0]);
await p.click('[data-test-id="display_option_board_view"]'); await p.waitForTimeout(4000);
await p.click('[data-test-id="page_search_toggle"]').catch(()=>{}); await p.waitForTimeout(700); await p.keyboard.type('S2-1788',{delay:30}); await p.waitForTimeout(3000);
await p.click('[data-test-id="button_board_fields_selection"]'); await p.waitForTimeout(1200);
for(const tid of ['toggle_board_field_clocked_in_technicians','toggle_board_field_line_technicians']){ const on=await p.evaluate(t=>{const e=document.querySelector(`[data-test-id="${t}"]`); return !!e&&(e.getAttribute('aria-checked')==='true'||!!e.querySelector('[aria-checked=true]'));},tid); if(!on){ await p.click(`[data-test-id="${tid}"]`); await p.waitForTimeout(700);} }
await p.keyboard.press('Escape'); await p.waitForTimeout(2500);
const card=await p.evaluate(id=>{ const c=document.querySelector(`[data-test-id="board_card_${id}"]`); if(!c) return null; c.scrollIntoView({block:'center',inline:'center'}); const r=c.getBoundingClientRect(); const g=t=>{const e=c.querySelector(`[data-test-id="${t}"]`); if(!e) return null; const q=e.getBoundingClientRect(); return {text:e.innerText.replace(/\n/g,' '),x:q.x,y:q.y,w:q.width,h:q.height};}; return {box:{x:r.x,y:r.y,w:r.width,h:r.height},number:g('board_card_number'),clocked:g('clockedInTechnicians'),lineTechs:g('lineTechnicians'),text:c.innerText.replace(/\n/g,' | ')}; },P.woId);
await p.waitForTimeout(800); const c2=await p.evaluate(id=>{ const c=document.querySelector(`[data-test-id="board_card_${id}"]`); const r=c.getBoundingClientRect(); const g=t=>{const e=c.querySelector(`[data-test-id="${t}"]`); if(!e) return null; const q=e.getBoundingClientRect(); return {text:e.innerText.replace(/\n/g,' '),x:q.x,y:q.y,w:q.width,h:q.height};}; return {box:{x:r.x,y:r.y,w:r.width,h:r.height},clocked:g('clockedInTechnicians'),lineTechs:g('lineTechnicians')}; },P.woId);
await p.screenshot({path:OUT+'/board.png'});
fs.writeFileSync(OUT+'/board.json',JSON.stringify({loc,card,c2,before},null,1)); console.log(loc,JSON.stringify(card?.text),JSON.stringify(c2));
// restore preferences exactly as they were
const r=await s.api('/api/users/me/preferences/work-orders-list',{method:'PATCH',headers:{'content-type':'application/json'},body:JSON.stringify({value:before})});
const after=(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; const same=JSON.stringify(after)===JSON.stringify(before);
console.log('restore',r.status,'prefs identical to before:',same, same?'':JSON.stringify({before,after}).slice(0,600));
process.exit(0);
