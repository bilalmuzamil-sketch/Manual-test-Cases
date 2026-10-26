import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import {day,netlog,dlg,clockIn,clockOut} from './lib.mjs';
const s=await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa21',vp:{width:1440,height:900},dpr:1});
const A=s.page; const log=[]; netlog(A,log);
await s.go('/workorders'); await A.waitForTimeout(6000);
const base=new URL(A.url()).origin;
const B=await A.context().newPage(); netlog(B,log); await B.goto(base+'/workorders'); await B.waitForTimeout(6000);
await day(s,'M2 start (clocked in, both tabs show the timer)');
// tab B clocks out
await clockOut(B,'ZZAUTOTEST SV-10942 tab B out'); console.log(log.join('\n')); log.length=0;
await day(s,'M2 after tab B clock-out');
await A.screenshot({path:'m2-tabA-stale.png'});
console.log('tab A header still:',await A.locator('[data-test-id="clock_in_button"]').innerText());
// tab A (stale) opens the clock dialog
await A.click('[data-test-id="clock_in_button"]'); await A.waitForTimeout(2000);
console.log('tab A dialog:',JSON.stringify(await dlg(A)));
await A.screenshot({path:'m2-tabA-dialog.png'});
const hasOut=await A.locator('.q-dialog [data-test-id="button_clock_out"]').count();
if(hasOut){ await A.locator('.q-dialog textarea').first().fill('ZZAUTOTEST SV-10942 stale tab A out'); await A.click('.q-dialog [data-test-id="button_clock_out"]'); await A.waitForTimeout(2500);}
console.log('tab A after action dialog:',JSON.stringify(await dlg(A)));
console.log(log.join('\n')); log.length=0;
await day(s,'M2 after stale tab A action');
await A.screenshot({path:'m2-tabA-after.png'});
process.exit(0);
