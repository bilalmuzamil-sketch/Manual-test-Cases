import pkg from '/opt/node22/lib/node_modules/playwright/index.js'; const {chromium}=pkg; import fs from 'fs';
const exe='/opt/pw-browsers/chromium';
const b=await chromium.launch({executablePath:fs.existsSync(exe)?exe:undefined,args:['--no-sandbox']}); const out={};
for(const dpr of [1,2]){ const ctx=await b.newContext({deviceScaleFactor:dpr,viewport:{width:200,height:100}}); const p=await ctx.newPage();
 for(const n of ['hand','hand-back-fist']){ const svg=fs.readFileSync(`/tmp/qa11588/cursor-${n}.svg`,'utf8'); const src='data:image/svg+xml,'+encodeURIComponent(svg);
  await p.setContent(`<html><body style="margin:0;background:transparent"><img id=i src="${src}" width=32 height=32 style="display:block"></body></html>`); await p.waitForTimeout(300);
  const el=await p.$('#i'); await el.screenshot({path:`/tmp/qa11588/cursor-${n}-${dpr}x.png`,omitBackground:true}); }
 await ctx.close(); }
await b.close(); console.log('ok');
