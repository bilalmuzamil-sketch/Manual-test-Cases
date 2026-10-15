import {op,J,post} from './lib.mjs'; import {loc,customer,wo} from './seed.mjs'; import fs from 'fs';
const s=await op({tz:'America/New_York'}); await loc(s); console.log('marker',J(await s.marker(),200));
const c=await customer(s,'ZZAUTOTEST SV10795 PROD '+Date.now()%100000); const w=await wo(s,c);
fs.writeFileSync('WOP.json',JSON.stringify({...c,...w,loc:{workplace_id:process.env.WP,workplace_timezone:process.env.TZ_LOC}})); await s.close();
