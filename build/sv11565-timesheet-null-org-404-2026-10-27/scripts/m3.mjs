import {sess} from './lib.mjs'; import fs from 'fs';
const s=await sess(); const M=JSON.parse(fs.readFileSync('../data/matrix-branch.json'));
await s.page.waitForTimeout(2000);
const L=(await s.api('/api/work-orders/lines/'+M.W1.w)).json.data.collection.map(l=>l.line_id+' '+l.line_name.trim()); console.log(L.join('\n'));
await s.browser.close(); process.exit(0);
