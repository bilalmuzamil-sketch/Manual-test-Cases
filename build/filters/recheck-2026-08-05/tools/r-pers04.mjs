// FLT-PERS-04 (C29616) live: seed a ZZAUTOTEST customer, filter by it + a real one, delete it, return.
import {api} from './boot.mjs';
import fs from 'fs';
const R={build:'v3.4.2-d00239b',when:new Date().toISOString()};
const S=n=>{fs.writeFileSync('/tmp/frc/obs/r-pers04.json',JSON.stringify(R,null,1));console.log('..'+n);};
// discover the create contract by probing with an empty body
let r=await api('POST','/api/customers/create',{});
R.probeEmpty={status:r.status,body:JSON.stringify(r.body).slice(0,700)}; S('probe');
console.log('probe',r.status,JSON.stringify(r.body).slice(0,500));
