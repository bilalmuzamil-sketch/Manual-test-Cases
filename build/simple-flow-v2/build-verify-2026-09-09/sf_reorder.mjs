import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const OUT='/home/user/Manual-test-Cases/build/simple-flow-v2/build-verify-2026-09-09';
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const { browser, page } = await boot('sv8683','/workorders/9f5ba3d1-5f77-4c07-b553-99a6db957b61/lines','admin');
await page.waitForTimeout(9000);
// find drag handles on part rows (6-dots = drag_indicator icon or a handle element)
const handles=await page.evaluate(()=>{
  const cands=[...document.querySelectorAll('i,[class*=drag],[class*=handle],[draggable=true],.q-icon')].filter(e=>/drag_indicator|drag_handle|apps|reorder/i.test(e.textContent||e.className||''));
  return {count:cands.length, sample:cands.slice(0,6).map(e=>({t:(e.textContent||'').trim().slice(0,20),c:e.className.slice(0,40)}))};
});
console.log('DRAG HANDLE CANDIDATES:', JSON.stringify(handles));
// part row order before
const before=await page.evaluate(L=>{const lab=eval(L);return [...document.querySelectorAll('table tbody tr')].map(lab).filter(t=>/\(/.test(t)).slice(0,8);}, lab);
console.log('PARTS BEFORE:', JSON.stringify(before.map(t=>t.slice(0,25))));
await page.screenshot({path:OUT+'/reorder-before-sv8683.png',fullPage:true}).catch(()=>{});
// try a drag: grab the first drag_indicator handle and move it down ~120px
try{
  const h=page.locator('i:has-text("drag_indicator"), .q-icon:has-text("drag_indicator"), [class*=drag]').first();
  const box=await h.boundingBox();
  if(box){
    await page.mouse.move(box.x+box.width/2, box.y+box.height/2);
    await page.mouse.down();
    await page.mouse.move(box.x+box.width/2, box.y+130, {steps:12});
    await page.mouse.move(box.x+box.width/2, box.y+150, {steps:6});
    await page.mouse.up();
    console.log('DRAG performed from', JSON.stringify(box));
  } else console.log('no handle boundingBox');
}catch(e){console.log('drag error', e.message);}
await page.waitForTimeout(2500);
// look for an Undo toast / snackbar
const undo=await page.evaluate(L=>{const lab=eval(L);const toasts=[...document.querySelectorAll('.q-notification,.q-notification__message,[class*=snackbar],[class*=toast],.q-banner')].map(lab).filter(Boolean);const hasUndo=[...document.querySelectorAll('button,.q-btn,a')].some(e=>/^undo$/i.test((e.textContent||'').trim()));const bodyUndo=/\bundo\b/i.test(document.body.innerText);return {toasts:toasts.slice(0,6), undoButton:hasUndo, bodyMentionsUndo:bodyUndo};}, lab);
console.log('UNDO CHECK:', JSON.stringify(undo));
await page.screenshot({path:OUT+'/reorder-after-sv8683.png',fullPage:true}).catch(()=>{});
const after=await page.evaluate(L=>{const lab=eval(L);return [...document.querySelectorAll('table tbody tr')].map(lab).filter(t=>/\(/.test(t)).slice(0,8);}, lab);
console.log('PARTS AFTER:', JSON.stringify(after.map(t=>t.slice(0,25))));
await browser.close();
