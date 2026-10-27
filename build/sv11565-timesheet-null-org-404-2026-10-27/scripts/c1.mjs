import {sess} from './lib.mjs';
const s=await sess(); const reqs=[];
s.page.on('request',q=>{if(q.url().includes('/api/technician-tasks')&&q.method()==='POST')reqs.push(q.method()+' '+q.url().split('/api')[1]+' '+(q.postData()||''))});
await s.go('/reports/punch-clock-activities'); await s.page.waitForTimeout(4000);
console.log('ids',await s.page.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(e=>e.dataset.testId).filter(t=>/add|new|create|clock/i.test(t)).join(',')));
console.log('btns',await s.page.evaluate(()=>[...document.querySelectorAll('button')].map(b=>b.innerText.trim()).filter(Boolean).slice(0,30).join(' | ')));
await s.page.screenshot({path:'../ev/c1-timesheet-page.png'});
console.log(reqs.join('\n')); await s.browser.close(); process.exit(0);
