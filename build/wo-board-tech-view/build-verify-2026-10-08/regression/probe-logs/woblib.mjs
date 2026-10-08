import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
export const OUT='/home/user/Manual-test-Cases/build/wo-board-tech-view/build-verify-2026-10-08/regression/';
export const B='https://sv10043.qa.shopview.com';
export const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
export async function start(route='/workorders',key='admin'){ const b=await boot('sv10043',route,key); await b.page.waitForTimeout(6000); return b; }
export function mk(page){
  const dump=async(tag)=>{const t=await page.evaluate(()=>document.body.innerText);fs.writeFileSync(OUT+tag+'.txt',page.url()+'\n\n'+t);await page.screenshot({path:OUT+tag+'.png'}).catch(()=>{});return t.replace(/\s+/g,' ');};
  const ov=async()=>page.evaluate(()=>[...document.querySelectorAll('.q-menu,.q-dialog,[role=menu],[role=dialog],.q-tooltip,.q-notification')].map(e=>e.innerText.replace(/\s+/g,' ').trim()).filter(Boolean).join(' || ').slice(0,1800));
  const tip=async(loc)=>{await loc.hover().catch(()=>{});await page.waitForTimeout(1200);return page.evaluate(()=>[...document.querySelectorAll('.q-tooltip')].map(e=>e.innerText).join(' | '));};
  const go=async(p,w=8000)=>{await page.goto(B+p,{waitUntil:'domcontentloaded'}).catch(()=>{});await page.waitForTimeout(w);};
  const esc=async()=>{await page.keyboard.press('Escape').catch(()=>{});await page.waitForTimeout(700);};
  const body=async()=>page.evaluate(()=>document.body.innerText.replace(/\s+/g,' '));
  return {dump,ov,tip,go,esc,body};
}
