import {sess,post} from './common.mjs'; import fs from 'fs'; const s=await sess();
const name='ZZAUTOTEST SV12234 Contacts '+(Date.now()%100000);
const c=await post(s,'/api/customers/create',{name}); console.log('cust',c.status,JSON.stringify(c.json).slice(0,200)); const company_id=c.json?.data?.company_id||c.json?.data?.id;
const people=[['Anna','First','anna.first@example.com'],['Ben','Second','ben.second@example.com'],['Cara','Third','cara.third@example.com']]; const ids=[];
for(const [f,l,e] of people){ const r=await post(s,'/api/contacts/create',{company_id,first_name:f,last_name:l,email:e,phone:'5555550100'}); console.log('contact',r.status,JSON.stringify(r.json).slice(0,160)); ids.push(r.json?.data?.contact_id); }
fs.writeFileSync('../ev/seed.json',JSON.stringify({name,company_id,contacts:ids},null,1)); await s.close(); process.exit(0);
