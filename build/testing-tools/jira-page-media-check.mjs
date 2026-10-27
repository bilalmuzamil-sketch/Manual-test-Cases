// usage: node jira-page-media-check.mjs <KEY> <commentId> [out.png]
// Opens the Jira comment in a real browser (Atlassian cookies from /tmp/atlassian/cookies.txt), scrolls to its
// "Screen recording" heading and reports the video player(s) Jira rendered, with a screenshot. Read-only.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js'; const {chromium}=pkg; import fs from 'fs';
import {port as bridgePort} from './qa-session.mjs';
const [KEY,CID,OUT='/tmp/qa/jira-'+(process.argv[2]||'x')+'-'+(process.argv[3]||'x')+'.png']=process.argv.slice(2);
if(!KEY||!CID){ console.error('usage: node jira-page-media-check.mjs <KEY> <commentId> [out.png]'); process.exit(2); }
fs.mkdirSync('/tmp/qa',{recursive:true}); const port=bridgePort('/tmp/qa');
const cookies=fs.readFileSync('/tmp/atlassian/cookies.txt','utf8').split('\n').filter(l=>l.trim()&&(!l.startsWith('#')||l.startsWith('#HttpOnly_'))).map(l=>{const f=l.split('\t'); let d=f[0]; const ho=d.startsWith('#HttpOnly_'); if(ho) d=d.slice(10); return {name:f[5],value:(f[6]||'').trim(),domain:d,path:f[2],secure:f[3]==='TRUE',httpOnly:ho};}).filter(c=>c.name);
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--proxy-server=http://127.0.0.1:'+port,'--ignore-certificate-errors','--no-sandbox','--ssl-version-max=tls1.2']});
const ctx=await b.newContext({viewport:{width:1600,height:1000},ignoreHTTPSErrors:true}); await ctx.addCookies(cookies); const p=await ctx.newPage();
await p.goto('https://shopview.atlassian.net/browse/'+KEY+'?focusedCommentId='+CID+'',{waitUntil:'domcontentloaded',timeout:120000}); await p.waitForTimeout(18000);
for(let i=0;i<40;i++){ const found=await p.evaluate(()=>{const t=[...document.querySelectorAll('h3')].find(h=>/Screen recording/.test(h.innerText)); if(t){t.scrollIntoView({block:'start'}); return true;} window.scrollBy(0,600); document.querySelectorAll('*').forEach(e=>{if(e.scrollHeight>e.clientHeight+50&&getComputedStyle(e).overflowY.match(/auto|scroll/)) e.scrollTop+=600;}); return false;}); await p.waitForTimeout(1200); if(found){ await p.waitForTimeout(5000); break;} }
const r=await p.evaluate(async(CID)=>{const c=document.querySelector('[data-testid*="comment"][id*="'+CID+'"], #comment-'+CID)||document; const v=[...document.querySelectorAll('[data-testid="media-card-inline-player"],video[data-testid="media-video-element"],[data-testid="media-card-play-button-wrapper"]')].map(e=>{const r=e.getBoundingClientRect();return {tid:e.getAttribute('data-testid'),w:Math.round(r.width),h:Math.round(r.height)};}); const el=document.querySelector('[data-testid="media-card-play-button-wrapper"],[data-testid="media-card-inline-player"]');  return v;},CID);
console.log(JSON.stringify(r)); await p.screenshot({path:OUT}); await b.close();
