import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/staging-cookie-boot.mjs';
import fs from 'node:fs';
const { page, browser } = await boot('/customers', { key:'admin', settle:12000, deviceScaleFactor:2 });
const out={};
try {
  await page.setViewportSize({width:1440,height:900});
  async function grab(term, tab, file, label){
    await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(600);
    await page.keyboard.press('Control+k'); await page.waitForTimeout(1400);
    const i=page.locator('.search-modal input');
    await i.click({clickCount:3}); await i.fill(''); await i.type(term,{delay:45});
    await page.waitForTimeout(5200);
    await page.evaluate((tb)=>{const t=[...document.querySelectorAll('.search-tabs__tab')]
      .find(e=>new RegExp('^\\s*'+tb.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i').test(e.innerText.trim())); if(t)t.click();},tab);
    await page.waitForTimeout(2400);
    await page.mouse.move(0,0); await page.waitForTimeout(400);
    if(file) await page.locator('.search-modal').screenshot({path:file});
    const notes=await page.evaluate(()=>[...document.querySelectorAll('.search-row')].slice(0,8).map(r=>{
      const parts=[...r.querySelectorAll('.search-row__meta-part')].map(p=>p.innerText.replace(/\s+/g,' ').trim());
      return parts.find(p=>/^[A-Za-z][A-Za-z \/]{2,30}:\s/.test(p)) || null;}).filter(Boolean));
    out[label]={term,tab,notes};
    console.log(`${label} "${term}" (${tab}):`, JSON.stringify(notes.slice(0,5)));
  }
  // C146209 as its STEPS now instruct
  await grab('0900','Customers','/tmp/claude-0/t1-cust-0900.png','C146209_steps_0900');
  // affected, across tabs
  await grab('SVEWU82','Work order','/tmp/claude-0/t1-wo-vin.png','affected_workorder_vin');
  await grab('965','Customers','/tmp/claude-0/t1-cust-965.png','affected_customer_phone');
  await grab('H3B','Parts','/tmp/claude-0/t1-parts-bin.png','affected_parts_bin');
  await grab('KVQ-','Assets','/tmp/claude-0/t1-asset-plate.png','affected_asset_plate');
  await grab('I-15','Purchase order','/tmp/claude-0/t1-po.png','affected_po_number');
  // NOT affected
  await grab('3286','Customers','/tmp/claude-0/t1-not-3286.png','notaffected_customer_phone_punctuated');
  await grab('zzautotest.nophone@','Customers','/tmp/claude-0/t1-not-email.png','notaffected_contact_email');
  fs.writeFileSync('ticket1-captures.json', JSON.stringify(out,null,1));
} finally { await browser.close(); }
