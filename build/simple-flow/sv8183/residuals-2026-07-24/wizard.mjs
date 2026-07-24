// wizard.mjs — as impersonated qa_reassign role, open a WO and try to launch the
// "Complete Work Order" completion modal to observe the Resolve-cores step.
// Usage: node wizard.mjs <slug> <woId>
import fs from 'fs';
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import { login, api, switchUser } from './lib.mjs';
const { chromium } = pw;
const APP='https://app.staging.shopview.com';
const QA_UID='01221b93-47b1-497f-bf74-30601453a469';
const WP='b3c8c820-f815-4cf1-8938-10956c5ee71a';
const slug=process.argv[2], woId=process.argv[3];
const l = await login('admin');
await switchUser(l.sessCookie, QA_UID);
await api(l.sessCookie,'POST','/api/iam/change-location',{workplace_id:WP,workplace_timezone:'America/Edmonton'});
const fe = await api(l.sessCookie,'GET','/api/auth/me/fe-permissions');
const feData=fe.body?.data;
console.log(slug,'perms',feData?.fe_permissions?.length);
const cookies=l.sessCookie.split('; ').map(p=>{const i=p.indexOf('=');return{name:p.slice(0,i),value:p.slice(i+1),domain:'.staging.shopview.com',path:'/'};});
const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',headless:true,proxy:{server:process.env.HTTPS_PROXY},args:['--no-sandbox','--ignore-certificate-errors','--ssl-version-max=tls1.2']});
const ctx=await browser.newContext({viewport:{width:1600,height:1000},ignoreHTTPSErrors:true});
await ctx.addCookies(cookies);
const page=await ctx.newPage();
const net=[];
page.on('response',r=>{const u=r.url();if(/pre-resolve-cores|complete|core|receive|accept/i.test(u))net.push(r.request().method()+' '+r.status()+' '+u.replace('https://api.staging.shopview.com',''));});
await page.goto(APP+'/login',{waitUntil:'domcontentloaded',timeout:60000});
await page.evaluate(({u,f})=>{localStorage.setItem('user',JSON.stringify(u));localStorage.setItem('fe_permissions_wrapper',JSON.stringify(f));if(u.data&&u.data.token)localStorage.setItem('token',JSON.stringify(u.data.token));},{u:{data:l.data},f:feData});
await page.goto(APP+'/workorders/'+woId+'/lines',{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(6000);
// find the Complete Work Order master button
const info = await page.evaluate(()=>{
  const btns=[...document.querySelectorAll('button,.q-btn')];
  const cw=btns.find(b=>/complete work order/i.test(b.innerText||''));
  return cw?{found:true,disabled:cw.disabled||cw.classList.contains('q-btn--disable')||cw.getAttribute('aria-disabled')==='true',text:cw.innerText.trim()}:{found:false};
});
console.log('Complete Work Order button:',JSON.stringify(info));
await page.screenshot({path:'evidence/'+slug+'_woLines.png'});
if(info.found && !info.disabled){
  // click it
  await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].find(x=>/complete work order/i.test(x.innerText||''));b&&b.click();});
  await page.waitForTimeout(3500);
  const modal=(await page.locator('.q-dialog, [role="dialog"]').innerText().catch(()=>'')).replace(/\n+/g,' | ');
  console.log('MODAL:',modal.slice(0,500));
  await page.screenshot({path:'evidence/'+slug+'_completeModal.png'});
} else if(info.found && info.disabled){
  // force-click to see if a tooltip/warning explains the block
  console.log('button disabled — capturing state; not clicking');
}
console.log('NET',JSON.stringify(net));
fs.writeFileSync('evidence/'+slug+'_wizard.json',JSON.stringify({info,net},null,1));
await browser.close();
