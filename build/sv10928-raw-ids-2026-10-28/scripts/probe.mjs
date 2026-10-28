import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env,method,path,body]=process.argv.slice(2);
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa24'),user:'bilal.muzamil@shopview.com'});
await s.go('/workorders'); await s.page.waitForTimeout(2500);
const r=await s.api(path, method==='GET'?null:{method,headers:{'content-type':'application/json'},body:body||'{}'}); if(process.env.OUT) fs.writeFileSync(process.env.OUT,JSON.stringify(r.json||r.text)); console.log(r.status, JSON.stringify(r.json||r.text).slice(0,1500)); await s.close();
