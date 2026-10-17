import {session,toView} from './rec.mjs';
const s=await session({vp:{width:1440,height:900},dpr:1}); const p=s.page;
await s.go('/workorders?tab=all&search=ZZAUTOTEST'); await p.waitForTimeout(4500); await toView(p,'tech_view'); await p.waitForTimeout(2000);
const lab=await p.getAttribute('[data-test-id=button_tech_view_collapse_all]','aria-label'); console.log('label',lab);
console.log(await p.evaluate(()=>{const g=document.querySelector('[data-test-id^=tech_view_group_]'); const out=[]; let n=g; for(let i=0;i<4&&n;i++){ out.push(n.tagName+' tid='+n.getAttribute('data-test-id')+' cls='+(n.className||'').toString().slice(0,60)+' pos='+getComputedStyle(n).position+' top='+getComputedStyle(n).top+' z='+getComputedStyle(n).zIndex); n=n.parentElement;} const sticky=[...document.querySelectorAll('*')].filter(e=>['sticky','fixed'].includes(getComputedStyle(e).position)).map(e=>e.tagName+':'+(e.getAttribute('data-test-id')||e.className.toString().slice(0,50))+':'+getComputedStyle(e).position+':'+getComputedStyle(e).top); return out.join('\n')+'\nSTICKY '+sticky.slice(0,15).join(' | ');}));
await s.close();
