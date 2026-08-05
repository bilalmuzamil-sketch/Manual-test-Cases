// FLT-RPTS-23 / spec v18: what does the Reports Date Range chip actually offer?
import * as H from './h.mjs';
import {boot,APP} from './boot.mjs';
import fs from 'fs';
const R={build:'v3.4.2-d00239b',when:new Date().toISOString()};
const S=n=>{fs.writeFileSync('/tmp/frc/obs/r-daterange.json',JSON.stringify(R,null,1));console.log('..'+n);};
const {browser,page,netlog}=await boot();
await page.goto(APP+'/reports/punch-clock-activities',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(14000);
R.onLoad={url:page.url(),
  chips:await page.evaluate(()=>[...document.querySelectorAll('button.filter-chip')].map(b=>({t:b.innerText.trim().replace(/\n/g,'|'),testid:b.getAttribute('data-test-id'),active:b.className.includes('filter-chip--active')}))),
  rows:(await H.rows(page)).n};
await H.shot(page,'dr-01-reports-load');
S('load');
await page.locator('[data-test-id="filter_chip_range"]').first().click({timeout:20000});
await page.waitForTimeout(3000);
R.panel=await page.evaluate(()=>{
  const ps=[...document.querySelectorAll('.q-menu,.q-dialog')].filter(e=>e.offsetParent!==null||getComputedStyle(e).position==='fixed');
  if(!ps.length) return null; const e=ps[ps.length-1];
  return {text:e.innerText, cls:e.className,
    testIds:[...e.querySelectorAll('[data-test-id]')].map(x=>x.getAttribute('data-test-id')),
    buttons:[...e.querySelectorAll('button,.q-item,[role=option],li')].map(b=>b.innerText.trim()).filter(Boolean).slice(0,40),
    inputs:[...e.querySelectorAll('input')].map(i=>({ph:i.placeholder,val:i.value,testid:i.getAttribute('data-test-id')})),
    hasCalendar:!!e.querySelector('.q-date,[class*=calendar],[class*=date-picker]')};});
await H.shot(page,'dr-02-panel-open');
S('panel');
// pick a predefined range if one exists and see whether it applies on selection
const presets=(R.panel&&R.panel.buttons)||[];
R.presetsSeen=presets;
const pick=presets.find(t=>/last 7|last 30|this week|last week|last month|today|yesterday|this year/i.test(t));
R.presetPicked=pick||null;
if(pick){
  const n=netlog.filter(x=>x.phase==='res').length;
  try{ await page.locator('.q-menu').last().locator(`text="${pick}"`).first().click({timeout:12000}); }
  catch(e){ R.presetClickErr=e.message.slice(0,140); }
  await page.waitForTimeout(4500);
  R.afterPreset={url:page.url(),
    chip:await page.evaluate(()=>{const b=document.querySelector('[data-test-id="filter_chip_range"]');return b?b.innerText.trim().replace(/\n/g,'|'):null;}),
    rows:(await H.rows(page)).n,
    panelStillOpen:await page.evaluate(()=>[...document.querySelectorAll('.q-menu')].some(e=>e.offsetParent!==null)),
    calls:netlog.filter(x=>x.phase==='res'&&/report|punch|timesheet/i.test(x.url)).slice(-2).map(x=>({s:x.status,u:x.url.replace(/^https:\/\/[^/]+/,'').slice(0,150)}))};
  await H.shot(page,'dr-03-after-preset');
}
S('preset');
await browser.close();
