// SV-12003 retest (9ae1530): Edit Line Title, completion wizard tech story box, Tech story gate window — type misspelled text (NO trailing space),
// capture the box while typing, after clicking out, after clicking back in. HEADED=1 xvfb-run -a node gate.mjs <woLines> <line> <woReview>
import {sess} from './common.mjs'; import fs from 'fs';
const [WO,LN,WOR]=process.argv.slice(2); const s=await sess({dir:process.env.QDIR||'/tmp/qa94'}); const p=s.page; const OUT='../ev/branch-r3-gate'+(process.env.SUFFIX||''); fs.mkdirSync(OUT,{recursive:true});
const TEXT=process.env.TEXT??' wrng spellling'; const R={};
const shot=async(loc,n)=>{ try{ const b=loc.locator('xpath=ancestor::*[contains(@class,"q-field")][1]'); await b.screenshot({path:`${OUT}/${n}.png`,timeout:6000}); }catch(e){ R[n+'-shotErr']=e.message.slice(0,80); await p.screenshot({path:`${OUT}/${n}-page.png`}); } };
const three=async(ta,n,clickOut)=>{ R[n]={spell:await ta.evaluate(e=>({prop:e.spellcheck,attr:e.getAttribute('spellcheck'),focusedOnOpen:document.activeElement===e}))};
  await ta.click(); await p.keyboard.press('End'); await p.keyboard.type(TEXT,{delay:60}); await p.waitForTimeout(3000); await shot(ta,n+'-1-typing');
  await clickOut(); await p.waitForTimeout(3000); await shot(ta,n+'-2-clicked-out'); await ta.click(); await p.waitForTimeout(3000); await shot(ta,n+'-3-refocus'); };
const titleOut=async()=>{ const t=await p.locator('.q-dialog [data-test-id="dialog_title"], .q-dialog .q-card__section').first().boundingBox(); await p.mouse.click(t.x+8,t.y+8); };
const ONLY=(process.env.ONLY||'a,b,c').split(',');
// (a) Edit Line > Title
if(ONLY.includes('a')){
await s.go('/workorders/'+WO+'/lines'); await p.waitForTimeout(3500); await p.locator('[data-test-id="line_title"]').first().click(); await p.waitForTimeout(2500);
await three(p.locator('.q-dialog [data-test-id="input_line_name"]').first(),'title',titleOut); await p.keyboard.press('Escape'); await p.waitForTimeout(800); }
// (b) completion wizard tech story box (line Complete)
if(ONLY.includes('b')){
await s.go('/workorders/'+WO+'/lines'); await p.waitForTimeout(3500); await p.click(`[data-test-id="button_action_complete_line_${LN}"]`); await p.waitForTimeout(3500);
const wz=p.locator(`.q-dialog [data-test-id="input_tech_story_${LN}"] textarea, .q-dialog textarea[data-test-id="input_tech_story_${LN}"]`).first(); R.wizardFound=await wz.count();
if(R.wizardFound) await three(wz,'wizard',titleOut); await p.screenshot({path:`${OUT}/wizard-dialog.png`}); await p.keyboard.press('Escape'); await p.waitForTimeout(800); }
// (c) Tech story gate (Mark Reviewed on a ready-for-review WO whose lines have no tech story)
await s.go('/workorders/'+WOR+'/lines'); await p.waitForTimeout(4000);
const mr=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>/review/i.test(e.getAttribute('data-test-id')+' '+e.innerText)&&e.getBoundingClientRect().width>0).map(e=>e.getAttribute('data-test-id')+'|'+e.innerText.replace(/\s+/g,' ').trim().slice(0,30))); R.reviewCtl=mr;
const btn=p.locator('button, [role="button"]').filter({hasText:/Mark (as )?Reviewed/i}).first(); R.markReviewed=await btn.count();
if(R.markReviewed){ await btn.click(); await p.waitForTimeout(3500); await p.screenshot({path:`${OUT}/gate-dialog.png`});
  R.gateIds=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.getAttribute('data-test-id')+'|'+e.innerText.replace(/\s+/g,' ').trim().slice(0,40)));
  const g=p.locator('.q-dialog [data-test-id="section_tech_story_gate"] textarea, .q-dialog textarea').first(); R.gateFound=await g.count(); if(R.gateFound) await three(g,'gate',titleOut); await p.screenshot({path:`${OUT}/gate-dialog-after.png`}); }
console.log(JSON.stringify(R,null,1)); fs.writeFileSync(`${OUT}/result.json`,JSON.stringify(R,null,1)); await s.close(); process.exit(0);
