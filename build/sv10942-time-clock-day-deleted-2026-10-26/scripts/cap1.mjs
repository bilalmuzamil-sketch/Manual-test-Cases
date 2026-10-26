import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const out={};
{const s=await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa21',vp:{width:1440,height:900},dpr:2});
 const A=s.page; await s.go('/reports/punch-clock-activities'); await A.waitForTimeout(6500);
 await A.click('[data-test-id="filter_chip_range"]').catch(()=>{}); await A.waitForTimeout(900);
 const today=A.locator('.q-menu .q-item',{hasText:/^Today$/}).first(); if(await today.count()){await today.click(); await A.waitForTimeout(3500);} else await A.keyboard.press('Escape');
 out.admin=await A.evaluate(()=>{const rows=[...document.querySelectorAll('[data-test-id="table_punch_clock_activities"] tbody tr')].filter(r=>/Bilal Muzammil/.test(r.innerText)); return {n:rows.length, boxes:rows.map(r=>{const b=r.getBoundingClientRect();return [b.x,b.y,b.width,b.height]}), chip:(()=>{const c=document.querySelector('[data-test-id="filter_chip_range"]').getBoundingClientRect();return [c.x,c.y,c.width,c.height]})(), texts:rows.map(r=>r.innerText.replace(/\s+/g,' ').slice(0,90))};});
 await A.screenshot({path:'cap-admin-report.png'}); }
{const s=await open({env:'prod',user:'bilal.muzamil+tech@shopview.com',dir:'/tmp/qa21',vp:{width:390,height:844},dpr:3,touch:true});
 const A=s.page; await s.go('/timesheets'); await A.waitForTimeout(6000);
 out.tech=await A.evaluate(()=>{const rows=[...document.querySelectorAll('[data-test-id="table_my_timesheets_report"] tbody tr')]; return {n:rows.length, boxes:rows.map(r=>{const b=r.getBoundingClientRect();return [b.x,b.y,b.width,b.height]}), texts:rows.map(r=>r.innerText.replace(/\s+/g,' ').slice(0,120))};});
 await A.screenshot({path:'cap-tech-phone.png'}); }
fs.writeFileSync('cap.json',JSON.stringify(out,null,1)); console.log(JSON.stringify(out).slice(0,1500));
process.exit(0);
