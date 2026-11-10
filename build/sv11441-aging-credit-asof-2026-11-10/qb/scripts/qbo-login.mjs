// Intuit sandbox sign-in (credentials from /tmp/intuit only); persistent profile so a code is needed once
import pkg from '/opt/node22/lib/node_modules/playwright/index.js'; const {chromium}=pkg; import fs from 'fs';
const U=fs.readFileSync('/tmp/intuit/user','utf8').trim(), P=fs.readFileSync('/tmp/intuit/pw','utf8').trim();
const ctx=await chromium.launchPersistentContext('/tmp/qbo-profile',{headless:true,viewport:{width:1600,height:900},deviceScaleFactor:2,userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36'});
const p=ctx.pages()[0]||await ctx.newPage(); const shot=n=>p.screenshot({path:'/tmp/qbo-'+n+'.png'});
await p.goto('https://sandbox.qbo.intuit.com/',{waitUntil:'domcontentloaded',timeout:90000}); await p.waitForTimeout(8000); console.log('1',p.url()); await shot(1);
const txt=async()=>(await p.evaluate(()=>document.body.innerText)).replace(/\s+/g,' ').slice(0,300);
console.log(await txt());
const em=p.locator('input[type=email], input[name=Email], #iux-identifier-first-international-email-user-id-input, input[autocomplete=username]').first();
if(await em.count()){ await em.fill(U); await p.keyboard.press('Enter'); await p.waitForTimeout(6000); console.log('2',p.url(), await txt()); await shot(2); }
const pw=p.locator('input[type=password]').first();
if(await pw.count()){ await pw.fill(P); await p.keyboard.press('Enter'); await p.waitForTimeout(10000); console.log('3',p.url(), await txt()); await shot(3); }
await ctx.close(); process.exit(0);
