import {sess} from './common.mjs'; const s=await sess(); const p=s.page; await s.go(process.env.URL||'/workorders'); await p.waitForTimeout(5000);
const KEYS=process.argv.slice(2);
const r=await p.evaluate(async(KEYS)=>{ const urls=[...new Set(performance.getEntriesByType('resource').map(e=>e.name).filter(u=>/\.js(\?|$)/.test(u)))]; const out=[];
 const idx=await (await fetch('/')).text(); for(const m of idx.matchAll(/src="([^"]+\.js)"/g)) urls.push(new URL(m[1],location.href).href);
 for(const u of urls){ try{ const t=await (await fetch(u)).text(); for(const k of KEYS){ let i=-1,c=0; while((i=t.indexOf(k,i+1))>=0&&c<3){ out.push(u.split('/').pop()+' :: '+k+' :: '+t.slice(Math.max(0,i-500),i+250)); c++; } } }catch(e){} } return out; },KEYS);
console.log(r.join('\n=====\n')); await s.close(); process.exit(0);
