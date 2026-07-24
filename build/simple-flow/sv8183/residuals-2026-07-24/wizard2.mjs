// wizard2.mjs — open completion modal and STEP THROUGH to the Resolve-cores step, capture it, then CANCEL.
// Never clicks a final Complete. Usage: node wizard2.mjs <slug> <woId>
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
const cookies=l.sessCookie.split('; ').map(p=>{const i=p.indexOf('=');return{name:p.slice(0,i),value:p.slice(i+1),domain:'.staging.shopview.com',path:'/'};});
const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',headless:true,proxy:{server:process.env.HTTPS_PROXY},args:['--no-sandbox','--ignore-certificate-errors','--ssl-version-max=tls1.2']});
const ctx=await browser.newContext({viewport:{width:1600,height:1000},ignoreHTTPSErrors:true});
await ctx.addCookies(cookies);
const page=await ctx.newPage();
const net=[];
page.on('response',r=>{const u=r.url();if(/pre-resolve-cores|complete|resolve|core/i.test(u))net.push(r.request().method()+' '+r.status()+' '+u.replace('https://api.staging.shopview.com',''));});
await page.goto(APP+'/login',{waitUntil:'domcontentloaded',timeout:60000});
await page.evaluate(({u,f})=>{localStorage.setItem('user',JSON.stringify(u));localStorage.setItem('fe_permissions_wrapper',JSON.stringify(f));if(u.data&&u.data.token)localStorage.setItem('token',JSON.stringify(u.data.token));},{u:{data:l.data},f:feData});
await page.goto(APP+'/workorders/'+woId+'/lines',{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(6000);
// open modal
await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].find(x=>/complete work order/i.test(x.innerText||''));b&&b.click();});
await page.waitForTimeout(2500);
const steps=[];
for(let i=0;i<5;i++){
  const modalText=(await page.locator('.q-dialog, [role="dialog"]').first().innerText().catch(()=>'')).replace(/\n+/g,' | ');
  const heading = modalText.split(' | ').slice(0,3).join(' | ');
  steps.push({i,head:heading, hasResolveCoresActive: /Resolve cores/i.test(modalText) && /(OK.*Returned|Not OK|Keep|Charge|isCoreOk|core)/i.test(modalText)});
  await page.screenshot({path:`evidence/${slug}_step${i}.png`});
  // detect resolve-cores OK/NotOK buttons visible
  const coreBtns = await page.evaluate(()=>{
    const bs=[...document.querySelectorAll('.q-dialog button,.q-dialog .q-btn,[role="dialog"] button')];
    return bs.map(b=>b.innerText.trim().replace(/\s+/g,' ')).filter(t=>t && /ok|not ok|return|keep|charge/i.test(t));
  });
  if(coreBtns.length){ steps[steps.length-1].coreButtons=coreBtns; console.log('RESOLVE-CORES buttons at step',i,':',JSON.stringify(coreBtns)); }
  console.log('step',i,'head:',heading, coreBtns.length?'[CORE STEP]':'');
  // fill any mileage/engine hours inputs to allow Continue
  await page.evaluate(()=>{ for(const inp of document.querySelectorAll('.q-dialog input, [role="dialog"] input')){ if(!inp.value && inp.type!=='checkbox'){ inp.value='100'; inp.dispatchEvent(new Event('input',{bubbles:true})); } } });
  // click Continue if present & enabled
  const clicked = await page.evaluate(()=>{ const b=[...document.querySelectorAll('.q-dialog button,.q-dialog .q-btn,[role="dialog"] button')].find(x=>/^continue/i.test(x.innerText.trim())); if(b && !(b.disabled||b.classList.contains('q-btn--disable'))){ b.click(); return true;} return false; });
  if(!clicked){ console.log('no enabled Continue at step',i,'- stopping advance'); break; }
  await page.waitForTimeout(2500);
}
// CANCEL out without completing
await page.evaluate(()=>{const b=[...document.querySelectorAll('.q-dialog button,.q-dialog .q-btn,[role="dialog"] button')].find(x=>/^cancel/i.test(x.innerText.trim())||/close/i.test(x.getAttribute('aria-label')||''));b&&b.click();});
await page.waitForTimeout(1000);
console.log('NET',JSON.stringify(net));
fs.writeFileSync(`evidence/${slug}_wizardsteps.json`,JSON.stringify({steps,net},null,1));
await browser.close();
