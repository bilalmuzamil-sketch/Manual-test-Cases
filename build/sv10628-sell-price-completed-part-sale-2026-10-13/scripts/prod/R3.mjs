import {op,J} from './lib.mjs'; import fs from 'fs'; import {resetRole} from './roles.mjs';
const s=await op({dpr:1});
const pm=await resetRole(s,'48c378ce-a682-4389-935e-757a1e923e4a'); console.log('PartsManager',J({n0:pm.before.length,n1:pm.after.length,added:pm.added,removed:pm.removed,log:pm.log},1200));
fs.writeFileSync('reset-pm.json',JSON.stringify(pm,null,1));
await s.close();
