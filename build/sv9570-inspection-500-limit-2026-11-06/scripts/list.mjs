import {sess} from './common.mjs'; const s=await sess(); const p=s.page;
await s.go('/administration/inspection-templates?tab=all'); await p.waitForTimeout(7000);
const rows=await p.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(r=>[...r.querySelectorAll('td')].map(td=>td.innerText.replace(/\s+/g,' ').trim()).join(' | ')).filter(t=>/SV9570/.test(t)));
console.log(rows.join('\n')); await p.screenshot({path:'../ev/branch-tpl-list.png',fullPage:true}); await s.close(); process.exit(0);
