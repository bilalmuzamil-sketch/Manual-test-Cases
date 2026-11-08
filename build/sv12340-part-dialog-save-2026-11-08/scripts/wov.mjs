import {sess} from './common.mjs'; const s=await sess(); const v=await s.api(`/api/work-orders/view/${process.env.WO}`);
const t=JSON.stringify(v.json); console.log((t.match(/"[a-zA-Z_]*(company|customer)[a-zA-Z_]*":"[^"]{8,40}"/gi)||[]).slice(0,10).join('\n')); await s.close();
