import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env,tag,path,name]=process.argv.slice(2); const S=JSON.parse(fs.readFileSync(`/tmp/s11744/seed-${env}-${tag}.json`,'utf8'));
const cookies=JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8'));
const s=await open({env,ticket:'11744',cookies,dir:(process.env.QA_DIR||'/tmp/qa23'),user:'bilal.muzamil@shopview.com'}); const p=s.page;
await s.go(path.replace('{cid}',S.cid)); await p.waitForTimeout(3500);
await p.screenshot({path:`/tmp/s11744/${env}-${tag}/${name}.png`}); console.log('marker',JSON.stringify(await s.marker?.()||null)); await s.close();
