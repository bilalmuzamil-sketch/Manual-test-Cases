// finds the Pricing Matrix screen + its API GETs; prints matrix rows for the category of our parts
import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess(); const p=s.page; const gets=[]; p.on('request',r=>{ if(r.method()==='GET'&&/\/api\//.test(r.url())&&/pric|matri|markup|categor/i.test(r.url())) gets.push(r.url().replace(/^https:\/\/[^/]+/,'')); });
await s.go('/administration'); await p.waitForTimeout(3000);
const links=await p.evaluate(()=>[...document.querySelectorAll('a,[data-test-id]')].filter(a=>a.offsetParent&&/pric|matri|markup/i.test(a.innerText+(a.getAttribute('href')||''))).map(a=>(a.getAttribute('href')||a.getAttribute('data-test-id'))+'='+a.innerText.trim().slice(0,40)));
console.log('links',links);
const l=p.locator('a',{hasText:/pricing/i}).first(); if(await l.count()){ await l.click(); await p.waitForTimeout(4000); }
console.log('url',p.url()); console.log('gets',[...new Set(gets)]);
const txt=await p.evaluate(()=>document.querySelector('main, .q-page')?.innerText.replace(/\n+/g,' | ').slice(0,1500)); console.log(txt);
await p.screenshot({path:'../ev/branch-pricing-matrix.png'}); await s.close(); process.exit(0);
