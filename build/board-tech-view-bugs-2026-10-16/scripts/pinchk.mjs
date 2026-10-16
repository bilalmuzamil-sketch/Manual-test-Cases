import {session} from './rec.mjs';
const s=await session({vp:{width:1200,height:800}}); 
const r=await s.api('/api/users/me/preferences/work-orders-list'); const v=r.json?.data?.value||{}; console.log('pinned',JSON.stringify(v.pinnedTechnicianIds),'boardPinned',JSON.stringify(v.boardPinnedTechnicianIds||v.pinned), Object.keys(v).join(','));
await s.close();
