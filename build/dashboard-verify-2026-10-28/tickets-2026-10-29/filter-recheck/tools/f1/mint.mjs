import { login } from '/home/user/Manual-test-Cases/build/testing-tools/staging-admin.mjs';
import fs from 'fs';
const t = await login('admin');
fs.writeFileSync('/tmp/cln/f1/sess.txt', t.sessCookie, { mode: 0o600 });
console.log('status', t.status, 'user', t.data?.details?.first_name, t.data?.details?.last_name, 'role', JSON.stringify(t.data?.details?.roles || t.data?.roles || '').slice(0,80));
