import {sess} from './common.mjs';
const s=await sess(); const p=s.page; await s.go('/reports/ar-aging-summary?asOfDate=2026-12-31'); await p.waitForTimeout(6000);
const t=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')+' :: '+(e.innerText||'').trim().replace(/\s+/g,' ').slice(0,60)));
const uniq=[...new Set(t.map(x=>x.replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g,'<id>')))]; console.log(uniq.slice(0,120).join('\n'));
console.log('URL',p.url());
await s.close(); process.exit(0);
