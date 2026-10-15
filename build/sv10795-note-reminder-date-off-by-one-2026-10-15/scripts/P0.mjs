import {ob,J} from './lib.mjs';
const s=await ob({tz:'America/New_York'}); console.log('marker',J(await s.marker(),300));
console.log('browser tz',await s.page.evaluate(()=>[Intl.DateTimeFormat().resolvedOptions().timeZone,new Date().toString()]));
const wp=(await s.api('/api/staff/my-workplaces')).json?.data?.collection||[]; console.log('wps',J(wp.map(w=>[w.id,w.name,w.timezone,w.is_default]),900));
await s.close();
