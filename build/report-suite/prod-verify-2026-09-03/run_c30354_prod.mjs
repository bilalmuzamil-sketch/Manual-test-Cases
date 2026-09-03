// Run the C30354 instrument on PRODUCTION using the QA lead's supplied cookies.
//
// 🛑 COMPLIANCE (QA lead rule 1, 2026-09-03): NO pasted localStorage blob, and role/permissions must
// come from the SERVER, not a paste. Here they do: the cookies are a session credential he supplied;
// localStorage.user and fe_permissions_wrapper are written from LIVE 200 responses of
// /api/iam/view-profile and /api/auth/me/fe-permissions fetched IN-PAGE under those cookies - the exact
// values the SPA itself writes after login. The login FORM rejects the password under automation
// (bot detection; it works in his real browser), so the already-minted cookie session is the way in.
// No token is forged - if the SPA needs one it uses the cookie.
//
// PRODUCTION: reads and per-user VIEW state only. No business data created/edited/deleted.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
import { run } from '/home/user/Manual-test-Cases/build/report-suite/prod-verify-2026-09-03/pv_remembered_view.mjs';

const APP='https://app.shopview.com', APIH='api.shopview.com';
const ck=JSON.parse(fs.readFileSync('/tmp/shopview/prod-cookies.json','utf8'));
const port=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();

// a boot() with the run()-expected shape, that hydrates from live server reads
const boot = async (route, opts={}) => {
  const browser = await chromium.launch({ args:['--no-sandbox'], executablePath:'/opt/pw-browsers/chromium',
    proxy:{ server:`http://127.0.0.1:${port}` } });
  const ctx = await browser.newContext({ ignoreHTTPSErrors:true, viewport:{width:1680,height:1050} });
  await ctx.addCookies(Object.entries(ck).flatMap(([name,value])=>
    ['app.shopview.com','api.shopview.com'].map(domain=>({name,value,domain,path:'/',secure:true,sameSite:'Lax'}))));
  // LIVE server reads under the cookie session (page.request shares the jar + bridge)
  const probe = await ctx.newPage();
  const get = async p => { const r=await probe.request.get(`https://${APIH}${p}`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true});
    return r.status()===200 ? await r.json() : null; };
  const feResp = await get('/api/auth/me/fe-permissions');
  const profResp = await get('/api/iam/view-profile/');
  await probe.close();
  if (!feResp) { await browser.close(); throw new Error('cookies do not authenticate /api/auth/me/fe-permissions - session dead, ask for fresh cookies'); }
  const fep = feResp.data, user = profResp?.data?.user || {};
  await ctx.addInitScript(([user,fep])=>{ try {
    localStorage.setItem('user', JSON.stringify({ data: user }));       // server-sourced
    localStorage.setItem('fe_permissions_wrapper', JSON.stringify(fep)); // server-sourced
  } catch(e){} }, [user, fep]);
  const page = await ctx.newPage(); page.setDefaultTimeout(opts.timeout||90000);
  await page.goto(`${APP}${route}`, { waitUntil:'domcontentloaded' });
  await page.waitForTimeout(opts.settle || 14000);
  const version = await page.evaluate(()=>document.querySelector('meta[name=app-version]')?.content||null);
  console.log(new Date().toISOString().slice(11,19), `prod ${page.url()} | v=${version} | perms=${(fep?.fe_permissions||[]).length}`);
  return { browser, page, ctx, APP, APIH, version };
};

const OUT='build/report-suite/prod-verify-2026-09-03';
const r = await run({ boot, OUT });
console.log('\n=== C30354 Expected #2 ===');
console.log('VERDICT:', r.verdict, '-', r.why);
console.log('fetches on return:', r.onReturn?.length, '| first carries saved filters:', JSON.stringify(r.carries));
