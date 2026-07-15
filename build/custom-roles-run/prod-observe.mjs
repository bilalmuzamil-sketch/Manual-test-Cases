// GENUINE live prod UI observer via switch-user impersonation on the OLD-model SPA.
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import { papi } from '/tmp/custom-roles/prodapi.mjs';
import fs from 'fs';
const { chromium } = pw;
const [BP, userId, roleLabel] = process.argv.slice(2);
const SID='<PROD_PHPSESSID_FROM_TMP>';
const WO_RFR='035174b3-1d02-4112-bc6c-1d16d8c99dd9'; // S2-712 ready_for_review
const WO_INV='c63933fd-50e6-4dc1-a8f2-db64d5a203e7'; // S2-707 invoiced
const APP='https://app.shopview.com';
const SHOTS=`/home/user/Manual-test-Cases/build/custom-roles-run/live-ui-2026-07-15/production/${roleLabel.replace(/\W+/g,'_')}`;
fs.mkdirSync(SHOTS,{recursive:true});
let switched=false, userData;
if(userId!=='__self__'){
  const su=await papi('POST','/api/switch-user',{user_id:userId});
  if(su.status!==200){console.log(JSON.stringify({FATAL:'switch-user',status:su.status,body:su.body}));process.exit(3);}
  switched=true; userData=su.body?.data;
}
// fetch WOs in the impersonated user's org context so the detail actually loads
let WO_RFR2=WO_RFR, WO_INV2=WO_INV, orgName='';
try{
  const wl=await papi('GET','/api/work-orders?page=1');
  const wos=(wl.body&&wl.body.data&&wl.body.data.work_orders)||[];
  const pick=(st)=>{const m=wos.find(w=>w.status===st);return m&&m.id;};
  WO_RFR2=pick('ready_for_review')||pick('complete')||pick('approved')||WO_RFR;
  WO_INV2=pick('invoiced')||pick('paid')||WO_INV2;
}catch(e){}
const cookies=[{name:'PHPSESSID',value:SID,domain:'.shopview.com',path:'/',secure:true}];
const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',headless:true,proxy:{server:'http://127.0.0.1:'+BP},args:['--no-sandbox','--ignore-certificate-errors','--disable-quic','--disable-http2','--disable-features=EncryptedClientHello,PostQuantumKyberEncapsulation,TLS13EarlyData,PostQuantumKyber','--ssl-version-max=tls1.2']});
const ctx=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1500,height:1000}});
await ctx.addCookies(cookies);
await ctx.addInitScript(({u})=>{try{localStorage.setItem('user',JSON.stringify({data:u}));if(u&&u.token)localStorage.setItem('token',JSON.stringify(u.token));if(u&&u.permissions)localStorage.setItem('permissions',JSON.stringify(u.permissions));localStorage.setItem('bookkeeping_enabled','true');}catch(e){}},{u:userData});
const page=await ctx.newPage();
const out={role:roleLabel,userId,perms:(userData?.permissions||[]).length,caps:{}};
async function obs(woId,tag){
  await page.goto(`${APP}/workorders/${woId}`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(8000);
  const sig=await page.evaluate(()=>{
    const vis=el=>{const r=el.getBoundingClientRect();const s=getComputedStyle(el);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none';};
    const btn=re=>[...document.querySelectorAll('button,.q-btn,a')].some(el=>re.test((el.innerText||'').trim())&&vis(el));
    const aria=l=>{const e=[...document.querySelectorAll('[aria-label]')].find(el=>el.getAttribute('aria-label')===l);return e?vis(e):false;};
    const tab=n=>[...document.querySelectorAll('.q-tab,.q-tab__label,a,div,button')].some(el=>(el.innerText||'').trim()===n&&vis(el));
    return {sendToPortal:aria('Send to Portal')||btn(/send to portal/i), deleteWorkOrder:btn(/^Delete Work Order$/i),
      newLine:btn(/^New Line$/i), reviewed:btn(/^Reviewed$/i), complete:btn(/^Complete$/i),
      lineBulkAction:aria('Line bulk action'), financeTab:tab('Finance'), partsTab:/Parts \(/.test(document.body.innerText),
      rateMargin:/\bRate\b/.test(document.body.innerText)&&/\bMargin\b/.test(document.body.innerText),
      takePayment:btn(/take payment|send to terminal|charge card|collect payment/i),
      visibleButtons:[...document.querySelectorAll('button,.q-btn')].filter(vis).map(el=>(el.getAttribute('aria-label')||(el.innerText||'').trim())).filter(x=>x&&x.length<40).slice(0,45)};
  });
  await page.screenshot({path:`${SHOTS}/WO_${tag}.png`,fullPage:true});
  return {url:page.url(),onLogin:/\/login|\/sign/.test(page.url()),...sig};
}
try{ out.caps.rfr=await obs(WO_RFR2,'ready_for_review'); out.caps.invoiced=await obs(WO_INV2,'invoiced'); }
catch(e){out.ERROR=String(e).slice(0,180);}
await browser.close();
if(switched){const ex=await papi('POST','/api/exit-switch-user',{});out.exit=ex.status;}
fs.writeFileSync(`${SHOTS}/observation.json`,JSON.stringify(out,null,1));
const r=out.caps.rfr||{};
console.log(JSON.stringify({role:roleLabel,perms:out.perms,exit:out.exit,login:r.onLogin,portal:r.sendToPortal,newLine:r.newLine,reviewed:r.reviewed,del:r.deleteWorkOrder,lineBulk:r.lineBulkAction,finance:r.financeTab,rate:r.rateMargin,nBtns:(r.visibleButtons||[]).length}));
