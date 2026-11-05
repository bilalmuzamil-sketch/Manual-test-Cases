import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1500);
const r=await s.api('/api/organizations/settings'); fs.writeFileSync('/tmp/sv11006/org-settings-'+(process.env.ENV||'branch')+'.json',JSON.stringify(r.json,null,1));
const flat=[]; const walk=(o,pre)=>{ if(o&&typeof o==='object') for(const [k,v] of Object.entries(o)) walk(v,pre?pre+'.'+k:k); else flat.push(pre+'='+o); }; walk(r.json?.data,'');
console.log(flat.filter(x=>/receiv|vendor|complet|invoice|part/i.test(x)).join('\n')); await s.close(); process.exit(0);
