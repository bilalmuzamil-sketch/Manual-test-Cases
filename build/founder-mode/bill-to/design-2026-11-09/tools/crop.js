// Crop and zoom regions of the design screenshots for reading small text: node tools/crop.js <out.png> <scale> <shot> <x> <y> <w> <h> [<shot> <x> <y> <w> <h> ...]
// Several crops are stacked vertically in one output picture, each labelled with its file name and box.
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const [,, OUT, SCALE, ...rest] = process.argv; const s = parseFloat(SCALE); const crops = [];
for (let i = 0; i < rest.length; i += 5) crops.push({ f: rest[i], x: +rest[i+1], y: +rest[i+2], w: +rest[i+3], h: +rest[i+4] });
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const W = Math.max(...crops.map(c => c.w)) * s + 20;
  const html = '<body style="margin:0;background:#ddd;font:12px sans-serif">' + crops.map(c => {
    const src = 'file://' + path.resolve('files/project/shots', c.f);
    return `<div style="padding:4px 10px">${c.f} [${c.x},${c.y},${c.w}x${c.h}]</div><div style="margin:0 10px 8px;width:${c.w*s}px;height:${c.h*s}px;background:url('${src}') -${c.x*s}px -${c.y*s}px / auto no-repeat;background-size:auto;overflow:hidden;position:relative"><img src="${src}" style="position:absolute;left:-${c.x*s}px;top:-${c.y*s}px;transform-origin:0 0;image-rendering:auto;width:auto" onload="this.style.width=(this.naturalWidth*${s})+'px'"></div>`; }).join('') + '</body>';
  const p = await b.newPage({ viewport: { width: Math.ceil(W), height: 200 } });
  const tmp = path.resolve('crops', '_crop.html'); fs.writeFileSync(tmp, html);
  await p.goto('file://' + tmp); await p.waitForTimeout(300);
  await p.screenshot({ path: OUT, fullPage: true }); fs.unlinkSync(tmp); await b.close();
})();
