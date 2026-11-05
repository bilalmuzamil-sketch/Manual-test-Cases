// usage: node woshot.mjs <tag> <outname>
import {sess} from './common.mjs'; import fs from 'fs';
const [TAG,NAME]=process.argv.slice(2); const S=JSON.parse(fs.readFileSync(`/tmp/sv12048/wo-${TAG}.json`,'utf8')); const s=await sess({dpr:1}); const p=s.page;
await s.go('/workorders/'+S.wo+'/lines'); await p.waitForTimeout(4500);
await p.screenshot({path:`../ev/${NAME}.png`}); console.log((await p.locator('body').innerText()).replace(/\n+/g,' | ').slice(0,1500)); await s.close(); process.exit(0);
