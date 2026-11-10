import {sess} from './common.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'branch'; const EV='../ev/'+ENV; const ID=process.env.ID;
const s=await sess(); const p=s.page; const res={marker:await s.marker()};
await s.go('/workorders'); await p.waitForTimeout(3000);
// theme via the same profile-menu buttons (phone header may hide it; fall back to localStorage 'mode')
let ok=false; try{ await p.click('[data-test-id="profile_menu_button"]',{timeout:5000}); await p.waitForTimeout(1000); await p.click('[data-test-id="button_night_mode_dark"]',{timeout:5000}); ok=true; await p.keyboard.press('Escape'); }catch(e){ res.menuErr=String(e).slice(0,120); }
await p.setViewportSize({width:390,height:844}); await s.go('/imported-work-orders/'+ID); await p.waitForTimeout(6000);
const m=()=>p.evaluate(()=>{const sec=document.querySelector('.workorder-info-section'); if(!sec) return null; sec.scrollIntoView(); return {dark:document.body.className.includes('body--dark'),mobileClass:!!document.querySelector('[class*="--mobile"]'),color:getComputedStyle(sec).color,text:sec.innerText.replace(/\s+/g,' ').slice(0,120)};});
res.phone=await m(); await p.waitForTimeout(500); await p.screenshot({path:EV+'/phone-dark.png'});
await p.setViewportSize({width:1600,height:900}); await p.waitForTimeout(1500);
await p.emulateMedia({media:'print'}); await p.waitForTimeout(800); res.print=await m(); await p.emulateMedia({media:'screen'});
res.buttons=await p.evaluate(()=>[...document.querySelectorAll('main button, main a')].map(b=>(b.innerText||b.getAttribute('aria-label')||'').trim()).filter(Boolean).slice(0,20));
fs.writeFileSync(EV+'/extra.json',JSON.stringify(res,null,1)); console.log(JSON.stringify(res));
await s.close(); process.exit(0);
