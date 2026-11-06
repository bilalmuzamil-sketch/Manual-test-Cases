// usage: HEADED=1 xvfb-run -a node parth.mjs <woId> <lineId> -> Parth's two notes: (a) last word with no trailing space, Tech Story + Edit Customer Notes; (b) single-line field (Edit Line title input); plus the same on a plain page (comparison only)
import {sess} from './common.mjs'; import fs from 'fs';
const [WO,LINE]=process.argv.slice(2); const s=await sess(); const p=s.page; const OUT='../ev/branch-parth'; fs.mkdirSync(OUT,{recursive:true});
const shot=async(loc,n)=>{ const b=loc.locator('xpath=ancestor::*[contains(@class,"q-field")][1]'); await b.screenshot({path:`${OUT}/${n}.png`}); };
const three=async(ta,n,text)=>{ await ta.click(); await p.keyboard.press('End'); await p.keyboard.type(text,{delay:60}); await p.waitForTimeout(3000); await shot(ta,n+'-1-typing');
  const t=p.locator('.q-dialog .q-card__section, .q-dialog .text-h6').first(); const tb=await t.boundingBox(); await p.mouse.click(tb.x+8,tb.y+8); await p.waitForTimeout(3000); await shot(ta,n+'-2-clicked-out');
  await ta.click(); await p.waitForTimeout(3000); await shot(ta,n+'-3-refocus'); };
// (a) Tech Story, no trailing space
await s.go('/workorders/'+WO+'/lines'); await p.waitForTimeout(3500); await p.locator(`[data-test-id="line_tech_story_${LINE}"]`).click(); await p.waitForTimeout(2500);
await three(p.locator('.q-dialog textarea').first(),'techstory-nospace','thee spellling are wrong wrng'); await p.keyboard.press('Escape'); await p.waitForTimeout(800);
const dc=p.locator('.q-dialog button').filter({hasText:/discard|leave|yes/i}); if(await dc.count()) await dc.first().click();
// (b) Edit Line: list inputs, then type into the single-line title
await s.go('/workorders/'+WO+'/lines'); await p.waitForTimeout(3500); await p.locator('[data-test-id="line_title"]').first().click(); await p.waitForTimeout(2500);
const ins=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog input, .q-dialog textarea')].map(e=>({tag:e.tagName,tid:e.getAttribute('data-test-id')||e.closest('[data-test-id]')?.getAttribute('data-test-id'),type:e.type,label:e.closest('.q-field')?.querySelector('.q-field__label')?.innerText,sc:e.spellcheck,val:(e.value||'').slice(0,40)}))); console.log('EDITLINE INPUTS',JSON.stringify(ins));
fs.writeFileSync(`${OUT}/editline-inputs.json`,JSON.stringify(ins,null,1));
await s.close(); process.exit(0);
