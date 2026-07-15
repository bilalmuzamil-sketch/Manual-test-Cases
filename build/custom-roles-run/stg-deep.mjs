// Staging deep capability observer via tech role-swap (retry-until-201) + quick-login tech.
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import { login, api } from '/home/user/Manual-test-Cases/build/testing-tools/staging-admin.mjs';
import fs from 'fs';
const { chromium } = pw;
const [BP, roleId, roleLabel] = process.argv.slice(2);
const STAFF='6fb22c1b-d6c3-40eb-9cac-5cb9c61e36aa', WP='b3c8c820-f815-4cf1-8938-10956c5ee71a';
const TECH='44d03e75-7d4a-429b-9513-6457274f8a38';
const SHOTS=`/home/user/Manual-test-Cases/build/custom-roles-run/live-ui-2026-07-15/staging/${roleLabel.replace(/\W+/g,'_')}`;
fs.mkdirSync(SHOTS,{recursive:true});
async function swap(rid){for(let i=0;i<8;i++){const t=await login('admin');const ch=await api(t.sessCookie,'POST',`/api/staff/${STAFF}/change`,{first_name:'Tech',last_name:'ShopView',email:'tech@shopview.com',role_id:rid,workplace_id:WP});if(ch.status===200||ch.status===201)return true;}return false;}
const out={role:roleLabel,roleId,caps:{}};
if(roleLabel!=='Technician'){ out.swap=await swap(roleId); if(!out.swap){out.note='staff/change 403x8';console.log(JSON.stringify({role:roleLabel,SWAPFAIL:true}));process.exit(0);} }
else out.swap=true;
const ql=await login('tech');
const feData=(await api(ql.sessCookie,'GET','/api/auth/me/fe-permissions')).body?.data;
out.perms=feData?.fe_permissions?.length; out.view=feData?.view_mode;
const wl=await api(ql.sessCookie,'GET','/api/work-orders?page=1');
const wos=wl.body?.data?.work_orders||[];
const rfr=wos.find(x=>x.status==='ready_for_review'&&x.linesCount>0)||wos.find(x=>x.linesCount>0)||wos[0];
const inv=wos.find(x=>x.status==='invoiced'&&x.totalPrice>0);
const warm=wos.find(x=>['paid','complete','approved'].includes(x.status))||wos[0];
out.rfrWO=rfr?.number; out.invWO=inv?.number;
const cookies=ql.sessCookie.split('; ').map(p=>{const i=p.indexOf('=');return{name:p.slice(0,i),value:p.slice(i+1),domain:'.staging.shopview.com',path:'/',secure:true};});
const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',headless:true,proxy:{server:'http://127.0.0.1:'+BP},args:['--no-sandbox','--ignore-certificate-errors','--disable-quic','--disable-http2','--disable-features=EncryptedClientHello,PostQuantumKyberEncapsulation,TLS13EarlyData,PostQuantumKyber','--ssl-version-max=tls1.2']});
const ctx=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1500,height:1000}});
await ctx.addCookies(cookies);
await ctx.addInitScript(({u,f})=>{localStorage.setItem('user',JSON.stringify({data:u}));localStorage.setItem('fe_permissions_wrapper',JSON.stringify(f));if(u&&u.token)localStorage.setItem('token',JSON.stringify(u.token));localStorage.setItem('bookkeeping_enabled','true');},{u:ql.data,f:feData});
const page=await ctx.newPage();
const vis=`el=>{const r=el.getBoundingClientRect();const s=getComputedStyle(el);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none';}`;
async function grabMenu(){return page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item,.q-menu .q-item__label,[role=menuitem]')].map(e=>e.innerText.trim()).filter(Boolean));}
const c=out.caps;
try{
  if(warm){await page.goto('https://app.staging.shopview.com/workorders/'+warm.id,{waitUntil:'domcontentloaded',timeout:60000});await page.waitForTimeout(4000);}
  if(rfr){
    await page.goto('https://app.staging.shopview.com/workorders/'+rfr.id,{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForTimeout(7000);
    out.rendered=!page.url().endsWith('/workorders');
    const base=await page.evaluate((visStr)=>{const vis=eval(visStr);const btn=re=>[...document.querySelectorAll('button,.q-btn,a')].some(el=>re.test((el.innerText||'').trim())&&vis(el));const aria=l=>{const e=[...document.querySelectorAll('[aria-label]')].find(el=>el.getAttribute('aria-label')===l);return e?vis(e):false;};return {sendToPortal:aria('Send to Portal'),newLine:btn(/^New Line$/i),reviewed:btn(/^Reviewed$/i),complete:btn(/^Complete$/i),woDeleteBtn:btn(/Delete Work Order/i),rateMargin:/\bRate\b/.test(document.body.innerText)&&/\bMargin\b/.test(document.body.innerText),tabs:[...document.querySelectorAll('.q-tab,.q-tab__label')].map(e=>e.innerText.trim()).filter(Boolean)};},vis);
    Object.assign(c,base);
    await page.screenshot({path:`${SHOTS}/WO_detail.png`,fullPage:true});
    await page.evaluate(()=>{const btns=[...document.querySelectorAll('.q-btn')].filter(b=>{const r=b.getBoundingClientRect();return r.top<170&&r.width<70&&/more_vert/.test(b.innerHTML);});if(btns.length)btns[btns.length-1].click();});
    await page.waitForTimeout(900); c.topMenuItems=await grabMenu(); await page.keyboard.press('Escape').catch(()=>{});await page.waitForTimeout(300);
    await page.evaluate(()=>{const b=[...document.querySelectorAll('.q-btn')].find(x=>/more_vert/.test(x.innerHTML)&&x.getBoundingClientRect().top>170);if(b)b.click();});
    await page.waitForTimeout(900); c.lineMenuItems=await grabMenu();
    if(c.lineMenuItems&&c.lineMenuItems.length)await page.screenshot({path:`${SHOTS}/line_menu.png`});
    await page.keyboard.press('Escape').catch(()=>{});await page.waitForTimeout(300);
    const notesTab=await page.evaluate(()=>{const t=[...document.querySelectorAll('.q-tab,.q-tab__label')].find(e=>/^notes/i.test(e.innerText.trim()));if(t){t.click();return true;}return false;});
    if(notesTab){await page.waitForTimeout(2000);c.notesControls=await page.evaluate(()=>[...document.querySelectorAll('button,.q-btn,textarea')].map(e=>(e.getAttribute('aria-label')||e.innerText||e.tagName).trim()).filter(x=>x&&x.length<30).slice(0,12));await page.screenshot({path:`${SHOTS}/notes.png`});}
    c.historyTabVisible=await page.evaluate(()=>{const t=[...document.querySelectorAll('.q-tab,.q-tab__label')].find(e=>/^history/i.test(e.innerText.trim()));if(t){t.click();return true;}return false;});
    if(c.historyTabVisible){await page.waitForTimeout(2000);await page.screenshot({path:`${SHOTS}/history.png`});}
    const partsTab=await page.evaluate(()=>{const t=[...document.querySelectorAll('.q-tab,.q-tab__label')].find(e=>/^parts/i.test(e.innerText.trim()));if(t){t.click();return true;}return false;});
    if(partsTab){await page.waitForTimeout(2000);c.partsControls=await page.evaluate(()=>[...document.querySelectorAll('button,.q-btn,a')].map(e=>(e.getAttribute('aria-label')||e.innerText||'').trim()).filter(x=>x&&x.length<30).slice(0,20));await page.screenshot({path:`${SHOTS}/parts.png`});}
  }
  if(inv){
    await page.goto('https://app.staging.shopview.com/workorders/'+inv.id,{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForTimeout(6000);
    c.financeReachable=await page.evaluate(()=>{const t=[...document.querySelectorAll('.q-tab,.q-tab__label')].find(e=>/^finance/i.test(e.innerText.trim()));if(t){t.click();return true;}return false;});
    await page.waitForTimeout(3000);
    c.newPaymentBtn=await page.evaluate(()=>[...document.querySelectorAll('button,.q-btn')].some(e=>/new payment/i.test((e.innerText||'').trim())&&e.getBoundingClientRect().width>0));
    await page.screenshot({path:`${SHOTS}/invoice_finance.png`,fullPage:true});
    if(c.newPaymentBtn){await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].find(e=>/new payment/i.test((e.innerText||'').trim()));if(b)b.click();});await page.waitForTimeout(2500);c.sendToTerminal=await page.evaluate(()=>{const d=document.querySelector('.q-dialog');if(!d)return false;return[...d.querySelectorAll('button,.q-btn')].some(e=>/send to terminal/i.test((e.innerText||'').trim()));});await page.screenshot({path:`${SHOTS}/payment_dialog.png`});}
  }
}catch(e){out.ERROR=String(e).slice(0,140);}
await browser.close();
if(roleLabel!=='Technician') out.restore=await swap(TECH);
fs.writeFileSync(`${SHOTS}/observation-full.json`,JSON.stringify(out,null,2));
console.log(JSON.stringify({role:roleLabel,perms:out.perms,view:out.view,rendered:out.rendered,portal:c.sendToPortal,newLine:c.newLine,reviewed:c.reviewed,rate:c.rateMargin,topMenu:c.topMenuItems,lineMenu:c.lineMenuItems,newPay:c.newPaymentBtn,ST:c.sendToTerminal,restore:out.restore}));
