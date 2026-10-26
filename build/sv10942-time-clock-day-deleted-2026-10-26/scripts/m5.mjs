import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import {day,netlog,dlg,clockIn,clockOut} from './lib.mjs';
const s=await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa21',vp:{width:1440,height:900},dpr:1});
const A=s.page; const log=[]; netlog(A,log); const base='https://app.shopview.com';
const flush=t=>{console.log('--',t); console.log(log.filter(x=>!/my-tasks/.test(x)).join('\n')); log.length=0;};
const ids=new Set(); const chk=async t=>{const d=await day(s,t); const now=new Set(d.mine.map(r=>r.id)); const lost=[...ids].filter(i=>!now.has(i)); now.forEach(i=>ids.add(i)); console.log('   LOST:',lost.length?lost:'none','total',now.size);};
await s.go('/workorders'); await A.waitForTimeout(5000); await chk('M5 start');
// M5 normal switch: clock in Department1, then tick deparrtment3 + Start
await clockIn(A); flush('in Department1');
await A.click('[data-test-id="clock_in_button"]'); await A.waitForTimeout(1800);
await A.locator('.q-dialog').getByText('deparrtment3',{exact:true}).click(); await A.waitForTimeout(800);
await A.locator('.q-dialog textarea').first().fill('ZZAUTOTEST SV-10942 switch'); await A.click('.q-dialog [data-test-id="button_start_next_task"]'); await A.waitForTimeout(3000); flush('switch to deparrtment3');
await chk('M5 after switch');
await clockOut(A); flush('out'); await chk('M5 after out');
// M6 double click on department in clock-in dialog
await A.click('[data-test-id="clock_in_button"]'); await A.waitForTimeout(1800);
await A.locator('.q-dialog [data-test-id="department_name"]',{hasText:/^Department1$/}).first().dblclick(); await A.waitForTimeout(3000); flush('double-click Department1');
await chk('M6 after double click');
await clockOut(A); flush('out'); await chk('M6 after out');
// M7 resent clock-in (crash/retry): two clock-in requests back to back
const r1=A.evaluate(()=>0); 
const a=await s.api('/api/technician-tasks/department-clock-in',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({department_id:'03e3cecc-1556-467a-bceb-93e252d94a3d'})});
const b=await s.api('/api/technician-tasks/department-clock-in',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({department_id:'03e3cecc-1556-467a-bceb-93e252d94a3d'})});
console.log('-- resent clock-in', a.status, JSON.stringify(a.json).slice(0,150), '|', b.status, JSON.stringify(b.json).slice(0,150));
await chk('M7 after two clock-ins');
await A.reload(); await A.waitForTimeout(5000); await A.screenshot({path:'m7-header.png',clip:{x:1080,y:0,width:360,height:56}});
await clockOut(A); flush('out after resend'); await chk('M7 after out');
const cur=(await s.api('/api/technician-tasks/my-current-task')).json.data.technician_task; console.log('still open:',JSON.stringify(cur).slice(0,200));
process.exit(0);
