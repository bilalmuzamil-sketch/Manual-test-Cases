import {sess,load,j} from './common.mjs'; const s=await sess(); const S=load();
const r=(await s.api('/api/work-orders/lines/'+S.wo)).json; const L=r?.data?.collection||r?.data||[]; console.log(Object.keys(L[0]||{}).join(','), j(L[0]).slice(0,300)); await s.close();
