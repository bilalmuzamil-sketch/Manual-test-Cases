import {sess} from './lib.mjs'; import fs from 'fs';
const s=await sess(); const E=JSON.parse(fs.readFileSync('../data/entry.json'));
s.L('dept create empty',await s.J('/api/organization/department/create',{}));
s.L('dept delete empty',await s.J('/api/organization/department/delete',{}));
// read the entry as the timesheet report shows it
let r=await s.api('/api/technician-tasks/'+E.tid); s.L('entry get',r);
await s.browser.close(); process.exit(0);
