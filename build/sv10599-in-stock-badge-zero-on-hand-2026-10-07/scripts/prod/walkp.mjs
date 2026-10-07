import {op,j} from '../lib.mjs'; const s=await op(); const p=s.page;
const clickText=async(txt,y0=0,y1=2000)=>{const c=await p.evaluate(([t,a,b])=>{const e=[...document.querySelectorAll('*')].filter(x=>x.childElementCount===0&&(x.innerText||'').trim()===t&&x.getBoundingClientRect().width>0).find(x=>{const r=x.getBoundingClientRect();return r.y>=a&&r.y<=b;});if(!e)return null;const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};},[txt,y0,y1]); if(!c)return false; await p.mouse.click(c.x,c.y); await p.waitForTimeout(2500); return true;};
await s.go('/workorders'); console.log('loc',await p.evaluate(()=>document.querySelector('[data-test-id="profile_menu_button"]')?.innerText.replace(/\n/g,' | ')));
console.log('menu',await clickText('Work Orders',0,60)); console.log('search',await clickText('Search',70,140)); await p.keyboard.type('S2-960',{delay:60}); await p.waitForTimeout(3500);
const rows=await p.evaluate(()=>[...document.querySelectorAll('tr')].filter(r=>/S2-960/.test(r.innerText)).map(r=>r.innerText.replace(/\s+/g,' ').slice(0,120))); console.log('rows',j(rows));
console.log('open',await clickText('S2-960',150,500),p.url());
console.log('badge',await p.evaluate(()=>document.querySelector('[data-test-id="badge_wo_status"]')?.innerText.trim()), j(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="badge_line_status_"]')].map(e=>e.innerText.trim()))));
await s.close();
