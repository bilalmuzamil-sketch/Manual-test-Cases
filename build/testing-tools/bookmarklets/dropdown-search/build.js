#!/usr/bin/env node
/*
 * Packs dropdown-search.js into a one-line bookmarklet.
 *   node build.js
 * Writes:
 *   bookmarklet.txt  - the javascript: URL to paste into a bookmark's URL field
 *   install.html     - open it in the browser and drag the button to the bookmarks bar
 * No dependencies. The source must use block comments only and explicit semicolons.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const dir = __dirname;
const src = fs.readFileSync(path.join(dir, 'dropdown-search.js'), 'utf8');

const packed = src
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .split('\n')
  .map((l) => l.trim())
  .filter(Boolean)
  .join(' ');

/* Fail the build if the packed code is not valid JavaScript. */
new vm.Script(packed);

const url = 'javascript:' + encodeURIComponent(packed);
fs.writeFileSync(path.join(dir, 'bookmarklet.txt'), url + '\n');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Dropdown Search Bookmarklet</title>
<style>
  body { font: 15px/1.5 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; max-width: 760px; margin: 32px auto; padding: 0 16px; color: #1f2328; background: #fff; }
  a.bm { display: inline-block; padding: 8px 16px; background: #1f6feb; color: #fff; border-radius: 6px; text-decoration: none; font-weight: 600; }
  textarea { width: 100%; height: 90px; font: 12px monospace; }
  kbd { border: 1px solid #8c959f; border-radius: 4px; padding: 0 4px; font-size: 12px; }
</style>
</head>
<body>
<h1>Dropdown Search bookmarklet</h1>
<p><strong>Install:</strong> show your bookmarks bar (<kbd>Ctrl</kbd>/<kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>B</kbd>), then drag this button onto it:</p>
<p><a class="bm" href="${esc(url)}">Dropdown search</a></p>
<p>Or create a bookmark by hand and paste this into its URL field:</p>
<textarea readonly onclick="this.select()">${esc(url)}</textarea>
<h2>Use</h2>
<ol>
  <li>On any page, click <em>Dropdown search</em> in the bookmarks bar. A search box opens at the top right.</li>
  <li>Type. Every matching option from the page's dropdowns is listed. Several words = all must match, in any order.</li>
  <li>For a custom dropdown (one that opens a pop-up list), open the dropdown first. The box searches it live and hides the options that do not match.</li>
  <li><kbd>&darr;</kbd>/<kbd>&uarr;</kbd> to move, <kbd>Enter</kbd> or a click to select, <kbd>Esc</kbd> to close. Drag the blue bar to move the box.</li>
</ol>
</body>
</html>
`;
fs.writeFileSync(path.join(dir, 'install.html'), html);
console.log(`bookmarklet: ${url.length} chars -> bookmarklet.txt, install.html`);
