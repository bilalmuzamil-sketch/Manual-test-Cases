import {sess} from './common.mjs';
const s=await sess(); const p=s.page; const reqs=[]; p.on('request',r=>{ if(/\/api\/inventory\/orders\?/.test(r.url())) reqs.push(decodeURIComponent(r.url().split('?')[1]).replace(/pagination\[/g,'').replace(/\]/g,''));});
await s.go('/parts/orders'); await p.waitForTimeout(4000); console.log('load:',reqs.pop());
const vh=p.locator('thead th',{hasText:/^Vendor/}).first();
for(let i=1;i<=4;i++){ await vh.click(); await p.waitForTimeout(3000); const first=await p.evaluate(()=>[...document.querySelectorAll('tbody tr')].slice(1,4).map(r=>r.querySelectorAll('td')[3]?.innerText.split('\n')[0])); const icon=await p.evaluate(()=>{const th=[...document.querySelectorAll('thead th')].find(t=>/^Vendor/.test(t.innerText.trim()));return th.className;});
  console.log('click',i,'req:',reqs.slice(-1)[0],'| first:',JSON.stringify(first),'| th:',icon); if(i==1||i==2) await p.screenshot({path:`../ev/B-click${i}.png`}); }
await s.browser.close();
