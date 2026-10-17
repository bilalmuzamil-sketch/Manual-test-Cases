import {session,toView} from './rec.mjs'; import fs from 'fs';
const s=await session({quick:'admin',vp:{width:1440,height:900},dpr:2}); const p=s.page; const out={marker:await s.marker?.()};
const OWN=['display','tab']; const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; const prefs0=await getP();
const theme=async t=>{await p.click('[data-test-id=profile_menu_button]'); await p.waitForTimeout(900); await p.click(`[data-test-id=button_night_mode_${t}]`); await p.waitForTimeout(1500); await p.keyboard.press('Escape').catch(()=>{}); await p.waitForTimeout(800);};
await s.go('/workorders?tab=all'); await p.waitForTimeout(3500); await toView(p,'board_view'); await p.waitForTimeout(3500);
for(const t of ['dark','light']){ await theme(t); await p.mouse.move(700,150); await p.waitForTimeout(1200);
 out[t]=await p.evaluate(()=>[...document.querySelectorAll('.board-column__body')].slice(0,4).map(b=>{const r=b.getBoundingClientRect(); return {name:b.closest('.board-column__panel')?.innerText.split('\n')[0].slice(0,25),sbw:b.offsetWidth-b.clientWidth,scrolls:b.scrollHeight>b.clientHeight,x:r.right,y:r.y,h:r.height,panelBg:getComputedStyle(b.closest('.board-column__panel')).backgroundColor};}));
 await p.screenshot({path:`/tmp/qa11310/ev10/t30-${t}.png`}); console.log(t,JSON.stringify(out[t])); }
await theme('dark');
const cur=await getP(); const v={...cur}; for(const k of OWN) v[k]=prefs0[k]; await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})});
fs.writeFileSync('/tmp/qa11310/ev10/t30b.json',JSON.stringify(out,null,1)); await s.close();
