import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import {day,netlog,dlg,clockIn,clockOut} from './lib.mjs';
const s=await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa21',vp:{width:1440,height:900},dpr:1});
const A=s.page; const log=[]; netlog(A,log); const base='https://app.shopview.com';
const flush=t=>{console.log('--',t); console.log(log.join('\n')); log.length=0;};
await s.go('/workorders'); await A.waitForTimeout(5000);
await clockIn(A); flush('clock in (3rd punch)');
const B=await A.context().newPage(); netlog(B,log); await B.goto(base+'/workorders'); await B.waitForTimeout(5000);
await clockOut(B,'ZZAUTOTEST SV-10942 B out'); flush('B out');
let d=await day(s,'M3 before stale switch');
// stale A: open dialog, tick Department1
await A.click('[data-test-id="clock_in_button"]'); await A.waitForTimeout(2000);
const rows=A.locator('.q-dialog tr, .q-dialog .q-item');
await A.locator('.q-dialog').getByText('Department1',{exact:true}).click().catch(e=>console.log('click dept text failed'));
await A.waitForTimeout(2500); console.log('A dialog after tick:',JSON.stringify(await dlg(A))); await A.screenshot({path:'m3-stale-tick.png'}); flush('stale tick Department1');
d=await day(s,'M3 after stale tick');
// close any dialog
await A.keyboard.press('Escape'); await A.waitForTimeout(800);
process.exit(0);
