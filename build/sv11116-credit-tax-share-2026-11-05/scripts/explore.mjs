// usage: node explore.mjs <path> [clickText] -> opens path, lists links/buttons containing "tax", optional click by text, prints GET requests seen
import {sess} from './common.mjs'; const [P,CL]=process.argv.slice(2); const s=await sess({dpr:1}); const p=s.page; const gets=[]; p.on('request',r=>{ if(r.url().includes('api.qa')&&r.method()==='GET') gets.push(r.url().replace(/^https:\/\/[^/]+/,'')); });
await s.go(P); await p.waitForTimeout(5000);
console.log('URL',p.url()); console.log('TAX',await p.evaluate(()=>[...document.querySelectorAll('a,button,[data-test-id]')].filter(e=>/tax/i.test(e.innerText||'')&&e.offsetParent).slice(0,15).map(e=>(e.getAttribute('data-test-id')||e.tagName)+'|'+(e.getAttribute('href')||'')+'|'+e.innerText.replace(/\s+/g,' ').trim().slice(0,50)).join(' || ')));
if(CL){ await p.getByText(CL,{exact:false}).first().click(); await p.waitForTimeout(6000); console.log('URL2',p.url()); }
console.log('GETS',[...new Set(gets)].slice(-15).join('\n')); await p.screenshot({path:'/tmp/sv11116/explore.png'}); await s.close(); process.exit(0);
