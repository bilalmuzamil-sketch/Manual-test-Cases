// for each Active row on Timesheet Activities (first N), open its work order Timesheets page via the link and compare start times
import {sess} from './common.mjs'; const s=await sess(); const p=s.page; const E=process.env.ENV||'branch'; const N=+(process.env.N||3); const out=[];
if(process.env.WPID){ const r=await s.api('/api/iam/change-location',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({workplace_id:process.env.WPID,workplace_timezone:process.env.WPTZ})}); console.log('change-location',r.status); }
await s.go('/reports/punch-clock-activities'); await p.waitForTimeout(9000); await p.screenshot({path:`../ev/${E}-time-activities.png`});
const rows=await p.evaluate((F)=>[...document.querySelectorAll('tbody tr')].filter(r=>new RegExp(F).test(r.innerText)).map(r=>{const a=r.querySelector('a'); const td=[...r.querySelectorAll('td')].map(x=>x.innerText.trim()); return {href:a?.getAttribute('href'),cells:td.slice(0,6)};}),process.env.FILTER||'Active');
console.log('rows',rows.length);
for(const r of rows.filter(x=>/^S\d/.test(x.cells[2])).slice(0,N)){ await s.go('/reports/punch-clock-activities'); await p.waitForTimeout(8000);
  await p.locator('tbody tr',{hasText:r.cells[1]}).filter({hasText:r.cells[2]}).first().getByText(r.cells[2],{exact:true}).click(); await p.waitForTimeout(6000);
  const id=(p.url().match(/workorders\/([0-9a-f-]{36})/)||[])[1]; await s.go('/workorders/'+id+'/timesheets'); await p.waitForTimeout(8000);
  const who=r.cells[1]; const w=await p.evaluate(w=>[...document.querySelectorAll('tbody tr')].filter(x=>x.innerText.includes(w)).map(x=>x.innerText.replace(/\s+/g,' ').slice(0,200)),who.split(' ').slice(-1)[0]);
  out.push({activities:r.cells.join(' | '),woPage:w,url:p.url()}); await p.screenshot({path:`../ev/${E}-time-wo-${out.length}.png`}); }
console.log(JSON.stringify(out,null,1)); await s.close(); process.exit(0);
