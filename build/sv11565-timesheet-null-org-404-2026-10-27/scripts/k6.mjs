import {sess} from './lib.mjs';
const s=await sess();
s.L('clock-out',await s.J('/api/technician-tasks/department-clock-out',{id:'4b693484-60ac-4b15-b57a-fdf1bff83947',description:'ZZAUTOTEST SV-11565 clock-in check'}));
s.L('current end',await s.api('/api/technician-tasks/my-current-task'));
await s.browser.close(); process.exit(0);
