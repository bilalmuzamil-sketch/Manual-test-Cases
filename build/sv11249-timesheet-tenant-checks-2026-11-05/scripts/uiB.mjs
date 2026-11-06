// usage: ORG=B node uiB.mjs -> org B: sign in through the login form, open Work Orders > New Work Order, list the dialog ids, screenshot
import {sess,rd} from './common.mjs'; const s=await sess(); const p=s.page; console.log('api login',s.loginStatus);
await p.goto('https://sv11249.qa.shopview.com/login',{waitUntil:'domcontentloaded'}); await p.waitForTimeout(5000);
const has=await p.locator('[data-test-id="input_email"]').count(); console.log('email field',has, p.url());
if(has){ await p.fill('[data-test-id="input_email"]','bilal.muzamil+sv11249b@shopview.com'); await p.fill('[data-test-id="input_password"]',rd('sv11249','pwB.txt'));
 const btn=p.locator('button').filter({hasText:/log ?in|sign ?in/i}).first(); await btn.click(); await p.waitForTimeout(8000); }
console.log('url',p.url()); await p.goto('https://sv11249.qa.shopview.com/workorders',{waitUntil:'domcontentloaded'}); await p.waitForTimeout(8000); console.log('url2',p.url());
await p.screenshot({path:'../ev/orgB-wo.png'}); console.log('IDS',await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-test-id')).filter(x=>/new|create|add/i.test(x)).join(' ')));
await s.close(); process.exit(0);
