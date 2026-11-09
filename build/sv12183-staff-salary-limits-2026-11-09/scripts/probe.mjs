// [ENV=prod] node probe.mjs -> opens Staff, edits first staff, dumps dialog test-ids + salary fields
import {sess} from './common.mjs';
const s=await sess(); const p=s.page; await s.go('/administration/staff'); await p.waitForTimeout(4000);
const ver=await p.evaluate(async()=>{const t=await (await fetch('/index.html?cb='+Date.now(),{cache:'no-store'})).text();return (t.match(/app-version" content="([^"]+)/)||[])[1];});
const ids=await p.evaluate(()=>[...new Set([...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')))].slice(0,80));
console.log('build',ver,'url',p.url()); console.log('page ids',ids.join(' '));
const st=(await s.api('/api/staff?limit=300')).json; const L=st?.data?.collection||st?.data||[]; console.log('staff count',L.length,'keys',Object.keys(L[0]||{}).join(','));
console.log('salaries', JSON.stringify(L.map(x=>[x.first_name+' '+x.last_name,x.salary,x.salary_type]).slice(0,40)));
await p.screenshot({path:'/tmp/sv12183/probe-list.png'}); await s.close(); process.exit(0);
