// Mints a PRIVATE quick-login Admin session for worker p2b (Phase 2) so its change-location calls never race the
// other workers sharing /tmp/cln/sess-admin.txt. Secret stays in /tmp (600).
import { login } from '/home/user/Manual-test-Cases/build/testing-tools/staging-admin.mjs';
import fs from 'fs';
const t = await login('admin');
fs.writeFileSync('/tmp/cln/p2b/sess.txt', t.sessCookie, { mode: 0o600 });
console.log('status', t.status);
