import { chromium } from 'playwright';

const SERVER_MIME = JSON.parse(process.env.MIME_JSON);
const results = [];
const log = (k, v) => { results.push([k, v]); console.log(`${k}: ${v}`); };

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage();
page.on('console', m => { if (m.type() === 'error') console.log('  [page error]', m.text()); });
page.on('filechooser', () => {}); // swallow native picker so click() doesn't block

await page.goto('http://127.0.0.1:8099/harness.html');
await page.waitForFunction('window.__ready === true', { timeout: 20000 });
log('module loaded from real deployed bundle', 'YES');

// ---------- TEST A: what accept value actually lands on the input ----------
const accept = await page.evaluate(async (mime) => {
  const { pickAttachments } = window.__useNoteAttachmentPicker({ value: mime });
  pickAttachments();                       // creates + clicks the input
  await new Promise(r => setTimeout(r, 50));
  const el = document.querySelector('input[type=file]');
  return { accept: el?.getAttribute('accept'), multiple: el?.multiple, count: document.querySelectorAll('input[type=file]').length };
}, SERVER_MIME);
log('A. accept attribute on the live input', accept.accept);
log('A. multiple', accept.multiple);
log('A. contains heic/heif', /heic|heif/i.test(accept.accept || '') ? 'YES (BAD)' : 'NO (correct)');

// ---------- TEST B: change fires AFTER the 300ms focus window ----------
const slow = await page.evaluate(async (mime) => {
  document.querySelectorAll('input[type=file]').forEach(e => e.remove());
  const { pickAttachments } = window.__useNoteAttachmentPicker({ value: mime });
  const p = pickAttachments();
  await new Promise(r => setTimeout(r, 30));
  const el = document.querySelector('input[type=file]');
  window.dispatchEvent(new Event('focus'));          // user dismissed the picker
  await new Promise(r => setTimeout(r, 400));        // iOS still transcoding (>300ms)
  const dt = new DataTransfer();
  dt.items.add(new File(['photo-bytes'], 'IMG_0001.jpg', { type: 'image/jpeg' }));
  el.files = dt.files;
  el.dispatchEvent(new Event('change'));             // transcode finished, file arrives late
  const files = await p;
  return { n: files.length, names: files.map(f => f.name) };
}, SERVER_MIME);
log('B. delay 400ms > 300ms -> files returned', `${slow.n}  ${JSON.stringify(slow.names)}`);
log('B. VERDICT', slow.n === 0 ? 'PHOTO SILENTLY DROPPED — race is REAL' : 'file survived');

// ---------- TEST C: control, change fires INSIDE the window ----------
const fast = await page.evaluate(async (mime) => {
  document.querySelectorAll('input[type=file]').forEach(e => e.remove());
  const { pickAttachments } = window.__useNoteAttachmentPicker({ value: mime });
  const p = pickAttachments();
  await new Promise(r => setTimeout(r, 30));
  const el = document.querySelector('input[type=file]');
  window.dispatchEvent(new Event('focus'));
  await new Promise(r => setTimeout(r, 100));        // 100ms < 300ms
  const dt = new DataTransfer();
  dt.items.add(new File(['photo-bytes'], 'IMG_0002.jpg', { type: 'image/jpeg' }));
  el.files = dt.files;
  el.dispatchEvent(new Event('change'));
  const files = await p;
  return { n: files.length, names: files.map(f => f.name) };
}, SERVER_MIME);
log('C. delay 100ms < 300ms -> files returned', `${fast.n}  ${JSON.stringify(fast.names)}`);
log('C. VERDICT', fast.n === 1 ? 'file survived — so B is the timing window, not a broken harness' : 'UNEXPECTED');

// ---------- TEST D: would a .heic slip through the drag-and-drop validation? ----------
const dnd = await page.evaluate((mime) => {
  const mk = (n, t) => ({ name: n, type: t, size: 1000 });
  const withList = window.__partitionAttachments([mk('IMG_1.heic', 'image/heic'), mk('ok.jpg', 'image/jpeg')], mime);
  const emptyList = window.__partitionAttachments([mk('IMG_1.heic', 'image/heic')], []);
  return {
    withList: { accepted: withList.accepted.map(f => f.name), dropped: withList.dropped },
    emptyList: { accepted: emptyList.accepted.map(f => f.name), dropped: emptyList.dropped },
  };
}, SERVER_MIME);
log('D. drag-drop with the real server list', JSON.stringify(dnd.withList));
log('D. drag-drop if the list were EMPTY', JSON.stringify(dnd.emptyList));

await browser.close();
console.log('\n--- DONE ---');
