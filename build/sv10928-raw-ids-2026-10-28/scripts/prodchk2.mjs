import {open} from '../../testing-tools/qa-session.mjs';
const s=await open({env:'prod',ticket:'10928',cookies:{},dir:(process.env.QA_DIR||'/tmp/qa25'),user:'bilal.muzamil@shopview.com'});
for(const h of [{},{'x-location-id':'b617914c-16e9-4485-8e8b-193cd86aa416'},{'x-location-id':'555206ea-2a33-4ca1-a29a-5431b0f7648c'}]){
  const r=await s.api('/api/work-orders/view/0ecff689-f076-4b1e-be98-d1fcaf650988',{headers:h}); console.log(JSON.stringify(h),r.status,JSON.stringify(r.json?.data?.workplace_id||r.json?.data?.work_order?.workplace_id||r.json).slice(0,160)); }
const me=(await s.api('/api/iam/view-profile/')).json?.data; console.log('profile loc',JSON.stringify(me).match(/"(?:current_)?workplace[^,]*/g)?.slice(0,3));
await s.close(); process.exit(0);
