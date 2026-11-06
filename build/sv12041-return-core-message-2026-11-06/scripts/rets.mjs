import {sess,arr} from './common.mjs';
const s=await sess(); await s.go('/parts/returns'); await s.page.waitForTimeout(6000);
const rows=await s.page.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(r=>r.innerText.replace(/\s+/g,' ').slice(0,160)).filter(Boolean)); console.log(JSON.stringify(rows.slice(0,8),null,1));
await s.page.screenshot({path:'../ev/branch-returns-list.png'}); await s.close(); process.exit(0);
