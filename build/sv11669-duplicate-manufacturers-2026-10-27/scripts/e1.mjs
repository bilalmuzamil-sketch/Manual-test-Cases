import {sess} from './lib.mjs';
const s=await sess(); const P=s.page; const reqs=[];
P.on('request',q=>{const u=q.url(); if(/\/api\//.test(u)&&!/\.js/.test(u)) reqs.push(q.method()+' '+u.split('/api')[1].slice(0,120));});
await s.go('/parts/parts-catalogue'); await P.waitForTimeout(4000);
console.log('ids',await P.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent).map(e=>e.dataset.testId).filter(t=>!/nav_link|module_nav/.test(t)).slice(0,60).join(' | ')));
await P.screenshot({path:'../ev/e1-catalog.png'});
console.log(reqs.filter(r=>/manuf|catalog|parts/i.test(r)).join('\n'));
await s.browser.close(); process.exit(0);
