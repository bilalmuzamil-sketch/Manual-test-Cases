import {sess} from './common.mjs';
const s=await sess(); const p=s.page; await s.go('/workorders'); await p.waitForTimeout(4000);
const ids=await p.evaluate(()=>[...new Set([...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')))]);
console.log(ids.filter(x=>!/^(button_desktop_nav_link|filter_option)/.test(x)).join(' '));
await s.close(); process.exit(0);
