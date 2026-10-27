import {sess2} from './lib2.mjs'; const s=await sess2();
const base={name:'ZZAUTOTEST Org2 Shop',shop_id:'2001',city:'Calgary',telephone:'4035550100',timezone:'America/Edmonton',country_code:'CA'};
let r=await s.J('/api/workplaces/create',{...base,address_1:'1 Test Road',state_or_province:'AB',postal_code:'T2P 1J9'}); console.log('snake',r.status,JSON.stringify(r.json??r.text).slice(0,300));
if(r.status>=400){ r=await s.J('/api/workplaces/create',{...base,address1:'1 Test Road',stateOrProvince:'AB',postalCode:'T2P 1J9',countryCode:'CA',shopId:'2001'}); console.log('camel',r.status,JSON.stringify(r.json??r.text).slice(0,300)); }
const w=await s.api('/api/staff/my-workplaces'); console.log('workplaces',JSON.stringify((w.json?.data?.collection||[]).map(x=>[x.id,x.name,x.timezone])));
await s.browser.close(); process.exit(0);
