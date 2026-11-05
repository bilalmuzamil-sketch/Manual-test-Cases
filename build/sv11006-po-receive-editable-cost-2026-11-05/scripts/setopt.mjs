// usage: node setopt.mjs <key> <true|false> -> echoes the full settings object back with one key changed
import {sess,post} from './common.mjs'; import fs from 'fs';
const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1500);
const cur=(await s.api('/api/organizations/settings')).json?.data; const k=process.argv[2]; const v=process.argv[3]==='true';
console.log('before',k,cur[k]); const r=await post(s,'/api/organizations/settings/change',{...cur,[k]:v}); console.log('change',r.status,JSON.stringify(r.json).slice(0,200));
console.log('after',k,(await s.api('/api/organizations/settings')).json?.data?.[k]); await s.close(); process.exit(0);
