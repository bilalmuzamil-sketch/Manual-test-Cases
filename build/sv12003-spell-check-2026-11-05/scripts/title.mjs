// usage: HEADED=1 xvfb-run -a node title.mjs <woId> -> Edit Line > Title (single-line box): type a misspelling, shots typing / clicked out / refocus
import {sess} from './common.mjs'; import fs from 'fs';
const [WO]=process.argv.slice(2); const s=await sess(); const p=s.page; const OUT=(process.env.ENV==='prod'?'../ev/prod-parth':'../ev/branch-parth')+(process.env.SUFFIX||''); fs.mkdirSync(OUT,{recursive:true});
await s.go('/workorders/'+WO+'/lines'); await p.waitForTimeout(3500); await p.locator('[data-test-id="line_title"]').first().click(); await p.waitForTimeout(2500);
const ta=p.locator('.q-dialog [data-test-id="input_line_name"]').first(); const box=ta.locator('xpath=ancestor::*[contains(@class,"q-field")][1]');
await ta.click(); await p.keyboard.press('End'); await p.keyboard.type(' wrng spellling',{delay:60}); await p.waitForTimeout(3000); await box.screenshot({path:`${OUT}/title-1-typing.png`});
const t=await p.locator('.q-dialog .q-card__section').first().boundingBox(); await p.mouse.click(t.x+8,t.y+8); await p.waitForTimeout(3000); await box.screenshot({path:`${OUT}/title-2-clicked-out.png`});
await ta.click(); await p.waitForTimeout(3000); await box.screenshot({path:`${OUT}/title-3-refocus.png`});
await p.keyboard.press('Escape'); await s.close(); process.exit(0);
