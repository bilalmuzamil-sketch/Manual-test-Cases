// Comprehensive prod capability observer via test-staff role-swap.
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import { plogin, papi } from '/tmp/custom-roles/prodlogin.mjs';
import fs from 'fs';
const { chromium } = pw;
const [BP, roleId, roleLabel] = process.argv.slice(2);
const creds=Object.fromEntries(fs.readFileSync('/tmp/custom-roles/prod-creds.env','utf8').split('\n').filter(Boolean).map(l=>{const i=l.indexOf('=');return[l.slice(0,i),l.slice(i+1)];}));
const rec=JSON.parse(fs.readFileSync('/tmp/custom-roles/prod-teststaff-rec.json','utf8'));
const STAFF=rec.staff_id;
const SHOTS=`/home/user/Manual-test-Cases/build/custom-roles-run/live-ui-2026-07-15/production/${roleLabel.replace(/\W+/g,'_')}`;
fs.mkdirSync(SHOTS,{recursive:true});
async function tslogin(){
  const r=await fetch('https://api.shopview.com/api/login',{method:'POST',redirect:'manual',headers:{'Content-Type':'application/json','Origin':'https://app.shopview.com','User-Agent':'Mozilla/5.0'},body:JSON.stringify({username:creds.PROD_TESTSTAFF,password:creds.PROD_PASS})});
  const sc=r.headers.get('set-cookie')||''; const m=sc.match(/PHPSESSID=([^;]+)/);
  const j=await r.json(); return {sessCookie:'PHPSESSID='+(m?m[1]:''),data:j.data,status:r.status};
}
// reassign role
const a=await plogin();
const body={id:STAFF,first_name:rec.first_name,last_name:rec.last_name,email:rec.email,role_id:roleId,workplace_id:rec.defaultWorkplace,job_title:rec.job_title,salary_type:rec.salary_type,salary:rec.salary,billable:rec.billable,clockable:rec.clockable};
const ch=await papi(a.sessCookie,'POST','/api/staff/change',body);
const out={role:roleLabel,roleId,change_status:ch.status,caps:{}};
if(ch.status!==200&&ch.status!==201){out.err=JSON.stringify(ch.body).slice(0,100);console.log(JSON.stringify({role:roleLabel,FAIL:out.err}));process.exit(0);}
const ts=await tslogin();
out.perms=(ts.data?.permissions||[]).length;
out.view=ts.data?.details?.view_mode||ts.data?.view_mode||null;
// WOs in org
const wl=await papi(ts.sessCookie,'GET','/api/work-orders?page=1');
const wos=wl.body?.data?.work_orders||[];
const rfr=wos.find(x=>x.status==='ready_for_review'&&x.linesCount>0)||wos.find(x=>x.linesCount>0)||wos.find(x=>['approved','complete'].includes(x.status))||wos[0];
const inv=wos.find(x=>x.status==='invoiced'&&x.totalPrice>0);
out.rfrWO=rfr?.number; out.invWO=inv?.number;
const cookies=[{name:'PHPSESSID',value:ts.sessCookie.split('=')[1],domain:'.shopview.com',path:'/',secure:true}];
const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',headless:true,proxy:{server:'http://127.0.0.1:'+BP},args:['--no-sandbox','--ignore-certificate-errors','--disable-quic','--disable-http2','--disable-features=EncryptedClientHello,PostQuantumKyberEncapsulation,TLS13EarlyData,PostQuantumKyber','--ssl-version-max=tls1.2']});
const ctx=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1500,height:1000}});
await ctx.addCookies(cookies);
await ctx.addInitScript(({u})=>{localStorage.setItem('user',JSON.stringify({data:u}));if(u&&u.token)localStorage.setItem('token',JSON.stringify(u.token));if(u&&u.permissions)localStorage.setItem('permissions',JSON.stringify(u.permissions));localStorage.setItem('bookkeeping_enabled','true');},{u:ts.data});
const page=await ctx.newPage();
const vis=`el=>{const r=el.getBoundingClientRect();const s=getComputedStyle(el);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none';}`;
async function grabMenu(){return page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item,.q-menu .q-item__label,[role=menuitem]')].map(e=>e.innerText.trim()).filter(Boolean));}
const c=out.caps;
try{
  if(rfr){
    await page.goto('https://app.shopview.com/workorders/'+rfr.id,{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForTimeout(7000);
    out.rendered=!page.url().endsWith('/workorders');
    // top-bar + columns + tabs
    const base=await page.evaluate((visStr)=>{
      const vis=eval(visStr);
      const btn=re=>[...document.querySelectorAll('button,.q-btn,a')].some(el=>re.test((el.innerText||'').trim())&&vis(el));
      const aria=l=>{const e=[...document.querySelectorAll('[aria-label]')].find(el=>el.getAttribute('aria-label')===l);return e?vis(e):false;};
      return {
        sendToPortal:aria('Send to Portal'), newLine:btn(/^New Line$/i), reviewed:btn(/^Reviewed$/i), complete:btn(/^Complete$/i),
        rateMargin:/\bRate\b/.test(document.body.innerText)&&/\bMargin\b/.test(document.body.innerText),
        tabs:[...document.querySelectorAll('.q-tab,.q-tab__label')].map(e=>e.innerText.trim()).filter(Boolean),
        lineBulkAria:aria('Line bulk action')
      };
    }, vis);
    Object.assign(c, base);
    await page.screenshot({path:`${SHOTS}/WO_detail.png`,fullPage:true});
    // top ⋮ menu (WO Delete etc)
    const topMenu=await page.evaluate(()=>{const btns=[...document.querySelectorAll('.q-btn')].filter(b=>{const r=b.getBoundingClientRect();return r.top<170&&r.width<70&&/more_vert/.test(b.innerHTML);});if(btns.length){btns[btns.length-1].click();return true;}return false;});
    await page.waitForTimeout(900); c.topMenuItems=await grabMenu();
    await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(300);
    // line ⋮ menu (remove part / delete line / set status / core / approve)
    const lineMenu=await page.evaluate(()=>{const b=[...document.querySelectorAll('.q-btn')].find(x=>/more_vert/.test(x.innerHTML)&&x.getBoundingClientRect().top>170);if(b){b.click();return true;}return false;});
    await page.waitForTimeout(900); c.lineMenuItems=await grabMenu();
    if(c.lineMenuItems&&c.lineMenuItems.length) await page.screenshot({path:`${SHOTS}/line_menu.png`});
    await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(300);
    // Notes tab
    const notesTab=await page.evaluate(()=>{const t=[...document.querySelectorAll('.q-tab,.q-tab__label')].find(e=>/^notes/i.test(e.innerText.trim()));if(t){t.click();return true;}return false;});
    if(notesTab){await page.waitForTimeout(2500);c.notesControls=await page.evaluate(()=>[...document.querySelectorAll('button,.q-btn,textarea,[contenteditable]')].map(e=>(e.getAttribute('aria-label')||e.innerText||e.tagName).trim()).filter(x=>x&&x.length<30).slice(0,15));await page.screenshot({path:`${SHOTS}/notes.png`});}
    // History tab
    const histTab=await page.evaluate(()=>{const t=[...document.querySelectorAll('.q-tab,.q-tab__label')].find(e=>/^history/i.test(e.innerText.trim()));if(t){t.click();return true;}return false;});
    c.historyTabVisible=histTab; if(histTab){await page.waitForTimeout(2500);await page.screenshot({path:`${SHOTS}/history.png`});}
    // Parts tab
    const partsTab=await page.evaluate(()=>{const t=[...document.querySelectorAll('.q-tab,.q-tab__label')].find(e=>/^parts/i.test(e.innerText.trim()));if(t){t.click();return true;}return false;});
    if(partsTab){await page.waitForTimeout(2500);c.partsControls=await page.evaluate(()=>[...document.querySelectorAll('button,.q-btn,a')].map(e=>(e.getAttribute('aria-label')||e.innerText||'').trim()).filter(x=>x&&x.length<30).slice(0,25));await page.screenshot({path:`${SHOTS}/parts.png`});}
  }
  // invoiced WO -> payment dialog (Send to Terminal + invoicing)
  if(inv){
    await page.goto('https://app.shopview.com/workorders/'+inv.id,{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForTimeout(6000);
    const fin=await page.evaluate(()=>{const t=[...document.querySelectorAll('.q-tab,.q-tab__label')].find(e=>/^finance/i.test(e.innerText.trim()));if(t){t.click();return true;}return false;});
    c.financeReachable=fin; await page.waitForTimeout(3000);
    c.financeControls=await page.evaluate(()=>[...document.querySelectorAll('button,.q-btn,a,.q-item__label')].map(e=>(e.getAttribute('aria-label')||e.innerText||'').trim()).filter(x=>x&&x.length<30).slice(0,25));
    c.newPaymentBtn=await page.evaluate(()=>[...document.querySelectorAll('button,.q-btn')].some(e=>/new payment/i.test((e.innerText||'').trim())&&e.getBoundingClientRect().width>0));
    await page.screenshot({path:`${SHOTS}/invoice_finance.png`,fullPage:true});
    if(c.newPaymentBtn){
      await page.evaluate(()=>{const b=[...document.querySelectorAll('button,.q-btn')].find(e=>/new payment/i.test((e.innerText||'').trim()));if(b)b.click();});
      await page.waitForTimeout(2500);
      c.sendToTerminal=await page.evaluate(()=>{const d=document.querySelector('.q-dialog');if(!d)return false;return [...d.querySelectorAll('button,.q-btn')].some(e=>/send to terminal/i.test((e.innerText||'').trim()));});
      await page.screenshot({path:`${SHOTS}/payment_dialog.png`});
    }
  }
}catch(e){out.ERROR=String(e).slice(0,140);}
await browser.close();
fs.writeFileSync(`${SHOTS}/observation-full.json`,JSON.stringify(out,null,2));
// concise console
console.log(JSON.stringify({role:roleLabel,perms:out.perms,rendered:out.rendered,portal:c.sendToPortal,newLine:c.newLine,reviewed:c.reviewed,complete:c.complete,rate:c.rateMargin,tabs:(c.tabs||[]).length,topMenu:c.topMenuItems,lineMenu:c.lineMenuItems,newPay:c.newPaymentBtn,ST:c.sendToTerminal}));
