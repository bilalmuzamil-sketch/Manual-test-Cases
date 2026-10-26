import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const out={};
{const s=await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa21',vp:{width:1440,height:900},dpr:2});
 const A=s.page; await s.go('/reports/punch-clock-activities'); await A.waitForTimeout(6500); await A.mouse.move(5,890);
 await A.screenshot({path:'cap-admin-report.png'}); }
{const s=await open({env:'prod',user:'bilal.muzamil+tech@shopview.com',dir:'/tmp/qa21',vp:{width:390,height:844},dpr:3,touch:true});
 const A=s.page; await s.go('/timesheets'); await A.waitForTimeout(6000);
 out.tech=await A.evaluate(()=>{const t=document.querySelector('[data-test-id="table_my_timesheets_report"]'); let sc=t; while(sc&&sc.scrollWidth<=sc.clientWidth) sc=sc.parentElement; const th=[...t.querySelectorAll('th')]; const ci=th.find(h=>/Clock In$/.test(h.innerText.trim())||/^Clock In/.test(h.innerText.trim())&&!/Activity/.test(h.innerText)); const cx=ci?ci.getBoundingClientRect().x:0; if(sc){sc.scrollLeft=cx-12;} else {window.scrollTo(cx-12,0); document.scrollingElement.scrollLeft=cx-12;} const rows=[...t.querySelectorAll('tbody tr')].filter(r=>r.getBoundingClientRect().height>0&&/Technician/.test(r.innerText)); return {sx:window.scrollX, cx, sc:sc?sc.className:null, left:sc?sc.scrollLeft:null, boxes:rows.map(r=>{const b=r.getBoundingClientRect();return [b.x,b.y,b.width,b.height]})};});
 await A.waitForTimeout(800); await A.screenshot({path:'cap-tech-phone.png'}); }
fs.writeFileSync('cap2.json',JSON.stringify(out)); console.log(JSON.stringify(out));
process.exit(0);
