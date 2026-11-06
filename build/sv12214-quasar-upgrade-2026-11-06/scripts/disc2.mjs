import {sess} from './common.mjs';
const s=await sess(); const p=s.page; await s.go('/workorders'); await p.waitForTimeout(3500);
const pref=(await s.api('/api/users/me/preferences/work-orders-list')).json; console.log('PREF',JSON.stringify(pref?.data?.value).slice(0,300));
for(const v of ['board_view','tech_view']){ await p.click(`[data-test-id=display_option_${v}]`); await p.waitForTimeout(3500);
 const ids=await p.evaluate(()=>[...new Set([...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id').replace(/[0-9a-f]{8}-[0-9a-f-]{27,}/,'<id>')))]);
 console.log(v.toUpperCase(), ids.filter(x=>!/^(button_desktop_nav_link|filter_option|skip|module|global|clock|profile|tab_)/.test(x)).join(' ')); }
await s.close(); process.exit(0);
