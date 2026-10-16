import {start,labor,apiTasks,moveEntry,J,sleep,post} from './drv.mjs'; import {mkwo} from './mkwo.mjs'; import fs from 'fs';
import {os} from './lib.mjs';
const s0=await start(); const W4=await mkwo(s0); const W5=await mkwo(s0); fs.writeFileSync('wo45.json',JSON.stringify({W4,W5})); console.log('walk WO',W4.number,'reader WO',W5.number); await s0.close();
const s=await start(); const p=s.page; const L=[];
// step 1: login page label
await p.goto('https://app.staging.shopview.com/login'); await p.waitForTimeout(3000);
L.push('login btn: '+J(await p.locator('[data-test-id="button_quick_login_admin"]').innerText().catch(()=>'n/a')));
await s.go('/workorders'); await p.waitForTimeout(3000);
L.push('location: '+(await p.locator('header,.q-header').first().innerText()).match(/Staging[^\n]*/)?.[0]);
// step 2: global search
await p.locator('[data-test-id="global_search_trigger"]').click(); await p.waitForTimeout(1000); await p.keyboard.type(W4.number); await p.waitForTimeout(3000);
const hits=await p.locator('.q-dialog').last().innerText().catch(()=>''); L.push('search shows: '+hits.replace(/\s+/g,' ').slice(0,200));
const hit=p.locator('.q-dialog').last().getByText(W4.number).first(); await hit.click(); await p.waitForTimeout(3500); L.push('opened: '+p.url());
L.push('tab labels: '+J(await p.locator('.q-tab').allInnerTexts()));
// step 3-4
await p.locator(`[data-test-id="button_clock_toggle_task_${W4.lines[0].id}"]`).click(); await p.waitForTimeout(2500);
L.push('after Start: '+J(await labor(s,W4.wid,{reload:false}))+' btn='+(await p.locator(`[data-test-id="button_clock_toggle_task_${W4.lines[0].id}"]`).innerText()));
await sleep(62000);
await p.locator(`[data-test-id="button_clock_toggle_task_${W4.lines[0].id}"]`).click(); await p.waitForTimeout(2000);
L.push('stop dialog: '+(await p.locator('.q-dialog').last().innerText()).replace(/\s+/g,' ').slice(0,160));
await p.locator('[data-test-id="input_tech_story"]').last().fill('ZZAUTOTEST walk'); await p.locator('[data-test-id="button_clock_out"]').last().click(); await p.waitForTimeout(3000);
// step 5: menu labels
await p.locator('[data-test-id="button_work_order_nav_bar_menu"]').click(); await p.waitForTimeout(800); L.push('menu: '+J(await p.locator('.q-menu .q-item').allInnerTexts())); await p.keyboard.press('Escape');
const mv=await moveEntry(s,W4.wid,{who:'Admin ShopView',toText:'2 Replace'}); L.push('move: '+J(mv));
await s.go(`/workorders/${W4.wid}/lines`); await p.reload(); await p.waitForTimeout(4000);
L.push('after reload: '+J(await labor(s,W4.wid,{reload:false})));
console.log(L.join('\n')); await s.close();
