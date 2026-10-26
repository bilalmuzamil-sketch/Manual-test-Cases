import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import {netlog,newEntry} from './lib.mjs';
const s=await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa21',vp:{width:1440,height:900},dpr:1});
const A=s.page; const log=[]; netlog(A,log);
const post=(u,b)=>s.api(u,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)});
const ws=(await s.api('/api/staff/my-workplaces')).json.data.collection; const fr=ws.find(w=>w.name==='For Ryan'); const home=ws.find(w=>w.name==='Trucks Hill 2');
await post('/api/iam/change-location',{workplace_id:fr.id,workplace_timezone:fr.timezone});
const rows=async t=>{const c=(await s.api('/api/reporting/punch-clock-activities/today?range=today&pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=200')).json.data.collection.filter(x=>x.employee==='Technician 1'); console.log(`[${t}] Technician 1 today:`,c.map(x=>`${x.id.slice(0,8)} ${x.clock_in}-${x.clock_out}`).join(' ; ')); return c;};
await rows('before');
await s.go('/reports/punch-clock-activities'); await A.waitForTimeout(6000);
await newEntry(A,{staff:'Technician 1',start:'Oct 26, 2026 05:00 PM',end:'Oct 26, 2026 06:00 PM'});
await A.screenshot({path:'o1-new-filled.png'});
await A.click('[data-test-id="button_save_timesheet"]'); await A.waitForTimeout(3000);
console.log('popup:',JSON.stringify(await A.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>d.innerText.replace(/\s+/g,' ').slice(0,700)))));
console.log('popup ids:',JSON.stringify(await A.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.getAttribute('data-test-id')))));
await A.screenshot({path:'o1-popup.png'});
console.log(log.filter(x=>!/my-tasks/.test(x)).join('\n')); log.length=0;
await rows('with popup open');
// cancel the overwrite
const cancel=A.locator('.q-dialog').last().getByRole('button',{name:/cancel/i}); if(await cancel.count()){await cancel.first().click(); await A.waitForTimeout(1500);} 
console.log(log.filter(x=>!/my-tasks/.test(x)).join('\n')); log.length=0;
await rows('after Cancel');
await post('/api/iam/change-location',{workplace_id:home.id,workplace_timezone:home.timezone}); console.log('restored location');
process.exit(0);
