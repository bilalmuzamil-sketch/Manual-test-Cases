import {ob,J} from './lib.mjs';
const s=await ob();
const st=(await s.api('/api/organizations/settings')).json.data;
console.log('settings',J(Object.fromEntries(Object.entries(st).filter(([k,v])=>/require|review|approv/i.test(k))),400));
const w=await s.api('/api/staff/my-workplaces'); console.log('wp',J(w.json,500));
await s.close();
