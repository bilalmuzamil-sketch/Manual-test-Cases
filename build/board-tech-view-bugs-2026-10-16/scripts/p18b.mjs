import {session,toView} from './rec.mjs';
const s=await session({vp:{width:1920,height:1000},dpr:1}); const p=s.page;
await s.go('/workorders?tab=all'); await p.waitForTimeout(5000); await toView(p,'tech_view'); await p.waitForTimeout(2000);
const r=await p.evaluate(()=>{const row=document.querySelector('[data-test-id^=tech_view_row_]'); if(!row) return 'no row'; const st=[...row.querySelectorAll('*')].find(e=>/^(Approved|Paid|Estimate|Complete|Invoiced|In Progress|Ready For Review|Declined)$/.test(e.innerText?.trim()||'')&&e.children.length===0); let x=st,ch=[];for(let i=0;i<4&&x;i++){ch.push(x.tagName+'.'+String(x.className).slice(0,80)+' tid='+x.getAttribute('data-test-id')+' h='+x.getBoundingClientRect().height.toFixed(2)+' w='+x.getBoundingClientRect().width.toFixed(2));x=x.parentElement;} return {row:row.tagName+' '+row.getAttribute('data-test-id'),ch};});
console.log(JSON.stringify(r,null,1)); await s.close();
