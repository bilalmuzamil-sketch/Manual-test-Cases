import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const OUT='/home/user/Manual-test-Cases/build/inline-add-edit-parts/build-verify-2026-09-09-full';
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const { browser, page } = await boot('sv9315','/workorders/6a529a5f-dff9-4c13-9636-b41500e585f0/lines','admin');
await page.waitForTimeout(8000);
// find an existing part row and hover to reveal the edit control
const editInfo=await page.evaluate(L=>{const lab=eval(L);
  const rows=[...document.querySelectorAll('tr')].filter(r=>/\([A-Za-z0-9]/.test(lab(r)));
  let editLabels=[];
  for(const r of rows.slice(0,4)){const e=[...r.querySelectorAll('button,.q-btn,[class*=edit],i')].find(x=>/^edit$|edit_note|edit /i.test((x.textContent||'')+(x.className||'')));if(e)editLabels.push((e.textContent||e.getAttribute('aria-label')||e.className).slice(0,20));}
  return {rowsWithParts:rows.length, editControls:[...new Set(editLabels)]};}, lab);
console.log('EDIT CONTROLS on part rows:', JSON.stringify(editInfo));
// open Add Part row, fill minimal, and look for the More-options-menu vs modal AND Split across bins presence
await page.evaluate(L=>{const lab=eval(L);const b=[...document.querySelectorAll('button,.q-btn,a')].find(e=>/add part/i.test(lab(e))&&lab(e).length<24);if(b)b.click();}, lab);
await page.waitForTimeout(2500);
const splitPresent=await page.evaluate(()=>/Split across bins/i.test(document.body.innerText));
console.log('Split across bins present on add row?', splitPresent);
// the inline row controls again to see 'More options' and any menu with Split
const rowControls=await page.evaluate(L=>{const lab=eval(L);return [...new Set([...document.querySelectorAll('button,.q-btn,.q-item')].map(lab).filter(t=>/more options|split|save|discard/i.test(t)&&t.length<30))];}, lab);
console.log('ADD-ROW extra controls:', JSON.stringify(rowControls));
await page.screenshot({path:OUT+'/edit-split-v2636.png',fullPage:true}).catch(()=>{});
await browser.close();
