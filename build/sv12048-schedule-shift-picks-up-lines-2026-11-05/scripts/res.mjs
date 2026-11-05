import {sess} from './common.mjs'; const s=await sess(); await s.go('/schedule'); await s.page.waitForTimeout(3000);
const d=new Date(Date.now()+86400000).toISOString().slice(0,10); const b=(await s.api(`/api/schedule/board?from=${d}T00:00:00Z&to=${d}T23:59:59Z`)).json?.data?.board;
const flat=JSON.stringify(b.resources); const i=flat.indexOf('0aac76eb'); console.log('res len',flat.length, flat.slice(Math.max(0,i-200),i+300));
const lanes=await s.page.evaluate(()=>[...document.querySelectorAll('[data-staff-id]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-staff-id').slice(0,8)+'='+e.innerText.trim().replace(/\s+/g,' ').slice(0,40)));
console.log(lanes.join('\n')); await s.close(); process.exit(0);
