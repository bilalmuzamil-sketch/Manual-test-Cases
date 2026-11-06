// node chunks.mjs <route> <regex> -> fetch all loaded app JS on that route (board view selected) and print matches
import {sess} from './common.mjs'; import fs from 'fs';
const [route,rx]=process.argv.slice(2); const s=await sess(); const p=s.page; await s.go(route); await p.waitForTimeout(3500);
if(process.env.BOARD) { await p.click('[data-test-id=display_option_board_view]'); await p.waitForTimeout(3500); }
const urls=await p.evaluate(()=>performance.getEntriesByType('resource').map(e=>e.name).filter(u=>/\.js(\?|$)/.test(u)&&/shopview\.com/.test(u)));
const out=new Set(); for(const u of urls){ const t=await p.evaluate(async u=>{try{return await (await fetch(u)).text()}catch(e){return ''}},u); for(const m of t.matchAll(new RegExp(rx,'g'))) out.add(u.split('/').pop()+': '+m[0]); }
console.log([...out].slice(0,40).join('\n')); await s.close(); process.exit(0);
