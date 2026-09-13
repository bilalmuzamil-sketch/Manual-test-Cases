import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args:['--no-sandbox','--disable-dev-shm-usage','--force-device-scale-factor=1']});
const ctx = await b.newContext({viewport:{width:1280,height:1400}, deviceScaleFactor:1});
const p = await ctx.newPage();
await p.goto('file:///tmp/qa.html',{waitUntil:'load',timeout:60000});
await p.waitForTimeout(1500);
const m = await p.evaluate(()=>{
  const px = e => e? getComputedStyle(e).fontSize : null;
  const first = s => document.querySelector(s);
  const byText = t => [...document.querySelectorAll('td,th,div,span,p,h1,h2,h3,h4,h5')]
      .find(e=>e.children.length===0 && (e.textContent||'').trim()===t);
  return {
    rootFontSize: getComputedStyle(document.documentElement).fontSize,
    bodyFontSize: getComputedStyle(document.body).fontSize,
    zoom: window.devicePixelRatio,
    'info-title-new (Bill To)': px(first('.info-title-new')),
    'info-text-new (address)': px(first('.info-text-new')),
    'custom-table (Service Order / Unit / column heads)': px(first('.custom-table')),
    'totals-new': px(first('.totals-new')),
    'disclaimer-font': px(first('.disclaimer-font')),
    'work-summary-table-new': px(first('.work-summary-table-new')),
    'literal "Service Order" cell': px(byText('Service Order')),
    'literal "Description" cell': px(byText('Description')),
  };
});
console.log(JSON.stringify(m,null,1));
await b.close();
