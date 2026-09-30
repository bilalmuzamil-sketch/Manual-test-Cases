// staging-cookie-boot.mjs — authenticate app.staging.shopview.com from the QA lead's live
// session COOKIES (no password), and return a hydrated, RETINA page for crisp screenshots.
//
// WHY: staging has no committed password; the QA lead shares live cookies (sv_sso_session +
// PHPSESSID + cf_clearance). Cookies alone bounce to /login — the SPA reads auth from localStorage —
// but the API authenticates with the cookies. So: set the 3 cookies, fetch fe-permissions +
// my-workplaces with them, hydrate localStorage.user (token:'' is fine — /api/search uses the
// cookie session), then the SPA renders and the global-search modal works.
//
// CRISP IMAGES: deviceScaleFactor:2 (retina). A full-page 1600x1100 screenshot comes out 3200x2200,
// so a cropped modal is razor-sharp in a Jira ticket. Never upscale a low-res source instead.
//
// SECRETS: /tmp/staging/staging-cookies.txt (chmod 600, outside the repo), one `name=value` per line:
//   sv_sso_session=...   PHPSESSID=...   cf_clearance=...
// Never printed, never committed (Rule 82). Bridge must be up (ensure_bridge.sh); Chromium via it.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const APP='app.staging.shopview.com', API='api.staging.shopview.com';
const ENVF=process.env.STG_COOKIES || '/tmp/staging/staging-cookies.txt';

export async function stagingBoot(route='/', {dsf=2, viewport={width:1600,height:1100}}={}) {
  const PORT=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
  const raw=fs.readFileSync(ENVF,'utf8').trim();
  const cookies=[];
  for(const line of raw.split('\n')){ const i=line.indexOf('='); if(i<0)continue;
    const name=line.slice(0,i).trim(), value=line.slice(i+1).trim();
    for(const d of [APP,API]) cookies.push({name,value,domain:d,path:'/',secure:true,sameSite:'None'}); }
  const browser=await chromium.launch({ executablePath:process.env.CHROME_BIN||'/opt/pw-browsers/chromium',
    headless:true, proxy:{server:`http://127.0.0.1:${PORT}`}, args:['--no-sandbox','--ignore-certificate-errors'] });
  const ctx=await browser.newContext({ viewport, deviceScaleFactor:dsf, ignoreHTTPSErrors:true });
  await ctx.addCookies(cookies);
  const fep=await (await ctx.request.get(`https://${API}/api/auth/me/fe-permissions`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true})).json();
  const feData=fep.data; const fe=feData?.fe_permissions||[];
  const wp=await (await ctx.request.get(`https://${API}/api/staff/my-workplaces`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true})).json();
  const loc=(wp.data&&wp.data.collection&&wp.data.collection[0])||null;
  await ctx.addInitScript(([feData,fe,loc])=>{ try{
    localStorage.setItem('user', JSON.stringify({data:{token:'', role:{name:'Administrator',fePermissions:fe}, details:{default_workplace:loc?loc.id:null}}}));
    localStorage.setItem('fe_permissions_wrapper', JSON.stringify(feData));
    localStorage.setItem('mode','admin');
    if(loc){ localStorage.setItem('current_shop_id',loc.id); localStorage.setItem('location',JSON.stringify(loc)); }
  }catch(e){} },[feData,fe,loc]);
  const page=await ctx.newPage(); page.setDefaultTimeout(60000);
  await page.goto(`https://${APP}${route}`,{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(10000);
  const onLogin=await page.evaluate(()=>/\/login/.test(location.href));
  if(onLogin) console.log('⚠ staging still on /login — cookies may be expired; ask the QA lead for fresh ones');
  return { browser, page, ctx, APP, API, loc };
}

// Open the global-search modal, type a query, click a scope tab. Returns after settle.
export async function openGlobalSearch(page, query, tab) {
  await page.locator('[data-test-id=select_global_search]').click().catch(async()=>{ await page.keyboard.press('Control+k'); });
  await page.waitForTimeout(1200);
  await page.keyboard.type(query,{delay:70});
  await page.waitForTimeout(3500);
  if(tab){ for(const loc of [ page.getByRole('tab',{name:new RegExp(tab)}), page.locator(`[role=tab]:has-text("${tab}")`), page.getByText(new RegExp(`${tab} \\(\\d+\\)`)) ]){
    try{ if(await loc.first().count()){ await loc.first().click({force:true,timeout:5000}); break; } }catch(e){} }
    await page.waitForTimeout(2500); }
}
