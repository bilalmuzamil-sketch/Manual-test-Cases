// Wake a sleeping QA branch and WAIT until it can actually sign in.
// QA branches pause to save resources. The app host then redirects to
// https://sleep.qa.shopview.com/?app=<branch>&api=<branch> — "Environment Sleeping … Click below to
// wake it up — it usually takes around 1 minute." with a single "Wake Up" button.
// qa-branch-boot has sleep handling, but it gives up while the branch is still starting and then
// stops with "no DEV MODE Admin button", which reads as a dead branch and is not one.
// Usage: node build/testing-tools/wake_branch.mjs <branch> [maxMinutes]
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import fs from 'fs';
const { chromium } = pw;
const branch = process.argv[2] || 'sv9315';
const maxMin = Number(process.argv[3] || 6);
const PORT = fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);

const b = await chromium.launch({
  executablePath: process.env.CHROME_BIN || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  headless:true, proxy:{server:`http://127.0.0.1:${PORT}`},
  args:['--no-sandbox','--ignore-certificate-errors']});
const c = await b.newContext({ignoreHTTPSErrors:true});
const p = await c.newPage();
const url = `https://${branch}.qa.shopview.com/login?redirect=/workorders`;
const deadline = Date.now() + maxMin*60000;
let woke = false;

while (Date.now() < deadline){
  await p.goto(url,{waitUntil:'domcontentloaded',timeout:60000}).catch(()=>{});
  await p.waitForTimeout(6000);
  const asleep = /sleep\.qa\.shopview\.com/.test(p.url())
    || (await p.locator('button:has-text("Wake Up")').count()) > 0;
  if (asleep){
    log('%s is asleep — clicking Wake Up', branch);
    await p.locator('button:has-text("Wake Up")').first().click({timeout:20000}).catch(()=>{});
    await p.waitForTimeout(30000);
    continue;
  }
  // awake enough to serve the login page — but the DEV MODE panel is filled by an API call
  const hasBtn = await p.locator('button:has-text("Admin")').count();
  log('login page reached (%s) — DEV MODE Admin button present: %s', p.url(), hasBtn>0);
  if (hasBtn>0){ woke = true; break; }
  await p.waitForTimeout(10000);
}
await p.screenshot({path:'/tmp/wake-result.png', fullPage:true}).catch(()=>{});
log(woke ? `${branch} is AWAKE and can sign in` : `${branch} did NOT come up within ${maxMin} minutes`);
await b.close();
process.exit(woke ? 0 : 1);
