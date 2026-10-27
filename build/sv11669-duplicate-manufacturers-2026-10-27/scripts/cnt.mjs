import {sess} from './lib.mjs'; const s=await sess(); const a=Object.values((await s.api('/api/parts-catalogue/manufacturers')).json.data).find(Array.isArray);
const n=x=>x.trim().toLowerCase().replace(/\s+/g,' '); const c={}; a.forEach(m=>c[n(m.label)]=(c[n(m.label)]||0)+1);
console.log('total',a.length,'blank',c['']||0,'dupes',JSON.stringify(Object.entries(c).filter(([k,v])=>v>1)),'accuride',c['accuride'],'haldex',c['haldex'],'bendix',c['bendix'],'dayco',c['dayco']||0); await s.browser.close(); process.exit(0);
