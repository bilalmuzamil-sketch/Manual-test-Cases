import {sess} from './common.mjs';
const s=await sess(); const p=s.page; await s.go('/reports/'+(process.env.REP||'ar-aging-detail')); await p.waitForTimeout(7000);
console.log((await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent&&!/^(aging_detail_report_row|button_desktop_nav)/.test(e.getAttribute('data-test-id'))).map(e=>e.getAttribute('data-test-id')+'='+(e.innerText||'').trim().replace(/\s+/g,' ').slice(0,25)))).join(' ; '));
await s.close(); process.exit(0);
