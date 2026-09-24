// Learn the work-order detail endpoints by watching the page load them.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const ID='47abc3c7-93a1-401c-9344-547e1066a4a2';
const { browser, page, ctx, APIH } = await bootProdLogin('/workorders', { settle: 8000 });
const seen=[];
page.on('response', async r => { const u=r.url(); if (u.includes('/api/') && !u.includes('sentry')) seen.push({s:r.status(), u:u.replace('https://api.shopview.com','')}); });
await page.goto(`https://app.shopview.com/workorders/${ID}/lines`, {waitUntil:'domcontentloaded'});
await page.waitForTimeout(12000);
const uniq=[...new Map(seen.map(x=>[x.u,x])).values()];
for (const x of uniq) console.log(x.s, x.u.slice(0,140));
fs.writeFileSync(`${EV}/wo-detail-endpoints.txt`, uniq.map(x=>x.s+' '+x.u).join('\n'));
await browser.close();
