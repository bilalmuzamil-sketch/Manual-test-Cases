import {ob,op,J,post} from './lib.mjs';
const s=await ob(); const r=await s.api('/api/users/me/preferences/parts-vendors',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({value:{sortBy:null,descending:false}})}); console.log('reset',r.status,J(r.json,200));
console.log('now',J((await s.api('/api/users/me/preferences/parts-vendors')).json,200)); await s.close();
