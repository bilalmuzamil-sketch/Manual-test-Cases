// Mints a PRIVATE quick-login Admin session for filter-recheck worker F2 (so its change-location calls never race other
// workers). Copy of /tmp/cln/dv/mint.mjs with only the output path changed. Secret stays in /tmp (mode 600). SECRET-FREE.
import { login } from '/home/user/Manual-test-Cases/build/testing-tools/staging-admin.mjs';
import fs from 'fs';
const t = await login('admin');
fs.writeFileSync('/tmp/cln/f2/sess.txt', t.sessCookie, { mode: 0o600 });
console.log('status', t.status);
