// Staging ESTIMATE-WO observer (resolves WO Delete, Approve/Decline line, Change Cust/Asset, line menu).
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import { login, api } from '/home/user/Manual-test-Cases/build/testing-tools/staging-admin.mjs';
import fs from 'fs';
const { chromium } = pw;
const [BP, roleId, roleLabel] = process.argv.slice(2);
const STAFF='6fb22c1b-d6c3-40eb-9cac-5cb9c61e36aa', WP='b3c8c820-f815-4cf1-8938-10956c5ee71a', TECH='44d03e75-7d4a-429b-9513-6457274f8a38';
const SHOTS=`/home/user/Manual-test-Cases/build/custom-roles-run/live-ui-2026-07-15/staging/${roleLabel.replace(/\W+/g,'_')}`;
fs.mkdirSync(SHOTS,{recursive:true});
async function swap(rid){for(let i=0;i<8;i++){const t=await login('admin');const ch=await api(t.sessCookie,'POST',`/api/staff/${STAFF}/change`,{first_name:'Tech',last_name:'ShopView',email:'tech@shopview.com',role_id:rid,workplace_id:WP});if(ch.status===200||ch.status===201)return true;}return false;}
const out={role:roleLabel,est:{}};
if(roleLabel!=='Technician'){out.swap=await swap(roleId);if(!out.swap){console.log(JSON.stringify({role:roleLabel,SWAPFAIL:1}));process.exit(0);}}
const ql=await login('tech'); const feData=(await api(ql.sessCookie,'GET','/api/auth/me/fe-permissions')).body?.data;
const wl=await api(ql.sessCookie,'GET','/api/work-orders?page=1'); const wos=wl.body?.data?.work_orders||[];
const est=wos.find(x=>x.status==='estimate'&&x.linesCount>0)||wos.find(x=>x.status==='estimate')||wos.find(x=>x.linesCount>0);
out.estWO=est?.number;
const cookies=ql.sessCookie.split('; ').map(p=>{const i=p.indexOf('=');return{name:p.slice(0,i),value:p.slice(i+1),domain:'.staging.shopview.com',path:'/',secure:true};});
const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',headless:true,proxy:{server:'http://127.0.0.1:'+BP},args:['--no-sandbox','--ignore-certificate-errors','--disable-quic','--disable-http2','--disable-features=EncryptedClientHello,PostQuantumKyberEncapsulation,TLS13EarlyData,PostQuantumKyber','--ssl-version-max=tls1.2']});
const ctx=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1500,height:1000}});
await ctx.addCookies(cookies);
await ctx.addInitScript(({u,f})=>{localStorage.setItem('user',JSON.stringify({data:u}));localStorage.setItem('fe_permissions_wrapper',JSON.stringify(f));if(u&&u.token)localStorage.setItem('token',JSON.stringify(u.token));localStorage.setItem('bookkeeping_enabled','true');},{u:ql.data,f:feData});
const page=await ctx.newPage();
const e=out.est;
try{
  await page.goto('https://app.staging.shopview.com/workorders/'+est.id,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(7000);
  e.rendered=!page.url().endsWith('/workorders');
  const b=await page.evaluate(()=>{const vis=el=>el.getBoundingClientRect().width>0;const btn=re=>[...document.querySelectorAll('button,.q-btn,a')].some(el=>re.test((el.innerText||'').trim())&&vis(el));const aria=l=>[...document.querySelectorAll('[aria-label]')].some(el=>el.getAttribute('aria-label')===l&&vis(el));return {approveLine:btn(/^Approve$/i),declineLine:btn(/^Decline$/i),changeCustomer:aria('Change Customer'),changeAsset:aria('Change Asset'),newLine:btn(/^New Line$/i)};});
  Object.assign(e,b);
  await page.screenshot({path:`${SHOTS}/estimate_WO.png`,fullPage:true});
  // top menu -> WO Delete
  let topMenu=[];
  for(let k=0;k<4;k++){
    const opened=await page.evaluate((idx)=>{const x=[...document.querySelectorAll('.q-btn')].filter(z=>/more_vert/.test(z.innerHTML)&&z.getBoundingClientRect().top<175&&z.getBoundingClientRect().width>0);if(x[idx]){x[idx].click();return true;}return false;},k);
    if(!opened)break;
    await page.waitForTimeout(900);
    const m=await page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item__label,.q-menu .q-item,[role=menuitem]')].map(z=>z.innerText.trim()).filter(Boolean));
    if(m.length)topMenu=[...new Set([...topMenu,...m])];
    await page.keyboard.press('Escape').catch(()=>{});await page.waitForTimeout(300);
  }
  e.woDelete=topMenu.some(x=>/delete work order/i.test(x)); e.topMenu=topMenu;
  await page.keyboard.press('Escape').catch(()=>{});await page.waitForTimeout(300);
  // line menu -> remove/delete/status/core
  await page.evaluate(()=>{const z=[...document.querySelectorAll('.q-btn')].find(x=>/more_vert/.test(x.innerHTML)&&x.getBoundingClientRect().top>170);if(z)z.click();});
  await page.waitForTimeout(800);
  e.lineMenu=await page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item__label,.q-menu .q-item,[role=menuitem]')].map(z=>z.innerText.trim()).filter(Boolean));
  if(e.lineMenu&&e.lineMenu.length)await page.screenshot({path:`${SHOTS}/estimate_linemenu.png`});
}catch(err){e.ERROR=String(err).slice(0,120);}
await browser.close();
if(roleLabel!=='Technician')out.restore=await swap(TECH);
fs.writeFileSync(`${SHOTS}/estimate-obs.json`,JSON.stringify(out,null,2));
console.log(JSON.stringify({role:roleLabel,estWO:out.estWO,rendered:e.rendered,woDelete:e.woDelete,approve:e.approveLine,decline:e.declineLine,changeCust:e.changeCustomer,changeAsset:e.changeAsset,lineMenu:e.lineMenu,restore:out.restore}));
