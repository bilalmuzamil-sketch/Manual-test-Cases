// mint-staging-session.mjs — rebuild the staging admin session files after a container restart wipes /tmp.
// SECRET-FREE: needs the QA lead's cookies in /tmp/cln/cookies.json (chmod 600; only he can mint them — Google SSO).
// Writes the quick-login admin session to every path the dashboard/report scripts read, all chmod 600:
//   /tmp/cln/sess-admin.txt (tools/collect_*.py, sf1_screen checks) · /tmp/cln/f3/sess.txt (filter-recheck tools/f3/common.py)
// Usage: node build/testing-tools/mint-staging-session.mjs   → prints only the HTTP status and the role.
import fs from 'fs';
import { login } from './staging-admin.mjs';
const t = await login('admin');
fs.mkdirSync('/tmp/cln/f3', { recursive: true, mode: 0o700 });
for (const p of ['/tmp/cln/sess-admin.txt', '/tmp/cln/f3/sess.txt']) { fs.writeFileSync(p, t.sessCookie, { mode: 0o600 }); fs.chmodSync(p, 0o600); }
console.log('quick-login status', t.status, 'role', JSON.stringify(t.data?.role || t.data?.details?.roles || '').slice(0, 60));
