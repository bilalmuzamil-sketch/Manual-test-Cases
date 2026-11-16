// Mint one private quick-login (admin) session per lane for the 16 Nov re-run. SECRET-FREE: writes cookie strings to /tmp/cln/rg16 (chmod 600), prints only status.
import fs from 'fs';
import { login } from '/home/user/Manual-test-Cases/build/testing-tools/staging-admin.mjs';
const files = process.argv.slice(2).length ? process.argv.slice(2) : ['/tmp/cln/rg16/sess-admin.txt', '/tmp/cln/rg16/w1/sess-w1.txt', '/tmp/cln/rg16/w2/sess-w2.txt', '/tmp/cln/rg16/w3/sess-admin.txt', '/tmp/cln/rg16/w4/sess-w4.txt', '/tmp/cln/rg16/scr/sess.txt'];
for (const f of files) {
  const t = await login('admin');
  fs.mkdirSync(f.replace(/\/[^/]+$/, ''), { recursive: true, mode: 0o700 });
  fs.writeFileSync(f, t.sessCookie, { mode: 0o600 });
  console.log(f.replace(/.*rg16\//, ''), 'login', t.status);
}
