// usage: [ENV=prod DIR=..] node weekshot.mjs <tag> <date> <out.png> -> Week view on that date, scrolls to the WO's block(s), screenshot + boxes (CSS px)
import {sess} from './common.mjs'; import fs from 'fs';
const [TAG,NAV,OUT]=process.argv.slice(2); const W=JSON.parse(fs.readFileSync(`/tmp/sv12267/wo-${TAG}.json`,'utf8'));
const s=await sess({dir:process.env.DIR||'/tmp/qa93'}); const p=s.page; await s.go('/schedule'); await p.waitForTimeout(4500);
await p.locator('[data-test-id="schedule_view_toggle"]').getByText('Week',{exact:true}).first().click(); await p.waitForTimeout(1500);
await p.locator(`[data-test-id="button_mini_calendar_day_${NAV}"]`).first().click(); await p.waitForTimeout(3500);
const bl=p.locator('.fc-event',{hasText:W.customerName}); const n=await bl.count(); if(n){await bl.first().scrollIntoViewIfNeeded(); await p.evaluate(()=>window.scrollBy(0,0)); await p.waitForTimeout(600);}
const boxes=[]; for(let i=0;i<n;i++) boxes.push(await bl.nth(i).boundingBox());
const hdr=await p.evaluate(()=>[...document.querySelectorAll('.fc-col-header-cell, th')].map(e=>{const r=e.getBoundingClientRect();return [e.innerText.replace(/\s+/g,' ').trim(),Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)]}).filter(x=>/Nov|Dec/.test(x[0])));
const row=await p.evaluate(nm=>{const e=[...document.querySelectorAll('*')].find(x=>x.children.length===0&&x.innerText&&x.innerText.trim()===nm);if(!e)return null;const r=e.getBoundingClientRect();return [Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)]},process.env.TECH||'');
const ver=await p.evaluate(async()=>{const t=await (await fetch('/index.html?cb='+Date.now(),{cache:'no-store'})).text();return (t.match(/app-version" content="([^"]+)/)||[])[1];});
await p.screenshot({path:OUT}); console.log(JSON.stringify({ver,n,boxes,hdr,row})); await s.close(); process.exit(0);
