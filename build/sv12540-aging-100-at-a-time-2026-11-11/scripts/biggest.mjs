import {sess} from './common.mjs';
const s=await sess(); const p=s.page;
for(const r of ['ar-aging-collection','ap-unpaid-invoices']){ await s.go('/reports/'+r); await p.waitForTimeout(9000);
  const g=await p.evaluate(()=>[...document.querySelectorAll('tr')].map(t=>t.innerText.replace(/\s+/g,' ')).map(t=>t.match(/keyboard_arrow_right (.+?) \((\d+)\)/)).filter(Boolean).map(m=>[m[1],+m[2]]).sort((a,b)=>b[1]-a[1]).slice(0,5));
  console.log(r,JSON.stringify(g)); }
await s.close(); process.exit(0);
