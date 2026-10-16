import {session} from './rec.mjs'; import fs from 'fs';
const s=await session({vp:{width:1200,height:800},dpr:1});
const b=JSON.parse(fs.readFileSync('/tmp/qa11310/pref21-before.json')).collapsedGroups; const a=(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value.collapsedGroups;
console.log(b.length,a.length,'removed',b.filter(x=>!a.includes(x)),'added',a.filter(x=>!b.includes(x)),'sameSetDiffOrder',b.length===a.length&&b.every(x=>a.includes(x))); await s.close();
