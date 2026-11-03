import {prod} from '../common.mjs'; import fs from 'fs'; const s=await prod('/tmp/qa73'); const p=s.page; const ev=[];
p.on('request',r=>{ if(!/collect|sentry|touch/.test(r.url())) ev.push('REQ '+r.method()+' '+r.url().slice(0,160)); });
p.on('download',async d=>{ ev.push('DOWNLOAD '+d.suggestedFilename()); await d.saveAs('template.csv'); });
p.context().on('page',np=>ev.push('NEWPAGE '+np.url()));
await s.go('/administration/invoices-import'); await p.waitForTimeout(4000); ev.length=0;
await p.click('[data-test-id="button_download_template"]'); await p.waitForTimeout(8000);
console.log(ev.join('\n')); if(fs.existsSync('template.csv')) console.log('HEADER',fs.readFileSync('template.csv','utf8').split(/\r?\n/)[0]);
const href=await p.evaluate(()=>{const b=document.querySelector('[data-test-id="button_download_template"]'); return b?.getAttribute('href')||b?.closest('a')?.getAttribute('href');}); console.log('HREF',href);
await s.close(); process.exit(0);
