// usage: HEADED=1 xvfb-run -a node control.mjs <woId> -> COMPARISON ONLY: same typing (no trailing space) on a plain page textarea + plain input (not ShopView), and on ShopView New Note (unchanged by the fix); red-pixel shots typing / clicked out / refocus
import {sess} from './common.mjs'; import fs from 'fs';
const [WO]=process.argv.slice(2); const s=await sess(); const p=s.page; const OUT=process.env.ENV==='prod'?'../ev/prod-parth':'../ev/branch-parth'; fs.mkdirSync(OUT,{recursive:true}); const T='thee spellling are wrong wrng';
const three=async(sel,box,n,out)=>{ const ta=p.locator(sel).first(); if(box==='ANC') box=ta.locator('xpath=ancestor::*[contains(@class,"q-field")][1]'); await ta.click(); await p.keyboard.type(T,{delay:60}); await p.waitForTimeout(3000); await (typeof box==='string'?p.locator(box).first():box).screenshot({path:`${OUT}/${n}-1-typing.png`});
  await p.mouse.click(out.x,out.y); await p.waitForTimeout(3000); await (typeof box==='string'?p.locator(box).first():box).screenshot({path:`${OUT}/${n}-2-clicked-out.png`});
  await ta.click(); await p.waitForTimeout(3000); await (typeof box==='string'?p.locator(box).first():box).screenshot({path:`${OUT}/${n}-3-refocus.png`}); };
await p.setContent('<div style="padding:30px;font:16px sans-serif"><div id=a style="width:500px"><textarea id=t rows=3 cols=50 spellcheck=true></textarea></div><br><div id=b style="width:500px"><input id=i size=50 spellcheck=true></div><p id=o>outside</p></div>');
if(!process.env.NOTEONLY){ await three('#t','#a','plain-textarea',{x:20,y:300}); await three('#i','#b','plain-input',{x:20,y:300}); }
await s.go('/workorders/'+WO+'/notes'); await p.waitForTimeout(3500); await p.locator('[data-test-id="button_new_note"]').click(); await p.waitForTimeout(2500);
const t=await p.locator('.q-dialog .q-card__section').first().boundingBox();
await three('.q-dialog textarea','ANC','newnote-nospace',{x:t.x+8,y:t.y+8});
await s.close(); process.exit(0);
