import {os,J} from './lib.mjs';
const s=await os(); console.log('marker',J(await s.marker(),300));
const me=(await s.api('/api/auth/me')).json; console.log('me',J(me,400));
const wp=(await s.api('/api/staff/my-workplaces')).json; console.log('wps',J(wp,800));
await s.close();
