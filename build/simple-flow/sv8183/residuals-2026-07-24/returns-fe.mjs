// returns-fe.mjs — observe the Returns page + Create Return flow FE per impersonated role.
// Usage: node returns-fe.mjs <slug>
import fs from 'fs';
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import { login, api, switchUser } from './lib.mjs';
const { chromium } = pw;
const APP='https://app.staging.shopview.com';
const QA_UID='01221b93-47b1-497f-bf74-30601453a469';
const WP='b3c8c820-f815-4cf1-8938-10956c5ee71a';
const slug=process.argv[2];
const l=await login('admin'); await switchUser(l.sessCookie,QA_UID);
await api(l.sessCookie,'POST','/api/iam/change-location',{workplace_id:WP,workplace_timezone:'America/Edmonton'});
const fe=await api(l.sessCookie,'GET','/api/auth/me/fe-permissions'); const feData=fe.body.data;
console.log(slug,'perms',feData.fe_permissions.length);
const cookies=l.sessCookie.split('; ').map(p=>{const i=p.indexOf('=');return{name:p.slice(0,i),value:p.slice(i+1),domain:'.staging.shopview.com',path:'/'};});
const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',headless:true,proxy:{server:process.env.HTTPS_PROXY},args:['--no-sandbox','--ignore-certificate-errors','--ssl-version-max=tls1.2']});
const ctx=await browser.newContext({viewport:{width:1600,height:1000},ignoreHTTPSErrors:true}); await ctx.addCookies(cookies);
const page=await ctx.newPage();
await page.goto(APP+'/login',{waitUntil:'domcontentloaded',timeout:60000});
await page.evaluate(({u,f})=>{localStorage.setItem('user',JSON.stringify(u));localStorage.setItem('fe_permissions_wrapper',JSON.stringify(f));if(u.data&&u.data.token)localStorage.setItem('token',JSON.stringify(u.data.token));},{u:{data:l.data},f:feData});
await page.goto(APP+'/parts/returns',{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(6000);
const url=page.url().replace(APP,'');
const create=await page.evaluate(()=>{const bs=[...document.querySelectorAll('button,.q-btn,a[role="button"]')];const b=bs.find(x=>/create return|new return/i.test(x.innerText||''));if(!b)return{found:false};const cs=getComputedStyle(b);const r=b.getBoundingClientRect();return{found:true,visible:cs.display!=='none'&&cs.visibility!=='hidden'&&r.width>0,text:b.innerText.trim()};});
console.log('url',url,'| Create Return button:',JSON.stringify(create));
await page.screenshot({path:`evidence/returns_${slug}.png`,fullPage:false});
let dialog=null;
if(create.found&&create.visible){
  await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].find(x=>/create return|new return/i.test(x.innerText||''));b&&b.click();});
  await page.waitForTimeout(3000);
  dialog=(await page.locator('.q-dialog,[role="dialog"]').first().innerText().catch(()=>'')).replace(/\n+/g,' | ').slice(0,400);
  console.log('CREATE RETURN dialog:',dialog);
  await page.screenshot({path:`evidence/returns_${slug}_dialog.png`,fullPage:false});
}
fs.writeFileSync(`evidence/returns_${slug}.json`,JSON.stringify({perms:feData.fe_permissions.length,url,create,dialog},null,1));
await browser.close();
