import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const APP='https://app.staging.shopview.com', APIH='api.staging.shopview.com';
const port=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const L=(...a)=>console.log(...a);
const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args:[`--proxy-server=http://127.0.0.1:${port}`,'--ignore-certificate-errors','--no-sandbox']});
const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1600,height:1100}});
const p=await ctx.newPage();
await p.goto(`${APP}/`,{waitUntil:'domcontentloaded',timeout:90000}).catch(e=>L('nav',String(e).slice(0,80)));
await p.waitForTimeout(14000);
L('url:', p.url().slice(0,120));
const txt=await p.evaluate(()=>(document.body.innerText||'').replace(/\s+/g,' ').slice(0,320));
L('text:', txt);
await p.screenshot({path:'/tmp/claude-0/S17-a.png', fullPage:true});
if(/DEV MODE/.test(txt)){
  L('>> DEV MODE panel present -- clicking Admin');
  const ok=await p.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
    const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
    const b=[...document.querySelectorAll('button,.q-btn,[role=button]')].filter(vis).find(e=>/^admin_panel_settings\s*Admin$|^Admin$/.test(t(e)));
    if(b){b.click(); return t(b);} return null;});
  L('clicked:', ok);
  await p.waitForTimeout(15000);
  L('url after:', p.url().slice(0,120));
  L('signedIn:', await p.evaluate(()=>{try{return !!JSON.parse(localStorage.getItem('user')||'null');}catch(e){return false;}}));
  const v=await p.evaluate(async(a)=>{const r=await fetch(`https://${a}/api/organizations/invoice-settings/view`,{credentials:'include',headers:{Accept:'application/json'}}); return {s:r.status,t:(await r.text()).slice(0,160)};},APIH);
  L('invoice-settings:', JSON.stringify(v));
  await p.screenshot({path:'/tmp/claude-0/S17-b.png', fullPage:true});
  const cks=await ctx.cookies(); 
  fs.writeFileSync('/tmp/claude-0/S17-cookies.json', JSON.stringify(cks,null,1));
  L('cookie names:', cks.map(c=>c.name+'@'+c.domain).join(', ').slice(0,300));
} else { L('>> no DEV MODE panel'); }
await browser.close(); process.exit(0);
