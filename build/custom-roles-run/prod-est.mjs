import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import { plogin, papi } from '/tmp/custom-roles/prodlogin.mjs';
import fs from 'fs';
const { chromium } = pw;
const [BP, roleId, roleLabel] = process.argv.slice(2);
const creds=Object.fromEntries(fs.readFileSync('/tmp/custom-roles/prod-creds.env','utf8').split('\n').filter(Boolean).map(l=>{const i=l.indexOf('=');return[l.slice(0,i),l.slice(i+1)];}));
const rec=JSON.parse(fs.readFileSync('/tmp/custom-roles/prod-teststaff-rec.json','utf8')); const STAFF=rec.staff_id;
const SHOTS=`/home/user/Manual-test-Cases/build/custom-roles-run/live-ui-2026-07-15/production/${roleLabel.replace(/\W+/g,'_')}`;
fs.mkdirSync(SHOTS,{recursive:true});
async function tslogin(){const r=await fetch('https://api.shopview.com/api/login',{method:'POST',redirect:'manual',headers:{'Content-Type':'application/json','Origin':'https://app.shopview.com','User-Agent':'Mozilla/5.0'},body:JSON.stringify({username:creds.PROD_TESTSTAFF,password:creds.PROD_PASS})});const sc=r.headers.get('set-cookie')||'';const m=sc.match(/PHPSESSID=([^;]+)/);const j=await r.json();return {sessCookie:'PHPSESSID='+(m?m[1]:''),data:j.data};}
const a=await plogin();
const body={id:STAFF,first_name:rec.first_name,last_name:rec.last_name,email:rec.email,role_id:roleId,workplace_id:rec.defaultWorkplace,job_title:rec.job_title,salary_type:rec.salary_type,salary:rec.salary,billable:rec.billable,clockable:rec.clockable};
const ch=await papi(a.sessCookie,'POST','/api/staff/change',body);
const out={role:roleLabel,change_status:ch.status,est:{}};
if(ch.status!==200&&ch.status!==201){console.log(JSON.stringify({role:roleLabel,FAIL:ch.status}));process.exit(0);}
const ts=await tslogin();
const wl=await papi(ts.sessCookie,'GET','/api/work-orders?page=1'); const wos=wl.body?.data?.work_orders||[];
const est=wos.find(x=>x.status==='estimate'&&x.linesCount>0)||wos.find(x=>x.status==='estimate')||wos.find(x=>x.linesCount>0);
out.estWO=est?.number;
const cookies=[{name:'PHPSESSID',value:ts.sessCookie.split('=')[1],domain:'.shopview.com',path:'/',secure:true}];
const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',headless:true,proxy:{server:'http://127.0.0.1:'+BP},args:['--no-sandbox','--ignore-certificate-errors','--disable-quic','--disable-http2','--disable-features=EncryptedClientHello,PostQuantumKyberEncapsulation,TLS13EarlyData,PostQuantumKyber','--ssl-version-max=tls1.2']});
const ctx=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1500,height:1000}});
await ctx.addCookies(cookies);
await ctx.addInitScript(({u})=>{localStorage.setItem('user',JSON.stringify({data:u}));if(u&&u.token)localStorage.setItem('token',JSON.stringify(u.token));if(u&&u.permissions)localStorage.setItem('permissions',JSON.stringify(u.permissions));localStorage.setItem('bookkeeping_enabled','true');},{u:ts.data});
const page=await ctx.newPage(); const e=out.est;
try{
  if(est){
    await page.goto('https://app.shopview.com/workorders/'+est.id,{waitUntil:'domcontentloaded',timeout:60000}); await page.waitForTimeout(7000);
    e.rendered=!page.url().endsWith('/workorders');
    const b=await page.evaluate(()=>{const vis=el=>el.getBoundingClientRect().width>0;const btn=re=>[...document.querySelectorAll('button,.q-btn,a')].some(el=>re.test((el.innerText||'').trim())&&vis(el));const aria=l=>[...document.querySelectorAll('[aria-label]')].some(el=>el.getAttribute('aria-label')===l&&vis(el));return {approveLine:btn(/^Approve$/i),declineLine:btn(/^Decline$/i),changeCustomer:aria('Change Customer'),changeAsset:aria('Change Asset'),newLine:btn(/^New Line$/i)};});
    Object.assign(e,b); await page.screenshot({path:`${SHOTS}/estimate_WO.png`,fullPage:true});
    let topMenu=[];
    for(let k=0;k<4;k++){const opened=await page.evaluate((idx)=>{const x=[...document.querySelectorAll('.q-btn')].filter(z=>/more_vert/.test(z.innerHTML)&&z.getBoundingClientRect().top<175&&z.getBoundingClientRect().width>0);if(x[idx]){x[idx].click();return true;}return false;},k);if(!opened)break;await page.waitForTimeout(900);const m=await page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item__label,.q-menu .q-item,[role=menuitem]')].map(z=>z.innerText.trim()).filter(Boolean));if(m.length)topMenu=[...new Set([...topMenu,...m])];await page.keyboard.press('Escape').catch(()=>{});await page.waitForTimeout(300);}
    e.woDelete=topMenu.some(x=>/delete work order/i.test(x)); e.topMenu=topMenu;
  }
}catch(err){e.ERROR=String(err).slice(0,120);}
await browser.close();
fs.writeFileSync(`${SHOTS}/estimate-obs.json`,JSON.stringify(out,null,2));
console.log(JSON.stringify({role:roleLabel,estWO:out.estWO,rendered:e.rendered,woDelete:e.woDelete,approve:e.approveLine,decline:e.declineLine,changeCust:e.changeCustomer,changeAsset:e.changeAsset}));
