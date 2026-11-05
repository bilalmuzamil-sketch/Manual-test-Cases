// usage: HEADED=1 [ENV=prod] xvfb-run -a node matrix.mjs <woId> <lineId> -> every text box: type misspelled text, screenshot focused + after clicking out; spellcheck attrs
import {sess} from './common.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'branch'; const [WO,LINE]=process.argv.slice(2); const TEXT='thee spellling are wrong wrng ';
const s=await sess(); const p=s.page; const OUT=`../ev/${ENV}-matrix`; fs.mkdirSync(OUT,{recursive:true}); const R=[];
const goWO=async(tab='lines')=>{ await s.go('/workorders/'+WO+'/'+tab); await p.waitForTimeout(3500); };
const cases=[
 ['tech_story', async()=>{ await goWO(); await p.locator(`[data-test-id="line_tech_story_${LINE}"]`).click(); }, '.q-dialog textarea'],
 ['edit_line_description', async()=>{ await goWO(); await p.locator('[data-test-id="line_title"]').first().click(); }, '.q-dialog [data-test-id="input_line_description"] textarea, .q-dialog textarea[data-test-id="input_line_description"]'],
 ['new_line_description', async()=>{ await goWO(); await p.locator('[data-test-id="button_new_line"]').click(); }, '.q-dialog [data-test-id="input_line_description"] textarea, .q-dialog textarea[data-test-id="input_line_description"]'],
 ['customer_notes', async()=>{ await goWO(); await p.locator('[data-test-id="link_customer_card_name"]').click(); await p.waitForTimeout(3500); await p.locator('[data-test-id="button_base"]').first().click(); }, '.q-dialog textarea[data-test-id="input_customer_notes"], .q-dialog [data-test-id="input_customer_notes"] textarea'],
 ['vehicle_notes', async()=>{ if(process.env.VEHURL){ await s.go(process.env.VEHURL); } else { await goWO(); await p.locator('[data-test-id="vehicle_card_title_link"]').click(); } await p.waitForTimeout(3500); await p.locator('[data-test-id="button_edit_vehicle"]').first().click(); }, '.q-dialog textarea[data-test-id="input_notes"], .q-dialog [data-test-id="input_notes"] textarea'],
 ['new_note', async()=>{ await goWO('notes'); await p.locator('[data-test-id="button_new_note"]').click(); }, '.q-dialog textarea'],
];
const ONLY=(process.env.ONLY||'').split(',').filter(Boolean); for(const [name,open,sel] of cases.filter(c=>!ONLY.length||ONLY.includes(c[0]))){ console.log('start',name,new Date().toISOString()); const r={name};
  try{ await open(); await p.waitForTimeout(2500); const ta=p.locator(sel).first(); r.found=await ta.count(); if(!r.found){ r.err='no textarea'; R.push(r); await p.keyboard.press('Escape'); continue; }
    r.title=await p.evaluate(()=>document.querySelector('.q-dialog')?.innerText.split('\n')[0]); r.spell=await ta.evaluate(e=>({prop:e.spellcheck,attr:e.getAttribute('spellcheck'),form:e.closest('form')?.getAttribute('spellcheck'),tid:e.getAttribute('data-test-id')||e.closest('[data-test-id]')?.getAttribute('data-test-id')}));
    await ta.click(); await p.keyboard.press('End'); await p.keyboard.type(TEXT,{delay:60}); await p.waitForTimeout(3500);
    const box=ta.locator('xpath=ancestor::*[contains(@class,"q-field")][1]'); await box.screenshot({path:`${OUT}/${name}-1-typing.png`}); r.focused=await ta.evaluate(e=>document.activeElement===e);
    const t=p.locator('.q-dialog .text-h6, .q-dialog h6, .q-dialog .q-card__section').first(); const tb=await t.boundingBox(); await p.mouse.click(tb.x+8,tb.y+8); await p.waitForTimeout(3000);
    await box.screenshot({path:`${OUT}/${name}-2-clicked-out.png`}); r.focusedAfter=await ta.evaluate(e=>document.activeElement===e); r.valueAfter=await ta.inputValue(); await p.screenshot({path:`${OUT}/${name}-dialog.png`});
    await ta.click(); await p.keyboard.press('End'); await p.waitForTimeout(3500); await box.screenshot({path:`${OUT}/${name}-3-refocus.png`});
  }catch(e){ r.err=e.message.slice(0,160); }
  R.push(r); console.log(JSON.stringify(r)); await p.keyboard.press('Escape'); await p.waitForTimeout(800); const dc=p.locator('.q-dialog button').filter({hasText:/discard|leave|yes/i}); if(await dc.count()){ await dc.first().click(); await p.waitForTimeout(500);} }
fs.writeFileSync(`${OUT}/result.json`,JSON.stringify(R,null,1)); await s.close(); process.exit(0);
