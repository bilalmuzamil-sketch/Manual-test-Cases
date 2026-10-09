/**
 * ONE PROFILE PER ENVIRONMENT (2026-10-09, QA lead: "make sure that you do not have to rediscover any path or anything
 * again when you retest this FULL suite again on any other branch ... staging or production").
 * Everything that differs between environments lives here and nowhere else:
 *   app address (GS_APP), API address, saved-session file, organisation id, the two locations the suite uses.
 * profiles/<host>.json is written once by discover-profile.mts; the sv10043 values are the defaults so the
 * current branch keeps working unchanged. Secrets never live here (cookies stay in /tmp).
 */
import fs from 'node:fs';
import path from 'node:path';
const here = path.dirname(new URL(import.meta.url).pathname);
export const APP = (process.env.GS_APP || 'https://sv10043.qa.shopview.com').replace(/\/$/, '');
export const HOST = new URL(APP).host;                       // e.g. sv10043.qa.shopview.com
const KEY = HOST.split('.')[0];                               // e.g. sv10043
// API address: QA branches serve it at <branch>api.qa.shopview.com; any other environment sets WOB_API or its profile
const derivedApi = /\.qa\.shopview\.com$/.test(HOST) ? `https://${KEY}api.${HOST.slice(KEY.length + 1)}` : '';
const file = path.join(here, 'profiles', `${HOST}.json`);
const saved: any = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
const SV10043 = { org: 'd55bc308-e61a-438d-b5f1-c7a73c89d49f', heavy: 'b3c8c820-f815-4cf1-8938-10956c5ee71a', leth: 'f8a8b802-7780-4b16-bf10-343caeb616b2' };
const base: any = HOST === 'sv10043.qa.shopview.com' ? SV10043 : {};
export const API = (process.env.WOB_API || saved.api || derivedApi).replace(/\/$/, '');
export const STATE = `/tmp/shopview/${KEY}-state.json`;
export const ORG: string = process.env.WOB_ORG || saved.org || base.org || '';
export const HEAVY: string = process.env.WOB_LOC1 || saved.heavy || base.heavy || '';
export const LETH: string = process.env.WOB_LOC2 || saved.leth || base.leth || '';
export const PROFILE_FILE = file;
