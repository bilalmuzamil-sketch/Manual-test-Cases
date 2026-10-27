import {sess2} from './lib2.mjs'; const s=await sess2();
for(const p of ['/api/workplaces/create','/api/organization/workplaces/create','/api/organizations/workplaces/create','/api/workplace/create','/api/organization/workplace/create']){const r=await s.J(p,{}); console.log(p,r.status,JSON.stringify(r.json??r.text).slice(0,260));}
const o=await s.api('/api/organizations/settings'); console.log('settings',o.status,JSON.stringify(o.json).match(/"country[a-z_]*":[^,]*/gi));
await s.browser.close(); process.exit(0);
