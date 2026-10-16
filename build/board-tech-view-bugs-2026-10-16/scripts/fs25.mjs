import {session,toView,dens} from './rec.mjs'; import fs from 'fs';
const s=await session({vp:{width:1600,height:900},dpr:1}); const p=s.page; const out={};
await s.go('/workorders?tab=all&search=S2-33043'); await p.waitForTimeout(5000);
const sizes=sel=>p.evaluate(sel=>{const tbl=document.querySelector(sel); const ths=[...tbl.querySelectorAll('thead th')].map(t=>t.innerText.replace(/arrow_drop_(up|down)/,'').trim()); const r=[...tbl.querySelectorAll('tbody tr')].find(r=>/S2-33043/.test(r.innerText)); const td=[...r.querySelectorAll(':scope > td')]; const o={};
 for(const n of ['Customer','Unit','Asset','Clocked In','Lines','Total Price','Service Advisor']){ const c=td[ths.indexOf(n)]; if(!c) continue; const leaf=[...c.querySelectorAll('*')].find(e=>e.children.length===0&&e.innerText?.trim())||c; const cs=getComputedStyle(leaf); o[n]=cs.fontSize+'/'+cs.fontWeight; } return o;},sel);
await toView(p,'list'); await p.waitForTimeout(2000); out.list=await sizes('.q-table__container');
await toView(p,'tech_view'); await p.waitForTimeout(2000); const ex=await p.getAttribute('[data-test-id=button_tech_view_group_toggle_unassigned]','aria-expanded'); if(ex!=='true'){await p.click('[data-test-id=button_tech_view_group_toggle_unassigned]'); await p.waitForTimeout(2000);}
for(const d of ['compact','regular','comfortable']){ await dens(p,d); await p.waitForTimeout(800); out[d]=await sizes('[data-test-id=table_tech_view]'); }
await dens(p,'regular');
// avatar before name, all rows with an advisor
await s.go('/workorders?tab=all'); await p.waitForTimeout(4000);
const ex2=await p.getAttribute('[data-test-id=button_tech_view_group_toggle_unassigned]','aria-expanded'); if(ex2!=='true'){await p.click('[data-test-id=button_tech_view_group_toggle_unassigned]'); await p.waitForTimeout(2500);}
out.av=await p.evaluate(()=>{const res=[]; for(const av of document.querySelectorAll('[data-test-id^=tech_view_row_advisor_avatar_]')){ const sa=av.closest('td'); const w=document.createTreeWalker(sa,NodeFilter.SHOW_TEXT); let n,x=null,name=null; while(n=w.nextNode()){ if(!av.contains(n)&&n.textContent.trim()){ const rg=document.createRange(); rg.selectNodeContents(n); x=rg.getBoundingClientRect().x; name=n.textContent.trim(); break;} } const ab=av.getBoundingClientRect(); res.push({ini:av.innerText.trim(),name,gap:x!==null?+(x-ab.right).toFixed(1):null}); } return {n:res.length,before:res.filter(r=>r.gap!==null&&r.gap>=0).length,sample:res.slice(0,3),gaps:[...new Set(res.map(r=>r.gap))]};});
console.log(JSON.stringify(out)); fs.writeFileSync('/tmp/qa11310/fs25.json',JSON.stringify(out,null,1)); await p.click('[data-test-id=button_tech_view_group_toggle_unassigned]'); await s.close();
