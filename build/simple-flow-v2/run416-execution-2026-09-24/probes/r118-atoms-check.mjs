// C44607's last two mappings, checked as somebody who lacks both atoms:
//   the work order settings page should follow Settings > App Settings
//   fixing a part number into the catalogue should follow Catalog & Inventory: Create & Edit
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const TAG=process.env.TAG||'noatoms';
const {browser,ctx,page,APIH}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={tag:TAG};
const pr=await ctx.request.get(`https://${APIH}/api/auth/me/fe-permissions`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true});
try{const j=JSON.parse(await pr.text()); R.perms=j.data?.fe_permissions||j.data||j;}catch{}
R.relevant=(R.perms||[]).filter(x=>/appSettings|settings|catalog/i.test(x));
console.log('as',TAG,'- holds:',JSON.stringify(R.relevant));
// 1. the settings page
await page.goto('https://app.shopview.com/administration/settings',{waitUntil:'domcontentloaded'});
await page.waitForTimeout(11000);
R.settings={url:page.url().replace('https://app.shopview.com',''),
  text:await page.evaluate(()=>{const m=document.querySelector('main,.q-page')||document.body; return (m.innerText||'').replace(/\s+/g,' ').trim().slice(0,220);}),
  hasWorkOrderTab:await page.evaluate(()=>[...document.querySelectorAll('.q-tab,[role=tab]')].some(e=>/^\s*Work Orders\s*$/.test(e.innerText||'')))};
console.log('\nthe settings page:',R.settings.url);
console.log('  it shows:',JSON.stringify(R.settings.text.slice(0,180)));
console.log('  >>> can they reach the work order settings:',R.settings.hasWorkOrderTab);
await page.screenshot({path:`${EV}/r118-${TAG}-settings.png`}).catch(()=>{});
// 2. the catalogue
await page.goto('https://app.shopview.com/parts',{waitUntil:'domcontentloaded'});
await page.waitForTimeout(11000);
R.parts={url:page.url().replace('https://app.shopview.com',''),
  tabs:await page.evaluate(()=>[...document.querySelectorAll('.q-tab,[role=tab]')].filter(e=>e.getBoundingClientRect().width).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim())),
  buttons:await page.evaluate(()=>[...new Set([...document.querySelectorAll('button,.q-btn')].filter(e=>e.getBoundingClientRect().width)
    .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(t=>t&&t.length<30))])};
console.log('\nthe parts area:',R.parts.url);
console.log('  tabs:',JSON.stringify(R.parts.tabs));
console.log('  buttons:',JSON.stringify(R.parts.buttons));
R.canMakeParts=R.parts.buttons.some(b=>/New (Inventory Part|Catalog|Part)/i.test(b));
console.log('  >>> offered a way to create a part:',R.canMakeParts);
await page.screenshot({path:`${EV}/r118-${TAG}-parts.png`}).catch(()=>{});
fs.writeFileSync(`${EV}/r118-${TAG}.json`,JSON.stringify(R,null,1));
await browser.close();
