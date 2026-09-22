import {boot} from '/tmp/sv9940/boot.mjs';
import fs from 'fs';
const {b,ctx}=await boot('/parts/inventory',{width:1280,height:900});
const cs=await ctx.cookies();
const want=['sv_sso_session','PHPSESSID','cf_clearance'];
const line=want.map(n=>{const c=cs.find(x=>x.name===n); return c?`${n}=${c.value}`:null;}).filter(Boolean).join('; ');
fs.writeFileSync('/tmp/sv9940/cookieA.txt', line);
console.log('captured cookies:', want.filter(n=>cs.some(x=>x.name===n)).join(','));
await b.close();
