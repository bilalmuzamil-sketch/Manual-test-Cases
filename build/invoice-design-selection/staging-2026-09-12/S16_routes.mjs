import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const APP='https://app.staging.shopview.com', APIH='api.staging.shopview.com';
const PORTAL='https://staging.portal.shopview.com';
const port=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const L=(...a)=>console.log(...a);
const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args:[`--proxy-server=http://127.0.0.1:${port}`,'--ignore-certificate-errors','--no-sandbox']});

// ROUTE 3 -- does the PORTAL still hold its own session from the earlier run?
{ const ctx=await browser.newContext({ignoreHTTPSErrors:true});
  try{ const st=JSON.parse(fs.readFileSync('/tmp/qa-cookies/portal-state.json','utf8'));
    if(st.cookies) await ctx.addCookies(st.cookies.filter(c=>/shopview\.com$/.test(c.domain.replace(/^\./,''))));
  }catch(e){ L('portal-state: none'); }
  const p=await ctx.newPage();
  await p.goto(`${PORTAL}/invoices`,{waitUntil:'domcontentloaded',timeout:60000}).catch(e=>L('portal nav',String(e).slice(0,70)));
  await p.waitForTimeout(6000);
  L('ROUTE3 portal url:', p.url().slice(0,110));
  L('ROUTE3 portal text:', (await p.evaluate(()=>(document.body.innerText||'').replace(/\s+/g,' ').slice(0,160))));
  await ctx.close(); }

// ROUTE 5 -- the DEV MODE quick-login panel on the staging login page
{ const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1500,height:1000}});
  const p=await ctx.newPage();
  await p.goto(`${APP}/login`,{waitUntil:'domcontentloaded',timeout:60000}).catch(e=>L('login nav',String(e).slice(0,70)));
  await p.waitForTimeout(8000);
  L('ROUTE5 url:', p.url().slice(0,110));
  const txt=await p.evaluate(()=>(document.body.innerText||'').replace(/\s+/g,' ').slice(0,400));
  L('ROUTE5 login page text:', txt);
  const btns=await p.evaluate(()=>[...document.querySelectorAll('button,a,input[type=submit]')]
    .filter(e=>{const r=e.getBoundingClientRect(); return r.width>0&&r.height>0;})
    .map(e=>((e.textContent||e.value||'').replace(/\s+/g,' ').trim()||e.getAttribute('aria-label')||e.tagName).slice(0,40)));
  L('ROUTE5 buttons:', JSON.stringify(btns));
  await p.screenshot({path:'/tmp/claude-0/S16-login.png', fullPage:true});
  await ctx.close(); }
await browser.close(); process.exit(0);
