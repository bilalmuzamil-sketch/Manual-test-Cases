import {ob,j} from './lib.mjs';
const s=await ob(); console.log('url',s.page.url()); console.log(j(await s.marker(),300));
const me=await s.api('/api/auth/me'); console.log('me',j(me,300));
const st=await s.api('/api/organizations/settings'); const d=st.json?.data||st.json;
console.log('settings keys',Object.keys(d||{}).join(','));
console.log(j(Object.fromEntries(Object.entries(d||{}).filter(([k])=>/review|complet|approv/i.test(k))),600));
const w=await s.api('/api/work-orders?limit=5&status=ready_for_review'); console.log('wo',w.status,j(w.json,600));
await s.close();
