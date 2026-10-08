import {ob} from './lib.mjs'; import fs from 'fs';
const s=await ob(); const p=s.page; await s.go('/administration/inventory-import');
const [d]=await Promise.all([p.waitForEvent('download',{timeout:20000}).catch(()=>null), (async()=>{const b=await s.box('button_download_template'); await p.mouse.click(b.x,b.y);})()]);
if(d){ await d.saveAs('/tmp/qa9138/template.csv'); console.log(fs.readFileSync('/tmp/qa9138/template.csv','utf8').slice(0,800)); } else console.log('no download');
await s.close();
