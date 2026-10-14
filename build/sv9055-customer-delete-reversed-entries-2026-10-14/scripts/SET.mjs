import {ob,J,post} from './lib.mjs'; import fs from 'fs';
const s=await ob();
const st=(await s.api('/api/organizations/settings')).json.data; fs.writeFileSync('settings-before.json',JSON.stringify(st));
const nw={...st,requireTechStories:false,requireMileage:false};
const r=await post(s,'/api/organizations/settings/change',nw); console.log('change',r.status,J(r.json,200));
const after=(await s.api('/api/organizations/settings')).json.data;
console.log('after',J(Object.fromEntries(Object.entries(after).filter(([k])=>/require/i.test(k))),300));
const diff=Object.keys(st).filter(k=>JSON.stringify(st[k])!==JSON.stringify(after[k])); console.log('changed fields',diff);
await s.close();
