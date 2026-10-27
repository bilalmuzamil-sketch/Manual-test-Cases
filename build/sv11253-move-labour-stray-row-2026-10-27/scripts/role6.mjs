import {sess} from './lib.mjs'; import fs from 'fs';
const s=await sess(); const before=JSON.parse(fs.readFileSync('../data/admin-role-reset.json')).after;
const q=await s.api('/api/roles/73f72525-3d67-436b-9c1d-12677cdf9883'); const now=(q.json.data.fe_permissions||[]).map(x=>x.code||x.name).sort();
console.log('now',now.length,'added',now.filter(x=>!before.includes(x)),'removed',before.filter(x=>!now.includes(x)));
const me=await s.api('/api/auth/me/fe-permissions'); console.log('me has',me.json.data.fe_permissions.filter(x=>/move|labo/i.test(x)));
await s.browser.close(); process.exit(0);
