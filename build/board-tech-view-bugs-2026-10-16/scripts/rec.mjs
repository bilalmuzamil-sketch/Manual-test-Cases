// Shared helper for narrated QA films on staging Work Orders (Tech/Board View).
import {open} from './qa.mjs'; import fs from 'fs';
export const C=JSON.parse(fs.readFileSync('/tmp/qa11398/cookies.json'));
export async function session({quick='admin',vp={width:1440,height:900},dpr=1,record=null}={}){ const s=await open({env:'staging',dir:'/tmp/qa11310',cookies:C,quick,vp,dpr,record}); return s; }
export async function toView(p,v){ if(!await p.$('[data-test-id=toggle_display_option]')) return; await p.click('[data-test-id=toggle_display_option]'); await p.waitForTimeout(700); await p.click(`[data-test-id=display_option_${v}]`); await p.waitForTimeout(4500); await p.keyboard.press('Escape').catch(()=>{}); }
export async function dens(p,d){ await p.click('[data-test-id=button_density]'); await p.waitForTimeout(600); await p.click(`[data-test-id=option_density_${d}]`); await p.waitForTimeout(2000); await p.keyboard.press('Escape').catch(()=>{}); }
export function narr(dir){ const D=JSON.parse(fs.readFileSync(dir+'/durs.json')); const ev={}; return {D,ev,hold:k=>Math.max(Math.round(D[k]*1000)+1000,2500),
  async cap(s,k,text,extra=0){ await s.page.waitForTimeout(1200); ev[k]=Date.now(); await s.caption(text,{hold:Math.max(Math.round(D[k]*1000)+1000,2500)+extra}); }}; }
export async function finish(s,dir,ev,extra={}){ const r=await s.close(); fs.writeFileSync(dir+'/run.json',JSON.stringify({ev,r,...extra},null,1)); return r; }
