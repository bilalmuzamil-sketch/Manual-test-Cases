import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess(); await s.go('/administration/pricing'); await s.page.waitForTimeout(2000);
const r=await s.api('/api/pricing-rules/list?'); fs.writeFileSync('/tmp/sv11006/pricing-rules.json',JSON.stringify(r.json,null,1));
const c=await s.api('/api/inventory/categories?limit=500'); fs.writeFileSync('/tmp/sv11006/cats.json',JSON.stringify(c.json,null,1));
await s.close(); process.exit(0);
