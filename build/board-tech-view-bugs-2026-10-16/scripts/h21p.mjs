import {session} from './rec.mjs'; import fs from 'fs';
const s=await session({vp:{width:1200,height:800},dpr:1});
const before=JSON.parse(fs.readFileSync('/tmp/qa11310/pref21-before.json'));
const cur=(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value;
const diff=Object.keys({...before,...cur}).filter(k=>JSON.stringify(before[k])!==JSON.stringify(cur[k])); console.log('diff keys before→now',diff);
const v={...cur,techViewColumns:before.techViewColumns};
const r=await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})}); console.log('PUT',r.status);
const after=(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; console.log('techViewColumns now',JSON.stringify(after.techViewColumns),'equal',JSON.stringify(after.techViewColumns)===JSON.stringify(before.techViewColumns));
console.log('still differ',Object.keys({...before,...after}).filter(k=>JSON.stringify(before[k])!==JSON.stringify(after[k]))); await s.close();
