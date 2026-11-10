import {sess} from './common.mjs';
const s=await sess();
for(const id of process.env.IDS.split(',')){ const r=await s.api(`/api/invoices/${id}/details`); const j=JSON.stringify(r.json);
 console.log(id,r.status,(j.match(/"[a-z_A-Z]*(term|Term|company_id|companyId)[a-z_A-Z]*":("[^"]*"|\{[^}]{0,80}\}|null|\d+|true|false)/g)||[]).slice(0,8).join(' ')); }
await s.close(); process.exit(0);
