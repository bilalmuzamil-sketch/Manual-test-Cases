import {sess} from './common.mjs'; const s=await sess(); const p=s.page; await s.go('/workorders'); await p.waitForTimeout(3000);
const r=await p.evaluate(async()=>{ const urls=performance.getEntriesByType('resource').map(e=>e.name).filter(u=>/\.js(\?|$)/.test(u)); const out=[];
 for(const u of urls){ try{ const t=await (await fetch(u)).text(); for(const k of ['create-from-canned-line','lines/change-status','lines/create"','lines/create`',"lines/create'"]){ let i=-1; while((i=t.indexOf(k,i+1))>=0 && out.length<12) out.push(k+' :: '+t.slice(Math.max(0,i-250),i+200)); } }catch(e){} } return out; });
console.log(r.join('\n----\n')); await s.close(); process.exit(0);
