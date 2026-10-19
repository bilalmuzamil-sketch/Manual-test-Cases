// Canvas driver for the Splitting Sales Representatives design (adapted from drive_design_canvas.py; node Playwright).
import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
import fs from 'fs';
const D='/home/user/Manual-test-Cases/build/splitting-sales-reps/design-drive-2026-10-19';
const S=D+'/screens', O=D+'/canvas-drive'; fs.mkdirSync(O,{recursive:true});
const canvas=JSON.parse(fs.readFileSync(D+'/unpacked/files/canvas.json'));
const log=fs.createWriteStream(O+'/canvas-drive.jsonl');
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
// ---------- 1. desktop light pass
let {ctx,p,errs}=await open();
await p.screenshot({path:S+'/canvas-initial-1440.png'}); rec({step:'load',errs});
await p.locator('[data-testid=dc-pages]').click(); await p.waitForTimeout(600);
await p.screenshot({path:S+'/canvas-pages-menu-open.png'});
const menu=await p.evaluate(()=>[...document.querySelectorAll('button')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.y>40&&r.y<500&&r.x<600}).map(e=>e.innerText.trim().replace(/\n/g,' | ')));
rec({step:'pages-menu',items:menu}); await p.keyboard.press('Escape'); await p.waitForTimeout(300);
await p.locator('[data-testid=dc-zoom]').click(); await p.waitForTimeout(500);
await p.screenshot({path:S+'/canvas-zoom-menu-open.png'});
const zoom=await p.evaluate(()=>[...document.querySelectorAll('button,[role=menuitem],[role=menuitemradio]')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.y>40&&r.y<500&&r.x<500}).map(e=>e.innerText.trim()));
rec({step:'zoom-menu',items:zoom}); await p.keyboard.press('Escape');
// hover the Read-only status
await p.locator('.tb-status-text').hover(); await p.waitForTimeout(400);
rec({step:'hover-read-only',title:await p.evaluate(()=>[...document.querySelectorAll('[title]')].find(e=>e.innerText.includes('Read-only'))?.title)});
const summary={pages:[]};
for(let i=0;i<canvas.pages.length;i++){
  const pg=canvas.pages[i]; await gotoPage(p,i);
  // Fit artboards via zoom menu
  await p.locator('[data-testid=dc-zoom]').click(); await p.waitForTimeout(300);
  await p.locator('button').filter({hasText:'Fit artboards'}).first().click().catch(()=>{}); await p.waitForTimeout(1200);
  await p.screenshot({path:`${S}/canvas-p${i+1}-overview-fit.png`});
  const titles=await visibleTitles(p), ns=await notes(p);
  const expected=canvas.artboards.filter(a=>a.page===pg.id);
  const pageRec={page:i+1,name:pg.name,titlesInDom:titles.length,expected:expected.length,notesInDom:ns.length,missing:expected.filter(a=>!titles.includes(a.title)).map(a=>a.title)};
  rec({step:'page',...pageRec}); summary.pages.push(pageRec);
  // hover every title and note: record tooltip (title attr) and hover change
  for(const a of expected){
    const t=p.locator(`[data-testid="mega-artboard-title-${a.file}"]`);
    const tip=await t.evaluate(e=>{let x=e;while(x&&!x.title)x=x.parentElement;return x?x.title:null}).catch(()=>null);
    rec({step:'title',board:a.file,title:a.title,tooltip:tip});
  }
  // Export menu of the first artboard on this page
  const ex=p.locator(`[data-testid="mega-artboard-download-${expected[0].file}"]`);
  const exBtn = (await ex.count())? ex : p.locator('button[aria-label="Export artboard"]').first();
  await exBtn.evaluate(e=>e.click()); await p.waitForTimeout(800);
  const exItems=await p.evaluate(()=>[...document.querySelectorAll('[role=menu] button,[role=menuitem],[role=dialog] button')].filter(e=>e.getBoundingClientRect().width>0).map(e=>e.innerText.trim().replace(/\n/g,' — ')));
  rec({step:'export-menu',page:i+1,board:expected[0].file,items:exItems});
  if(i===0) await p.screenshot({path:`${S}/canvas-p1-export-menu-open.png`});
  await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  // Play every artboard
  for(const a of expected){
    const play=p.locator(`[data-testid="mega-artboard-expand-${a.file}"]`);
    await play.evaluate(e=>e.click()); await p.waitForTimeout(2200);
    const name=shotName(a);
    await p.screenshot({path:`${S}/${name}.png`});
    // inside the played view: frames, clickables, hover the image centre
    const fr=p.frames().filter(f=>f.url().includes(a.file)||f.name().includes(a.file));
    let inner=null;
    for(const f of p.frames()){ try{ const r=await f.evaluate(()=>({title:document.title,imgs:[...document.images].map(i=>({alt:i.alt,w:i.naturalWidth,h:i.naturalHeight})),clickables:document.querySelectorAll('a,button,input,select,[onclick],[role=button],[title]').length,text:document.body?document.body.innerText.trim().slice(0,200):''})); if(r.title===a.title||r.imgs.some(i=>i.alt===a.title)) inner=r; }catch(e){} }
    await p.mouse.move(720,450); await p.waitForTimeout(500);
    const hoverTip=await p.evaluate(()=>{const e=document.elementFromPoint(720,450);let x=e;while(x&&!x.title)x=x.parentElement;return x?x.title:null});
    const chrome=await p.evaluate(()=>[...document.querySelectorAll('button')].filter(e=>e.getBoundingClientRect().width>0&&e.getBoundingClientRect().y<48).map(e=>e.innerText.trim()||e.getAttribute('aria-label')));
    rec({step:'play',board:a.file,title:a.title,shot:name+'.png',inner,hoverTip,chrome});
    await p.locator('button').filter({hasText:'Back to canvas'}).first().click().catch(async()=>{await p.keyboard.press('Escape')}); await p.waitForTimeout(900);
  }
}
// one real export (PNG 1x) of board 1.12 to prove the export works
{
  await gotoPage(p,0);
  await p.locator('[data-testid="mega-artboard-download-card-12-n1-two.dc.html"]').evaluate(e=>e.click()); await p.waitForTimeout(700);
  const dl=p.waitForEvent('download',{timeout:15000}).catch(()=>null);
  await p.locator('button').filter({hasText:'PNG 1×'}).first().click().catch(()=>{});
  const d=await dl; let info=null;
  if(d){ const tmp=O+'/export-probe.png'; await d.saveAs(tmp); info={name:d.suggestedFilename(),bytes:fs.statSync(tmp).size}; fs.unlinkSync(tmp);} 
  rec({step:'export-download',board:'card-12-n1-two.dc.html',info});
  await p.keyboard.press('Escape');
}
// zoom 100% on page 1
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
fs.writeFileSync(O+'/canvas-drive-summary.json',JSON.stringify(summary,null,1));
await b.close(); log.end(); console.log('done', JSON.stringify(summary));
