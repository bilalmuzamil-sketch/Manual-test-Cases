import { chromium } from '/home/user/Manual-test-Cases/build/global-search/e2e/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const jar=JSON.parse(fs.readFileSync('/tmp/qa-cookies/staging-full.json','utf8'));
const b=await chromium.launch({args:['--ignore-certificate-errors']});
const ctx=await b.newContext({ignoreHTTPSErrors:true});
await ctx.addCookies(Object.entries(jar).filter(([k,v])=>typeof v==='string').map(([name,value])=>
  ({name,value,domain:'app.staging.shopview.com',path:'/'})));
const p=await ctx.newPage();
await p.goto('https://app.staging.shopview.com/login?redirect=/customers',{waitUntil:'domcontentloaded'});
await p.waitForTimeout(9000);
console.log('url  :', p.url());
console.log('title:', await p.title());
const t=await p.evaluate(()=>document.body.innerText.replace(/\s+/g,' ').trim().slice(0,400));
console.log('page :', t);
const btns=await p.evaluate(()=>[...document.querySelectorAll('button,a')].map(e=>e.innerText.replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,20));
console.log('buttons:', JSON.stringify(btns));
await p.screenshot({path:'/tmp/claude-0/login-state.png'});
await b.close();
