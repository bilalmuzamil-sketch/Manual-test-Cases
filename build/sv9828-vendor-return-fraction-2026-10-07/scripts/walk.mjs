import {ob,j} from './lib.mjs'; const s=await ob(); const p=s.page;
const clickText=async(txt,y0=0,y1=2000,x0=0,x1=3000)=>{const c=await p.evaluate(([t,a,b,c,d])=>{const e=[...document.querySelectorAll('*')].filter(x=>x.childElementCount===0&&(x.innerText||'').trim()===t&&x.getBoundingClientRect().width>0).find(x=>{const r=x.getBoundingClientRect();return r.y>=a&&r.y<=b&&r.x>=c&&r.x<=d;});if(!e)return null;const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};},[txt,y0,y1,x0,x1]); if(!c)return false; await p.mouse.click(c.x,c.y); await p.waitForTimeout(2500); return j(c);};
console.log('landed',p.url());
console.log('1 top Parts',await clickText('Parts',0,60), p.url());
const left=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="parts_nav_"]')].filter(e=>e.getBoundingClientRect().width>0).map(e=>e.innerText.replace(/\n/g,' ').trim()+'@'+Math.round(e.getBoundingClientRect().x)+','+Math.round(e.getBoundingClientRect().y))); console.log('left menu',j(left,400));
const r=await s.box('parts_nav_returns'); await p.mouse.click(r.x,r.y); await p.waitForTimeout(3000); console.log('2 Returns',p.url());
const tabs=await p.evaluate(()=>['tab_returns','tab_credits'].map(t=>{const e=document.querySelector(`[data-test-id="${t}"]`);return t+':'+(e&&e.getAttribute('aria-selected'))+':'+(e&&e.innerText.trim())}));console.log('tabs',j(tabs));
const rows=await p.evaluate(()=>[...document.querySelectorAll('tr')].filter(r=>/MD668D/.test(r.innerText)&&/Manual/.test(r.innerText)).map(r=>r.innerText.replace(/\s+/g,' ').trim().slice(0,120))); console.log('MD668D manual rows',rows.length,j(rows,400));
await s.close();
