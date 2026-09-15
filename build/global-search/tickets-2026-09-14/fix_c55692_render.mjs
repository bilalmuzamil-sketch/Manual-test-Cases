// C55692 was created through the API, and an API write lands the field in TestRail's ESCAPING
// container: the tester would read a literal <strong> and <br> instead of bold text and line breaks.
// Its neighbours carry the same markup and render correctly only because they were saved from the UI.
// Only a UI save flips the container to `markdown fr-view`.
//
// ADAPTED, NOT REINVENTED (Rule 27) from render-repair-2026-08-31/test_sethtml.mjs: set the exact
// HTML through the Froala element, sync the backing input, save, then PROVE it by reading the served
// page - the container must be `markdown fr-view` and the rendered text must carry no literal tags.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg;
import fs from 'fs';
const CID = process.env.CID || '55692';
const C = JSON.parse(fs.readFileSync('/tmp/testrail/creds.json','utf8'));
const UI = JSON.parse(fs.readFileSync('/tmp/testrail/creds-ui.json','utf8'));
const HOST='https://shopview.testrail.io', API=`${HOST}/index.php?/api/v2`;
const AUTH='Basic '+Buffer.from(`${C.email}:${C.password}`).toString('base64');
const port=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const api=async p=>{const r=await fetch(`${API}/${p}`,{headers:{Authorization:AUTH,'Content-Type':'application/json'}});
  return [r.status, await r.json().catch(()=>null)];};

const [st, live] = await api(`get_case/${CID}`);
if (st!==200) { L('could not read the case:', st); process.exit(2); }
const WANT = {custom_preconds: live.custom_preconds, custom_steps: live.custom_steps, custom_expected: live.custom_expected};
L(`C${CID} :: ${live.title}`);

const browser = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium',
  proxy:{server:`http://127.0.0.1:${port}`},
  args:['--ignore-certificate-errors','--disable-background-networking','--no-first-run','--no-default-browser-check'] });
const ctx = await browser.newContext({ ignoreHTTPSErrors:true });
const page = await ctx.newPage(); page.setDefaultTimeout(60000);
await page.goto(`${HOST}/index.php?/auth/login/`,{waitUntil:'domcontentloaded'});
await page.fill('#name',UI.email); await page.fill('#password',UI.password);
await page.click('#button_primary'); await page.waitForLoadState('networkidle');
if(/auth\/login/.test(page.url())){ L('login failed'); await browser.close(); process.exit(2); }

await page.goto(`${HOST}/index.php?/cases/edit/${CID}`,{waitUntil:'networkidle'});
for (const [f,html] of Object.entries(WANT)) {
  const r = await page.evaluate(({f,html})=>{
    const disp=document.querySelector(`#${f}_display`); if(!disp) return {error:'no editor for '+f};
    const fe=disp.querySelector('.fr-element'); if(!fe) return {error:'no fr-element for '+f};
    fe.focus(); fe.innerHTML=html;
    const backing=document.querySelector(`#${f}`); if(backing) backing.value=html;
    fe.dispatchEvent(new Event('input',{bubbles:true}));
    fe.dispatchEvent(new Event('blur',{bubbles:true}));
    if(backing) backing.dispatchEvent(new Event('change',{bubbles:true}));
    return {len:fe.innerHTML.length};},{f,html});
  L(' set', f, '->', JSON.stringify(r));
}
await page.waitForTimeout(800);
if (await page.locator('#accept').isDisabled()) L('save is disabled - the stored content already matches');
else { await page.click('#accept'); await page.waitForLoadState('networkidle').catch(()=>{});
  for(let w=0; w<60 && /cases\/edit/.test(page.url()); w++) await page.waitForTimeout(500); }
L('after saving, the page is', page.url());

// PROVE it, on the page a tester actually reads
await page.goto(`${HOST}/index.php?/cases/view/${CID}`,{waitUntil:'networkidle'});
const seen = await page.evaluate(()=>{
  const ds=[...document.querySelectorAll('div[class^="markdown"]')].filter(d=>!d.id);
  return ds.slice(0,3).map(d=>({cls:d.className.trim(), text:(d.innerText||'').slice(0,160)}));});
const LITERAL=/<\s*\/?\s*(p|br|strong|em|ul|ol|li|div|span)\b[^>]*>/i;
let allGood=true;
for (const s of seen) {
  const frView=/fr-view/.test(s.cls), literal=LITERAL.test(s.text);
  if(!frView||literal) allGood=false;
  L(` container "${s.cls}" | renders as written: ${frView && !literal}`);
  L(`   ${s.text.replace(/\n/g,' ').slice(0,130)}`);
}
// and the marker must still be the last thing in Expected
const [st2, after] = await api(`get_case/${CID}`);
const markerLast = /AUTOMATION: READY[^<]*<\/p>\s*(<p>(<br>|&nbsp;|\s)*<\/p>\s*)?$/i.test(after.custom_expected||'');
L('the automation marker is still last in Expected:', markerLast);
L(allGood ? 'RENDER OK - a tester reads this as written' : 'RENDER STILL WRONG - do not leave it like this');
fs.writeFileSync(`/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14/C${CID}-RENDER.json`,
  JSON.stringify({at:new Date().toISOString(), containers:seen, allGood, markerLast},null,1));
await browser.close();
process.exit(allGood?0:3);
