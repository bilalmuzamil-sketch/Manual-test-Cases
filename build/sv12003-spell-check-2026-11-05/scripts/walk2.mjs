import {sess} from './common.mjs';
const s=await sess({dir:'/tmp/qa95',dpr:1}); const p=s.page;
await s.go('/workorders/737fce7f-bf9c-4634-960a-b72de9a2e7a7/lines'); await p.waitForTimeout(4000);
for(const id of ['link_customer_card_name','vehicle_card_title_link']){const b=await p.locator(`[data-test-id="${id}"]`).first().boundingBox(); console.log(id,JSON.stringify(b));}
const tb=await p.locator('text=Add tech story for this line').first().boundingBox(); console.log('techstory',JSON.stringify(tb));
await p.screenshot({path:'/tmp/sv12003/walk-wo.png'});
await p.locator('[data-test-id="vehicle_card_title_link"]').first().click(); await p.waitForTimeout(3500);
const e=p.locator('[data-test-id="button_edit_vehicle"]').first(); console.log('veh url',p.url(),'edit:',JSON.stringify(await e.innerText()), JSON.stringify(await e.boundingBox()));
await e.click(); await p.waitForTimeout(2000); console.log((await p.locator('.q-dialog').first().innerText()).split('\n').slice(0,2));
await p.screenshot({path:'/tmp/sv12003/walk-veh.png'}); process.exit(0);
