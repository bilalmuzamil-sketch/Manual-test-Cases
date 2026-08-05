import {api} from './boot.mjs';
import fs from 'fs';
const R=JSON.parse(fs.readFileSync('/tmp/frc/obs/r-pers04.json','utf8'));
let r=await api('POST','/api/customers/create',{name:'ZZAUTOTEST Filters Recheck'});
R.create={status:r.status,body:JSON.stringify(r.body).slice(0,600)};
console.log('create',r.status,JSON.stringify(r.body).slice(0,400));
fs.writeFileSync('/tmp/frc/obs/r-pers04.json',JSON.stringify(R,null,1));
