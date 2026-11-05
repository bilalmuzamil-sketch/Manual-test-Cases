// usage: node mkcat.mjs <partNumber> -> Parts > Catalog > New Catalog Part (UI): name ZZAUTOTEST SV12182 <pn>, number <pn>, first category + measurement; prints the create response
import {sess} from './common.mjs'; const [PN]=process.argv.slice(2); const s=await sess(); const p=s.page; const resp=[];
p.on('response',async r=>{ if(/add-catalogue-part/.test(r.url())) resp.push(r.status()+' '+(await r.text().catch(()=>'')).slice(0,200)); });
await s.go('/parts/parts-catalogue'); await p.waitForTimeout(4000); await p.locator('[data-test-id="button_new_catalog_part"]').click(); await p.waitForTimeout(1500);
await p.locator('[data-test-id="input_catalogue_part_name"]').fill('ZZAUTOTEST SV12182 '+PN); await p.locator('[data-test-id="input_catalogue_part_number"]').fill(PN);
for(const id of ['select_catalogue_part_category','select_catalogue_part_measurement']){ const l=p.locator(`[data-test-id="${id}"]`); if(await l.count()){ await l.click(); await p.waitForTimeout(800); const o=p.locator('.q-menu .q-item').first(); if(await o.count()) await o.click(); await p.waitForTimeout(500);} }
await p.locator('[data-test-id="button_confirm_dialog"]').click(); await p.waitForTimeout(3000); console.log('RESP',JSON.stringify(resp)); console.log('NOTIF',JSON.stringify(await p.locator('.q-notification').allInnerTexts()));
await s.close(); process.exit(0);
