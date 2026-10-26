import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'prod',user:'bilal.muzamil+tech@shopview.com',dir:'/tmp/qa21',vp:{width:1440,height:600},dpr:2});
const A=s.page; await s.go('/timesheets'); await A.waitForTimeout(6000); await A.mouse.move(5,590);
const o=await A.evaluate(()=>{const t=document.querySelector('[data-test-id="table_my_timesheets_report"]'); const rows=[...t.querySelectorAll('tbody tr')].filter(r=>r.getBoundingClientRect().height>0&&/Technician/.test(r.innerText)); const tb=t.getBoundingClientRect(); return {t:[tb.x,tb.y,tb.width,tb.height],boxes:rows.map(r=>{const b=r.getBoundingClientRect();return [b.x,b.y,b.width,b.height]}),texts:rows.map(r=>r.innerText.replace(/\s+/g,' '))};});
fs.writeFileSync('cap3.json',JSON.stringify(o)); console.log(JSON.stringify(o));
await A.screenshot({path:'cap-tech-desktop.png'});
process.exit(0);
