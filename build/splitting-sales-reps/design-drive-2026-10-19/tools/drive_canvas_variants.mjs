// Canvas driver for the Splitting Sales Representatives design (adapted from drive_design_canvas.py; node Playwright).
import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
import fs from 'fs';
const D='/home/user/Manual-test-Cases/build/splitting-sales-reps/design-drive-2026-10-19';
const S=D+'/screens', O=D+'/canvas-drive'; fs.mkdirSync(O,{recursive:true});
const canvas=JSON.parse(fs.readFileSync(D+'/unpacked/files/canvas.json'));
const log=fs.createWriteStream(O+'/canvas-drive.jsonl',{flags:'a'});
const rec=(o)=>{log.write(JSON.stringify({t:new Date().toISOString(),...o})+'\n');};
const pageNo={}; canvas.pages.forEach((pg,i)=>pageNo[pg.id]=i+1);
const slug=(s)=>s.toLowerCase().replace(/\+/g,'plus').replace(/→/g,'to').replace(/[^a-z0-9.]+/g,'-').replace(/^-|-$/g,'').slice(0,60);
export const shotName=(a)=>{const m=a.title.match(/^(\d+)\.(\d+)\s+(.*)$/);return `p${m[1]}-${m[1]}.${m[2].padStart(2,'0')}-${slug(m[3])}`;};
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
async function open(ctxOpts={}, media=null){
  const ctx=await b.newContext({viewport:{width:1440,height:900},acceptDownloads:true,...ctxOpts});
  const p=await ctx.newPage(); if(media) await p.emulateMedia(media);
  const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+D+'/unpacked/artifact-page.html'); await p.waitForTimeout(5000);
  return {ctx,p,errs};
}
async function gotoPage(p,i){ // via the design's own "6 pages" menu
  await p.locator('[data-testid=dc-pages]').click(); await p.waitForTimeout(500);
  const btn=p.locator('button').filter({hasText: canvas.pages[i].name}).first();
  await btn.click(); await p.waitForTimeout(2500);
}
const visibleTitles=async(p)=>p.evaluate(()=>[...document.querySelectorAll('[data-testid^=mega-artboard-title-]')].map(e=>e.innerText.trim()));
const notes=async(p)=>p.evaluate(()=>[...document.querySelectorAll('[data-testid^=mega-annotation-]')].map(e=>({id:e.getAttribute('data-testid'),text:e.innerText})));
// zoom 100% on page 1
let {ctx,p,errs}=await open();
await gotoPage(p,0); await p.locator('[data-testid=dc-zoom]').click(); await p.waitForTimeout(300);
await p.locator('button').filter({hasText:/^100%$/}).first().click().catch(()=>{}); await p.waitForTimeout(1200);
await p.screenshot({path:S+'/canvas-p1-zoom-100.png'}); rec({step:'zoom-100'});
await ctx.close();
// ---------- 2. dark colour scheme
({ctx,p,errs}=await open({}, {colorScheme:'dark'}));
await gotoPage(p,0); await p.screenshot({path:S+'/canvas-dark-p1-overview.png'});
await p.locator('[data-testid="mega-artboard-expand-card-12-n1-two.dc.html"]').evaluate(e=>e.click()); await p.waitForTimeout(2000);
await p.screenshot({path:S+'/canvas-dark-play-1.12.png'});
rec({step:'dark',bodyBg:await p.evaluate(()=>getComputedStyle(document.body).backgroundColor),note:'design boards are images; dark scheme changes only the canvas chrome'});
await ctx.close();
// ---------- 3. phone width (touch)
({ctx,p,errs}=await open({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2}));
await p.screenshot({path:S+'/canvas-phone-390-initial.png'});
await gotoPage(p,5); await p.screenshot({path:S+'/canvas-phone-390-p6-overview.png'});
await p.locator('[data-testid="mega-artboard-expand-phone-06-n6-added.dc.html"]').evaluate(e=>e.click()); await p.waitForTimeout(2000);
await p.screenshot({path:S+'/canvas-phone-390-play-6.6.png'}); rec({step:'phone-play-6.6'});
await ctx.close();
// ---------- 4. 1536 width, played board 1.10 and 4.10
({ctx,p,errs}=await open({viewport:{width:1536,height:960}}));
for(const [pi,f] of [[0,'card-10-n1-added-hover.dc.html'],[3,'sbr-10-a4-sbr-expanded-type.dc.html']]){
  await gotoPage(p,pi); await p.locator(`[data-testid="mega-artboard-expand-${f}"]`).evaluate(e=>e.click()); await p.waitForTimeout(2000);
  await p.screenshot({path:`${S}/canvas-1536-play-${f.replace('.dc.html','')}.png`}); await p.locator('button').filter({hasText:'Back to canvas'}).first().click().catch(()=>{}); await p.waitForTimeout(800);
}
await ctx.close();

await b.close(); log.end(); console.log('done2');
