import {op,J,post,setLoc} from './lib.mjs'; import fs from 'fs';
const s=await op({dpr:1}); await setLoc(s);
const l=await s.api('/api/inventory/parts?limit=2'); const x=(l.json.data.collection||[])[0]; console.log('keys',Object.keys(x).join(',')); console.log('bins',J(x.bins||x.binLocations||x.bin_locations,500)); console.log('sample',J(x,900));
await s.close();
