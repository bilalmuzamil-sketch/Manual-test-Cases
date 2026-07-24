// wizard3.mjs — drive completion modal through Pick parts -> Resolve cores, capture the core step, then CANCEL (no finalize).
// Usage: node wizard3.mjs <slug> <woId>
import fs from 'fs';
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import { login, api, switchUser } from './lib.mjs';
const { chromium } = pw;
const APP='https://app.staging.shopview.com';
const QA_UID='01221b93-47b1-497f-bf74-30601453a469';
const WP='b3c8c820-f815-4cf1-8938-10956c5ee71a';
const slug=process.argv[2], woId=process.argv[3];
const l=await login('admin'); await switchUser(l.sessCookie,QA_UID);
await api(l.sessCookie,'POST','/api/iam/change-location',{workplace_id:WP,workplace_timezone:'America/Edmonton'});
const fe=await api(l.sessCookie,'GET','/api/auth/me/fe-permissions'); const feData=fe.body.data;
console.log(slug,'perms',feData.fe_permissions.length);
const cookies=l.sessCookie.split('; ').map(p=>{const i=p.indexOf('=');return{name:p.slice(0,i),value:p.slice(i+1),domain:'.staging.shopview.com',path:'/'};});
const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',headless:true,proxy:{server:process.env.HTTPS_PROXY},args:['--no-sandbox','--ignore-certificate-errors','--ssl-version-max=tls1.2']});
const ctx=await browser.newContext({viewport:{width:1600,height:1000},ignoreHTTPSErrors:true}); await ctx.addCookies(cookies);
const page=await ctx.newPage();
const net=[];
page.on('response',r=>{const u=r.url();if(/pre-resolve-cores|core|pick|complete/i.test(u)&&!/google/.test(u))net.push(r.request().method()+' '+r.status()+' '+u.replace('https://api.staging.shopview.com',''));});
await page.goto(APP+'/login',{waitUntil:'domcontentloaded',timeout:60000});
await page.evaluate(({u,f})=>{localStorage.setItem('user',JSON.stringify(u));localStorage.setItem('fe_permissions_wrapper',JSON.stringify(f));if(u.data&&u.data.token)localStorage.setItem('token',JSON.stringify(u.data.token));},{u:{data:l.data},f:feData});
await page.goto(APP+'/workorders/'+woId+'/lines',{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(6000);
await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].find(x=>/complete work order/i.test(x.innerText||''));b&&b.click();});
await page.waitForTimeout(2500);
const log=[];
for(let i=0;i<6;i++){
  const dlg=await page.evaluate(()=>{const d=document.querySelector('.q-dialog,[role="dialog"]');if(!d)return null;return {text:d.innerText.replace(/\n+/g,' | ').slice(0,400),btns:[...d.querySelectorAll('button,.q-btn')].map(b=>({t:b.innerText.trim().replace(/\s+/g,' '),dis:b.disabled||b.classList.contains('q-btn--disable')}))};});
  if(!dlg){log.push({i,gone:true});break;}
  const head=dlg.text.split(' | ').find(t=>/pick parts|resolve cores|missing details|receive/i.test(t))||dlg.text.slice(0,60);
  const isCore=/resolve cores/i.test(dlg.text) && dlg.btns.some(b=>/ok|not ok|return|keep|charge/i.test(b.t));
  log.push({i,head,text:dlg.text,btns:dlg.btns});
  await page.screenshot({path:`evidence/${slug}_w${i}.png`});
  console.log('step',i,'|',head,'| coreStep',isCore);
  if(isCore){ console.log('   CORE buttons:',JSON.stringify(dlg.btns.filter(b=>/ok|not ok|return|keep|charge/i.test(b.t)))); break; }
  // pick all if present
  await page.evaluate(()=>{const b=[...document.querySelectorAll('.q-dialog button,.q-dialog .q-btn')].find(x=>/^pick all/i.test(x.innerText.trim()));b&&b.click();});
  await page.waitForTimeout(1200);
  // fill inputs (mileage/engine hours)
  await page.evaluate(()=>{for(const inp of document.querySelectorAll('.q-dialog input')){if(!inp.value&&inp.type!=='checkbox'){inp.value='150';inp.dispatchEvent(new Event('input',{bubbles:true}));inp.dispatchEvent(new Event('change',{bubbles:true}));}}});
  await page.waitForTimeout(600);
  const adv=await page.evaluate(()=>{const b=[...document.querySelectorAll('.q-dialog button,.q-dialog .q-btn')].find(x=>/^continue/i.test(x.innerText.trim()));if(b&&!(b.disabled||b.classList.contains('q-btn--disable'))){b.click();return true;}return false;});
  if(!adv){console.log('   Continue disabled at step',i,'- cannot advance');break;}
  await page.waitForTimeout(2500);
}
// CANCEL (do not finalize)
await page.evaluate(()=>{const b=[...document.querySelectorAll('.q-dialog button,.q-dialog .q-btn')].find(x=>/^cancel/i.test(x.innerText.trim()));if(b)b.click();else{const c=[...document.querySelectorAll('.q-dialog button')].find(x=>/close/i.test(x.getAttribute('aria-label')||x.innerText));c&&c.click();}});
await page.waitForTimeout(800);
console.log('NET',JSON.stringify(net));
fs.writeFileSync(`evidence/${slug}_wizard_full.json`,JSON.stringify({perms:feData.fe_permissions.length,log,net},null,1));
await browser.close();
