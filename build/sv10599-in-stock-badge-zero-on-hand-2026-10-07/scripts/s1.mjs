import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob({dpr:2}); console.log('url',s.page.url()); console.log(j(await s.marker()));
const r=await s.api('/api/inventory/parts?limit=5'); console.log(r.status, j(r.json,900));
await s.close();
