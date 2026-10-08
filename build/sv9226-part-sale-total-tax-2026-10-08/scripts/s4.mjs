import {ob,j} from './lib.mjs'; import {fin} from './fin.mjs';
const s=await ob({vp:{width:1600,height:1000}}); const p=s.page;
for(const id of ['96232c8e-dac6-48f3-b4f9-c4c2179f6e08','c7f4ecc8-d374-429a-b3d2-131af7eeda38']){ console.log(id.slice(0,8),j(await fin(s,id),700)); await p.screenshot({path:`/tmp/qa9226/odd-${id.slice(0,8)}.png`}); }
await s.close();
