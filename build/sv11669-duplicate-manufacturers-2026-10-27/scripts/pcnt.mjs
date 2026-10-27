import {sess} from './lib.mjs'; const s=await sess('admin',{}); const a=Object.values((await s.api('/api/parts-catalogue/manufacturers')).json.data).find(Array.isArray);
const n=x=>String(x??'').trim().toLowerCase().replace(/\s+/g,' '); const c={}; a.forEach(m=>c[n(m.label)]=(c[n(m.label)]||0)+1);
console.log('prod total',a.length,'blank',c['']||0,'dup names',Object.entries(c).filter(([k,v])=>v>1).length,JSON.stringify(Object.entries(c).filter(([k,v])=>v>1).slice(0,6)));
for(const k of ['accuride','haldex','dayco','bendix','heavy duty brand','napa']) console.log(k,c[k]||0);
const v=await s.page.evaluate(()=>document.querySelector('meta[name="app-version"]')?.content); console.log('prod build',v);
await s.browser.close(); process.exit(0);
