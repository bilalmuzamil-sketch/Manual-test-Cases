// Pixel difference of two PNG pictures (bounding box of changed pixels), drawn in Chromium (no Pillow in this container).
// node tools/imgdiff.js a.png b.png
const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const [a, b] = process.argv.slice(2).map(f => 'data:image/png;base64,' + fs.readFileSync(f).toString('base64'));
  const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }); const p = await br.newPage();
  const r = await p.evaluate(async ([a, b]) => {
    const load = s => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = s; });
    const [A, B] = await Promise.all([load(a), load(b)]);
    if (A.width !== B.width || A.height !== B.height) return { size: [A.width, A.height, B.width, B.height] };
    const c = document.createElement('canvas'); c.width = A.width; c.height = A.height; const x = c.getContext('2d');
    x.drawImage(A, 0, 0); const da = x.getImageData(0, 0, A.width, A.height).data; x.drawImage(B, 0, 0); const db = x.getImageData(0, 0, A.width, A.height).data;
    let n = 0, x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
    for (let i = 0; i < da.length; i += 4) if (Math.abs(da[i] - db[i]) + Math.abs(da[i + 1] - db[i + 1]) + Math.abs(da[i + 2] - db[i + 2]) > 30) { n++; const px = (i / 4) % A.width, py = Math.floor(i / 4 / A.width); x0 = Math.min(x0, px); y0 = Math.min(y0, py); x1 = Math.max(x1, px); y1 = Math.max(y1, py); }
    return { changedPixels: n, box: n ? [x0, y0, x1, y1] : null };
  }, [a, b]);
  console.log(JSON.stringify(r)); await br.close();
})();
