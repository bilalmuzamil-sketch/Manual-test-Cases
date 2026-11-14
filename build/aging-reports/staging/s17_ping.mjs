// s17_ping.mjs — is the QA lead's staging session still valid? (profile + permissions, GET only)
import { stgStart } from './stglib.mjs';
try { const s = await stgStart(new URL('./s17/', import.meta.url).pathname); console.log('session OK'); await s.close(); } catch (e) { console.log(String(e).slice(0, 200)); }
process.exit(0);
