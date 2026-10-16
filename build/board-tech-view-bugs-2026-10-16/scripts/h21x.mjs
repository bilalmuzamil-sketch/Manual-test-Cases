import {session,toView} from './rec.mjs';
const s=await session({vp:{width:1440,height:900},dpr:1}); const p=s.page;
const pref=await s.api('/api/users/me/preferences/work-orders-list'); console.log('PREF',JSON.stringify(pref).slice(0,900));
await s.go('/workorders?tab=all'); await p.waitForTimeout(4000); await toView(p,'tech_view'); await p.waitForTimeout(2000);
console.log(await p.evaluate(()=>{const e=[...document.querySelectorAll('*')].find(x=>x.children.length===0&&x.innerText?.trim()==='Waiting On Parts'); const out=[]; let n=e; for(let i=0;i<6&&n;i++){out.push(n.tagName+'.'+(n.className||'').toString().slice(0,60)+' tid='+n.getAttribute('data-test-id')); n=n.parentElement;} const row=e.closest('[role=row],tr')||e.parentElement.parentElement.parentElement; return out.join(' < ')+'\nROWKIDS '+[...row.children].map(c=>(c.getAttribute('data-test-id')||c.tagName)+':'+c.innerText.trim()).join(' | ');}));
await s.close();
