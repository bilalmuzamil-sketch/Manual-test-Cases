import {prod1} from '../common.mjs'; const s=await prod1('/tmp/qa75');
const r=await s.api('/api/roles/2a43e6cb-34ab-4475-bd02-242361a725f5'); const j=JSON.stringify(r.json); console.log('status',r.status,'len',j.length);
const hits=[...j.matchAll(/"[^"]{0,80}[Pp]ortal[^"]{0,80}"/g)].map(m=>m[0]); console.log('portal strings',[...new Set(hits)].slice(0,30).join(' | '));
const idx=j.search(/[Ss]end[ _]?[Tt]o[ _]?[Pp]ortal|sendToPortal|send_to_portal/); console.log('ctx',idx>=0?j.slice(Math.max(0,idx-300),idx+300):'none');
await s.close(); process.exit(0);
