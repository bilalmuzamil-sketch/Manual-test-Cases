// Does each failing check's search term still return data? A failure caused by vanished seed data
// is a different thing from a product fault, and must not be reported as one.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/staging-cookie-boot.mjs';
import fs from 'node:fs';
const det=JSON.parse(fs.readFileSync('failed-detail.json','utf8'));
const TAB={'Work Orders':'Work order','Customers':'Customer','Assets':'Asset','Parts':'Parts',
  'Vendors':'Vendor','Part Sales':'Part sales','Purchase Orders':'Purchase order',
  'Vendor Invoices':'Vendor invoice','All tab and cross-tab':'All'};
const terms=[...new Set(det.map(d=>({t:d.term||d.stepTerm, tab:TAB[d.section]})).filter(x=>x.t).map(x=>JSON.stringify(x)))].map(JSON.parse);
const { page, browser } = await boot('/customers', { key:'admin', settle:12000 });
const out={};
try {
  await page.setViewportSize({width:1440,height:900});
  for (const {t,tab} of terms) {
    await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(500);
    await page.keyboard.press('Control+k'); await page.waitForTimeout(1300);
    const i=page.locator('.search-modal input');
    await i.click({clickCount:3}); await i.fill(''); await i.type(t,{delay:40});
    await page.waitForTimeout(5000);
    await page.evaluate((tb)=>{const x=[...document.querySelectorAll('.search-tabs__tab')]
      .find(e=>new RegExp('^\\s*'+tb.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i').test(e.innerText.trim())); if(x)x.click();},tab);
    await page.waitForTimeout(2000);
    const n=await page.evaluate(()=>document.querySelectorAll('.search-row').length);
    out[t]={tab,rows:n};
    console.log(`${n===0?'!! NO DATA':'ok       '}  "${t}" (${tab}) -> ${n} rows`);
  }
  fs.writeFileSync('term-check.json', JSON.stringify(out,null,1));
} finally { await browser.close(); }
