import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess(); const p=s.page; const urls=[]; p.on('request',r=>{ if(/\/api\/inventory\/orders\?/.test(r.url())) urls.push(r.url());});
await s.go('/parts/orders'); await p.waitForTimeout(5000);
const ver=await p.evaluate(()=>document.querySelector('meta[name="app-version"]')?.content);
const heads=await p.evaluate(()=>[...document.querySelectorAll('thead th')].map(t=>t.innerText.trim()+(t.classList.contains('sortable')?' [sortable]':'')));
const ids=await p.evaluate(()=>[...new Set([...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(t=>/search|filter|chip/i.test(t)))]);
console.log(process.env.ENV||'branch',ver,'\nheads',JSON.stringify(heads),'\nids',ids.join(' '),'\nurl',urls.pop());
await p.screenshot({path:`../ev/probe-${process.env.ENV||'branch'}.png`}); await s.browser.close();
