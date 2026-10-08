import pkg from '/opt/node22/lib/node_modules/playwright/index.js'; const {chromium}=pkg; import fs from 'fs';
const port=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim(); const sso=/sv_sso_session=([^;\s]+)/.exec(fs.readFileSync('/tmp/qa-cookies/sv10043-sso.txt','utf8'))[1];
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',proxy:{server:`http://127.0.0.1:${port}`},args:['--ignore-certificate-errors']});
const ctx=await b.newContext({ignoreHTTPSErrors:true}); await ctx.addCookies([{name:'sv_sso_session',value:sso,domain:'sv10043api.qa.shopview.com',path:'/',secure:true,sameSite:'None'},{name:'sv_sso_session',value:sso,domain:'sv10043.qa.shopview.com',path:'/',secure:true,sameSite:'None'}]);
const p=await ctx.newPage(); await p.goto('https://sv10043.qa.shopview.com/login',{waitUntil:'domcontentloaded'}); await p.waitForTimeout(12000);
console.log('url',p.url()); console.log((await p.evaluate(()=>document.body.innerText.replace(/\s+/g,' '))).slice(0,600));
console.log('inputs:',await p.evaluate(()=>[...document.querySelectorAll('input')].map(i=>i.type+':'+(i.placeholder||i.name||'')).join(' | ')));
await p.screenshot({path:'/home/user/Manual-test-Cases/build/wo-board-tech-view/build-verify-2026-10-08/qa-sign-in-page.png'}); await b.close();
