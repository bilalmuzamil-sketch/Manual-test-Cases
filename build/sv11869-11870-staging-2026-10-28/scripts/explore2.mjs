// Find the Export Reports route + controls, and an open work order whose New Line dialog we can drive.
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'staging',ticket:'staging',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:'/tmp/qa30',user:'bilal.muzamil@shopview.com',quick:'admin'});
const p=s.page; await s.go('/reports'); await p.waitForTimeout(4000);
const links=await p.evaluate(()=>[...document.querySelectorAll('a,[role=link],.q-item')].filter(e=>/Export/i.test(e.innerText||'')).map(e=>[e.innerText.trim().slice(0,40),e.getAttribute('href'),e.getAttribute('data-test-id')]));
console.log('export links',JSON.stringify(links));
const l=p.locator('a,.q-item',{hasText:'Export Reports'}).first(); if(await l.count()){ await l.click(); await p.waitForTimeout(4000); }
console.log('url',p.url().replace(/^https:\/\/[^/]+/,''));
console.log('tids',[...new Set(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.getBoundingClientRect().width>0).map(e=>e.getAttribute('data-test-id'))))].filter(t=>!/nav|module_|global|clock|notif|profile|skip/.test(t)).join(' ; ').slice(0,1500));
await p.screenshot({path:'/tmp/qa30/export.png'});
await s.close(); process.exit(0);
