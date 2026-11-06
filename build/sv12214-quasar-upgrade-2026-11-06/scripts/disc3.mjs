import {sess} from './common.mjs';
const s=await sess(); const p=s.page;
for(const r of ['/schedule','/reports']){ await s.go(r); await p.waitForTimeout(4500);
 const ids=await p.evaluate(()=>[...new Set([...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id').replace(/[0-9a-f]{8}-[0-9a-f-]{27,}/,'<id>').replace(/\d{4}-\d\d-\d\d.*/,'<d>')))]);
 console.log(r, p.url(), ids.filter(x=>!/^(button_desktop_nav_link|skip|module|global|clock|profile|button_notifications)/.test(x)).slice(0,70).join(' ')); }
const links=await p.evaluate(()=>[...document.querySelectorAll('a[href*="/reports/"]')].map(a=>a.getAttribute('href')+'|'+a.innerText.replace(/\s+/g,' ').slice(0,40)).slice(0,30)); console.log(links.join('\n'));
await s.close(); process.exit(0);
