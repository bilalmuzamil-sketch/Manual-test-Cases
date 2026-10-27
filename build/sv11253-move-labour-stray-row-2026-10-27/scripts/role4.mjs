import {sess} from './lib.mjs'; import fs from 'fs';
const s=await sess();
let r=await s.api('/api/auth/me/fe-permissions'); const d=r.json.data; console.log(Object.keys(d), JSON.stringify(d.cross_toggles), d.view_mode);
r=await s.api('/api/roles/73f72525-3d67-436b-9c1d-12677cdf9883'); console.log(Object.keys(r.json.data), JSON.stringify(Object.fromEntries(Object.entries(r.json.data).filter(([k])=>!/fe_permissions/.test(k)))).slice(0,800));
await s.browser.close(); process.exit(0);
