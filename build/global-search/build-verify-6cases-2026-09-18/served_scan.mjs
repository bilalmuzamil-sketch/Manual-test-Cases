// Served-page container scan for C55718-C55723 (fr-view vs escaping + literal tags).
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg;
import fs from 'fs';
const UI = JSON.parse(fs.readFileSync('/tmp/testrail/creds-ui.json','utf8'));
const HOST='https://shopview.testrail.io';
const port = fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const CIDS = (process.env.CIDS || '55718,55719,55720,55721,55722,55723').split(',');
const LITERAL = /<\s*\/?\s*(p|br|div|span|ul|ol|li|strong|em|b|i|hr)\b[^>]*>/i;
const browser = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome', proxy:{server:`http://127.0.0.1:${port}`}, args:['--ignore-certificate-errors','--no-first-run'] });
const ctx = await browser.newContext({ ignoreHTTPSErrors:true });
const page = await ctx.newPage();
await page.goto(`${HOST}/index.php?/auth/login/`, { waitUntil:'domcontentloaded' });
await page.fill('#name', UI.email); await page.fill('#password', UI.password); await page.click('#button_primary');
await page.waitForLoadState('networkidle');
if (/auth\/login/.test(page.url())) { console.log('LOGIN FAILED'); await browser.close(); process.exit(2); }
console.log('login ok');
const out = {};
for (const cid of CIDS) {
  await page.goto(`${HOST}/index.php?/cases/view/${cid}`, { waitUntil:'networkidle' });
  const r = await page.evaluate(() => {
    const ds=[...document.querySelectorAll('div[class^="markdown"]')].filter(d=>!d.id);
    const o={_count:ds.length};
    ['custom_preconds','custom_steps','custom_expected'].forEach((f,i)=>{ if(ds[i]) o[f]={cls:ds[i].className.trim(), text:ds[i].innerText}; });
    return o;
  });
  const verdict={};
  for (const f of ['custom_preconds','custom_steps','custom_expected']) {
    if(!r[f]){verdict[f]='MISSING';continue;}
    const frview=/fr-view/.test(r[f].cls);
    const literal=LITERAL.test(r[f].text);
    verdict[f]=(frview&&!literal)?'OK-frview':(!frview?`ESCAPING(${r[f].cls})`:'')+(literal?' LITERAL-TAGS':'');
  }
  out[cid]=verdict;
  console.log(`C${cid}`, JSON.stringify(verdict));
}
fs.writeFileSync('build/global-search/build-verify-6cases-2026-09-18/served-scan.json', JSON.stringify(out,null,1));
await browser.close();
