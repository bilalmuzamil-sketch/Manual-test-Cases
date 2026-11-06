import {sess,arr} from './common.mjs';
const s=await sess(); await s.go('/parts/inventory'); await s.page.waitForTimeout(4000); console.log('marker',JSON.stringify(await s.marker().catch(e=>String(e))));
const r=await s.api('/api/inventory/parts?pagination[page]=1&pagination[rowsPerPage]=200'); const L=arr(r.json?.data); console.log('parts',L.length,'keys',Object.keys(L[0]||{}).join(',').slice(0,500));
const cored=L.filter(p=>Number(p.core_charge)>0||p.core); console.log('cored',cored.length, cored.slice(0,8).map(p=>p.part_number+'|q'+p.quantity+'|bins'+JSON.stringify(p.bins||p.bin_locations||'').slice(0,80)).join(' ; '));
const nob=L.filter(p=>!(Number(p.core_charge)>0||p.core)).slice(0,5); console.log('nocore',nob.map(p=>p.part_number+'|q'+p.quantity+'|bins'+JSON.stringify(p.bins||p.bin_locations||'').slice(0,80)).join(' ; '));
await s.close(); process.exit(0);
