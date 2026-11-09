import {sess} from './common.mjs'; const s=await sess();
const l=await s.api(`/api/work-orders/lines/e4215cb8-1388-4db9-b69d-fc5b93c0a121`); const c=l.json?.data?.collection||[]; console.log('line keys',Object.keys(c[0]||{}).join(','));
console.log(JSON.stringify(c[0]).slice(0,400));
const d=(await s.api('/api/inventory/parts/0007be4d-96b1-4ddf-a94b-026f03f4e35f')).json; console.log(JSON.stringify(d).slice(0,1500));
await s.close();
