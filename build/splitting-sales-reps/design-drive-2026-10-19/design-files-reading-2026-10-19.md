# Design files reading record — Splitting Sales Representatives (19 Oct 2026)

Rule 119 reading coverage for the design export `sources/design-2026-10-19-upload/Splitting_Sales_Representatives.html` (10,541,251 bytes, md5 `d26eb33095e3594ae78a305b0ac5df2d`, exported from Claude artifact https://claude.ai/artifact/8MHqwyffAYtqZ6EccS5RUm). Unpacked with `build/testing-tools/extract_artifact_canvas.py` (the doc JSON round-trips unchanged). No earlier export exists for this project, so there is nothing to diff against.

## What the export is

| Part of the 10.5 MB file | Bytes | What it is | How it was read |
|---|---|---|---|
| `<head>` style + README comment + metas | 1,520 + ~1,800 | canvas wrapper | read in full (README says the content is the `appifact-doc` files record) |
| `<style id="appifact-style">` | 484,974 | the Claude Design canvas EDITOR's own CSS (Omelette tokens) — not ShopView | scanned by script for every feature term (Sales Rep, Unassigned, Labor, Part Sale, Sales Type, Product Type, names, decision, Lucide, Tertiary, ShopView): **0 hits**. Not read line by line — see note below |
| `<script id="appifact-app">` | 1,988,038 | the canvas EDITOR's JavaScript runtime — not ShopView | same scan: 2 hits, both editor code comments ("Lucide/Feather" icon resize handles; a scroll "decision"). Not read line by line — see note below |
| `<script id="appifact-doc">` | 8,066,310 | **the design itself**: 70 embedded files | unpacked; every file below read / viewed |

> **Note for the QA lead (Rule 119):** the two editor-runtime blocks (2.47 MB) are Anthropic's canvas viewer, identical in every Claude design export, and hold no ShopView design content (script scan above). I did not read them line by line. If you want them read in full anyway, say so and I will; otherwise please confirm the skip.
>
> **22 Oct 2026:** the QA lead said "No you can read it now". Both blocks were then read in full, every line (`viewer-code/VIEWER-CODE-READING-SUMMARY-2026-10-22.md` and its three reading records): no ShopView content; nothing in them changes the board files or our text inventory.

## The 70 embedded design files

- `canvas.json` (36,001 bytes, 1,239 lines, md5 `b21d715ae99b9a04d64179544cf0be88`): **read in full** — 6 pages, 68 artboards (file, position, size, title), 74 notes (every note text transcribed into the text inventory), launch view.
- `favicon-32x32.png` (1,996 bytes): viewed; the ShopView favicon.
- 68 board files `*.dc.html`: each is the same 17-line template (doctype, `support.js`, `<title>`, a style giving the image size, one `<img alt="<title>" src="data:image/png;base64,…">`). Proven by script: all 68 normalise to one template hash `0414c1f9…`, one image each, title = alt (two titles contain quotes). **Every non-image line read in full; every image viewed (table below).**

## Every board image (68) — viewed

Legend for "Viewed": **full** = the whole 1600×1000 (or phone 780×1688, or export) image opened and read; **crop** = the changed region opened at native or 2× size after a pixel diff against the previous board proved everything outside it identical (diff method: `tools/` pixel diff, threshold 40/255, plus OCR word comparison of the right-hand panel — no new words outside the crop). Every board was also opened in the browser via the canvas Play view and screenshotted (`screens/pN-…png`).

| # | File | Bytes | md5 | Title | Viewed |
|---|---|---|---|---|---|
| 1 | `unpacked/png/card-00-b-wo-rest2.png` | 169,194 | `1e15f3ce35ee…` | 1.0 Before: the card today | full |
| 2 | `unpacked/png/card-01-b-wo-open.png` | 177,523 | `c62a6e1705e0…` | 1.1 Before: picking the rep today | full |
| 3 | `unpacked/png/card-02-n1-rest.png` | 67,404 | `c5f6de9ad04f…` | 1.2 Nobody assigned, at rest | full |
| 4 | `unpacked/png/card-03-n1-hover.png` | 67,550 | `ed5cd3a6ec11…` | 1.3 Hover: the box and the + | full |
| 5 | `unpacked/png/card-04-n1-list.png` | 66,464 | `b6559221740f…` | 1.4 The list: Unassigned first | full |
| 6 | `unpacked/png/card-05-n1-picked.png` | 67,894 | `359f5ba67aed…` | 1.5 One rep picked, at rest | full |
| 7 | `unpacked/png/card-06-n1-picked-hover.png` | 68,068 | `08c92b10d90f…` | 1.6 Hover: box, arrow and + | full |
| 8 | `unpacked/png/card-07-n1-add-tip.png` | 68,401 | `6da422fc9413…` | 1.7 Hover the + | crop (card / dialog region) + full Play screenshot |
| 9 | `unpacked/png/card-08-n1-add-menu.png` | 68,915 | `4e82a1cd2c32…` | 1.8 The + menu | crop (card / dialog region) + full Play screenshot |
| 10 | `unpacked/png/card-09-n1-added.png` | 68,435 | `d36ffbb1b23d…` | 1.9 Parts added: both rows copy Becky | full |
| 11 | `unpacked/png/card-10-n1-added-hover.png` | 68,784 | `0f9e7f72ac9d…` | 1.10 Hover: two rows | crop (card / dialog region) + full Play screenshot |
| 12 | `unpacked/png/card-11-n1-labor-list.png` | 67,530 | `abee3a5b76c5…` | 1.11 Labor: pick who sold the labor | crop (card / dialog region) + full Play screenshot |
| 13 | `unpacked/png/card-12-n1-two.png` | 68,243 | `b1b65cd9faef…` | 1.12 Two reps | crop (card / dialog region) + full Play screenshot |
| 14 | `unpacked/png/card-13-n1-remove-tip.png` | 69,284 | `079fd331ce00…` | 1.13 Hover the remove x | crop (card / dialog region) + full Play screenshot |
| 15 | `unpacked/png/card-14-n1-removed.png` | 67,840 | `25307968b29c…` | 1.14 Parts removed: the Labor person stays | crop (card / dialog region) + full Play screenshot |
| 16 | `unpacked/png/card-15-n1-unassign-list.png` | 66,922 | `db5c11f2fc26…` | 1.15 Clearing: pick Unassigned | crop (card / dialog region) + full Play screenshot |
| 17 | `unpacked/png/card-16-n1-cleared.png` | 67,755 | `956155cbfa3e…` | 1.16 Cleared: Unassigned | crop (card / dialog region) + full Play screenshot |
| 18 | `unpacked/png/card-17-n1-invoiced.png` | 50,061 | `b1e3346e2d6a…` | 1.17 After invoicing: read only | full |
| 19 | `unpacked/png/card-18-b-audit.png` | 198,437 | `bbd0cca8fe3e…` | 1.18 Before: the Work Order Log today | full |
| 20 | `unpacked/png/card-19-n1-audit.png` | 96,819 | `104f8a2e6191…` | 1.19 The log records every rep change | full |
| 21 | `unpacked/png/customer-00-b-customer-page.png` | 70,644 | `029b846ee78e…` | 2.0 Before: the customer page today | full |
| 22 | `unpacked/png/customer-01-b-customer-dialog-open.png` | 92,796 | `a7d008c30fa5…` | 2.1 Before: Edit Customer today | full |
| 23 | `unpacked/png/customer-02-b-new.png` | 120,632 | `a4c004bde090…` | 2.2 Before: New Customer today | full |
| 24 | `unpacked/png/customer-03-n2-edit.png` | 72,963 | `6d01231315dd…` | 2.3 Edit Customer: one field and the + | full |
| 25 | `unpacked/png/customer-04-n2-edit-list.png` | 70,868 | `4ea8ced9b553…` | 2.4 The list: Unassigned first | crop (card / dialog region) + full Play screenshot |
| 26 | `unpacked/png/customer-05-n2-edit-picked.png` | 73,161 | `da173d723548…` | 2.5 One rep picked | crop (card / dialog region) + full Play screenshot |
| 27 | `unpacked/png/customer-06-n2-add-tip.png` | 73,753 | `9ecd1b78c99b…` | 2.6 Hover the + | crop (card / dialog region) + full Play screenshot |
| 28 | `unpacked/png/customer-07-n2-add-menu.png` | 75,075 | `00aa5ae19298…` | 2.7 The + menu: two options | crop (card / dialog region) + full Play screenshot |
| 29 | `unpacked/png/customer-08-n2-service-parts.png` | 73,898 | `caa16aeb31e1…` | 2.8 Service Parts added | crop (card / dialog region) + full Play screenshot |
| 30 | `unpacked/png/customer-09-n2-add-menu-2.png` | 75,148 | `6b784ed6d5af…` | 2.9 The + menu now offers Part Sales only | crop (card / dialog region) + full Play screenshot |
| 31 | `unpacked/png/customer-10-n2-three-added.png` | 74,514 | `95e69f7bf598…` | 2.10 Part Sales added: three rows | crop (card / dialog region) + full Play screenshot |
| 32 | `unpacked/png/customer-11-n2-ps-list.png` | 71,709 | `07be1a585cf0…` | 2.11 The Part Sales list | crop (card / dialog region) + full Play screenshot |
| 33 | `unpacked/png/customer-12-n2-three.png` | 74,023 | `d82a733234f3…` | 2.12 Three different people | crop (card / dialog region) + full Play screenshot |
| 34 | `unpacked/png/customer-13-n2-remove-tip.png` | 74,625 | `c14863195712…` | 2.13 Hover the remove x | crop (card / dialog region) + full Play screenshot |
| 35 | `unpacked/png/customer-14-n2-ps-only.png` | 73,503 | `0f62fab8b4db…` | 2.14 Part Sales without Service Parts | crop (card / dialog region) + full Play screenshot |
| 36 | `unpacked/png/customer-15-n2-page-three.png` | 92,468 | `7b504e4eb586…` | 2.15 The customer page reads every row | full |
| 37 | `unpacked/png/customer-16-n2-new.png` | 52,772 | `27c7835a9d17…` | 2.16 New Customer: the same field | full |
| 38 | `unpacked/png/customer-17-n2-new-menu.png` | 55,124 | `1a0c3877fbf1…` | 2.17 New Customer: the + menu | crop (card / dialog region) + full Play screenshot |
| 39 | `unpacked/png/customer-18-n2-new-ps.png` | 54,804 | `dec25f2f6e10…` | 2.18 New Customer with a Part Sales rep | crop (card / dialog region) + full Play screenshot |
| 40 | `unpacked/png/partsale-00-b-ps.png` | 142,865 | `4a6bade79822…` | 3.0 Before: a part sale today | full |
| 41 | `unpacked/png/partsale-01-n3-rest.png` | 41,683 | `00c0aa51ab79…` | 3.1 The Sales Representative field | full |
| 42 | `unpacked/png/partsale-02-n3-hover.png` | 41,749 | `357566858101…` | 3.2 Hover | crop (card / dialog region) + full Play screenshot |
| 43 | `unpacked/png/partsale-03-n3-list.png` | 40,680 | `1ec2e3f185bb…` | 3.3 The list | crop (card / dialog region) + full Play screenshot |
| 44 | `unpacked/png/partsale-04-n3-picked-hover.png` | 41,785 | `9696dbb3eace…` | 3.4 A rep picked, hovered | crop (card / dialog region) + full Play screenshot |
| 45 | `unpacked/png/phone-00-b-phone-details.png` | 108,960 | `d2bdfa695afe…` | 6.0 Before: the details panel today | full (2× image, contact sheet) |
| 46 | `unpacked/png/phone-01-b-phone-open.png` | 91,275 | `793399480778…` | 6.1 Before: picking the rep today | full (2× image, contact sheet) |
| 47 | `unpacked/png/phone-02-n6-field.png` | 39,911 | `325a1cb45fbe…` | 6.2 The field on a phone | full (2× image, contact sheet) |
| 48 | `unpacked/png/phone-03-n6-list.png` | 38,615 | `2c43d593bb07…` | 6.3 Tap: the list | full (2× image, contact sheet) |
| 49 | `unpacked/png/phone-04-n6-picked.png` | 41,739 | `9c4cad552434…` | 6.4 One rep picked | full (2× image, contact sheet) |
| 50 | `unpacked/png/phone-05-n6-add-menu.png` | 44,185 | `8d2d9e6323bd…` | 6.5 Tap the + | full (2× image, contact sheet) |
| 51 | `unpacked/png/phone-06-n6-added.png` | 42,014 | `58f8d07a9809…` | 6.6 Parts added | full (2× image, contact sheet) |
| 52 | `unpacked/png/phone-07-n6-parts-list.png` | 40,448 | `ce996a408a2a…` | 6.7 Parts list on a phone | full (2× image, contact sheet) |
| 53 | `unpacked/png/sbc-00-b-sbc-filter.png` | 108,904 | `92749bd7d07f…` | 5.0 Before: "Product Type" | full |
| 54 | `unpacked/png/sbc-01-n5-sbc.png` | 85,751 | `daa4f31bb4eb…` | 5.1 After: "Sales Type" | full |
| 55 | `unpacked/png/sbc-02-n5-sbc-open.png` | 87,983 | `dba741b11bdb…` | 5.2 After: the filter open | full |
| 56 | `unpacked/png/sbr-00-b-sbr.png` | 113,739 | `3630fa12cd7a…` | 4.0 Before: the report today | full |
| 57 | `unpacked/png/sbr-01-b-sbr-filter.png` | 109,251 | `689deeb7ef19…` | 4.1 Before: the Product Type filter | full |
| 58 | `unpacked/png/sbr-02-b-sbr-columns.png` | 121,169 | `a29ba936068a…` | 4.2 Before: the column picker | full |
| 59 | `unpacked/png/sbr-03-b-sbr-expanded.png` | 246,165 | `0a0ebe6fc9e5…` | 4.3 Before: expanded | full |
| 60 | `unpacked/png/sbr-04-a4-sbr-c.png` | 105,256 | `dbcd1e75c2e3…` | 4.4 One row per rep | full |
| 61 | `unpacked/png/sbr-05-a4-sbr-expanded.png` | 148,148 | `cce1cdfaf7a1…` | 4.5 Expanded: Sales Type column off | full |
| 62 | `unpacked/png/sbr-06-a4-filter-open.png` | 155,394 | `c3bb7bd19583…` | 4.6 The Sales Type filter | full |
| 63 | `unpacked/png/sbr-07-a4-sbr-labor-only.png` | 105,044 | `024972f78f2d…` | 4.7 Labor only | full |
| 64 | `unpacked/png/sbr-08-a4-columns-off.png` | 160,440 | `7b70b396a7db…` | 4.8 The column picker | full |
| 65 | `unpacked/png/sbr-09-a4-columns-on.png` | 163,567 | `3214213ab70f…` | 4.9 Sales Type switched on | full |
| 66 | `unpacked/png/sbr-10-a4-sbr-expanded-type.png` | 150,813 | `6d68ea6762cf…` | 4.10 Expanded with Sales Type | full |
| 67 | `unpacked/png/sbr-11-a4-export-csv.png` | 116,462 | `13628e59699a…` | 4.11 Expanded export (CSV) | full |
| 68 | `unpacked/png/sbr-12-a4-export-pdf-crop-1.png` | 121,148 | `dc70bf1e9058…` | 4.12 Expanded export (PDF) | full |

## Board source files (68 .dc.html)

| File | Bytes | md5 |
|---|---|---|
| `unpacked/files/canvas.json` | 36,001 | `b21d715ae99b9a04d64179544cf0be88` |
| `unpacked/files/card-00-b-wo-rest2.dc.html` | 225,988 | `77a55b2632e4134e3cfc75841cbbfd57` |
| `unpacked/files/card-01-b-wo-open.dc.html` | 237,110 | `57373f6bad87dd6f7e20534fa59db65e` |
| `unpacked/files/card-02-n1-rest.dc.html` | 90,272 | `458951b850b9960a8963ea26264609ef` |
| `unpacked/files/card-03-n1-hover.dc.html` | 90,468 | `f1e2b9715a893ea80238618919c5235f` |
| `unpacked/files/card-04-n1-list.dc.html` | 89,024 | `7f36fa2f31cf637a7397f4c3efe99ef3` |
| `unpacked/files/card-05-n1-picked.dc.html` | 90,926 | `8dbfe594e34bb00b1d785d043a46b911` |
| `unpacked/files/card-06-n1-picked-hover.dc.html` | 91,158 | `fbec2fb2717b58a64c8e8e8ee1099aa0` |
| `unpacked/files/card-07-n1-add-tip.dc.html` | 91,578 | `8ed3306f01e83bba6c42c66beb1adf98` |
| `unpacked/files/card-08-n1-add-menu.dc.html` | 92,260 | `5e4866867143a261f89fe9f5a01ec29f` |
| `unpacked/files/card-09-n1-added.dc.html` | 91,666 | `5c8493779c2be0b6899a233e2fb6557a` |
| `unpacked/files/card-10-n1-added-hover.dc.html` | 92,096 | `a7dc65b42fc35215ef0de4b0845d7fa1` |
| `unpacked/files/card-11-n1-labor-list.dc.html` | 90,454 | `88742ef0f271cf2820f46708dd673fb6` |
| `unpacked/files/card-12-n1-two.dc.html` | 91,362 | `2cdef841bb80978e93e36b88dac64aae` |
| `unpacked/files/card-13-n1-remove-tip.dc.html` | 92,770 | `94f02b321322b8c8b655bb2ea5095191` |
| `unpacked/files/card-14-n1-removed.dc.html` | 90,884 | `8ebc0922a33fc59585bfc23644923c60` |
| `unpacked/files/card-15-n1-unassign-list.dc.html` | 89,636 | `0d524177b068f9162c7de99eb73f3ef5` |
| `unpacked/files/card-16-n1-cleared.dc.html` | 90,732 | `fed56cbb77a608815a4d3fd2c8a3577d` |
| `unpacked/files/card-17-n1-invoiced.dc.html` | 67,154 | `0fd503003756571b49f55009f08dee00` |
| `unpacked/files/card-18-b-audit.dc.html` | 265,002 | `5c1d838665e929f2a246c4a12a66d8b1` |
| `unpacked/files/card-19-n1-audit.dc.html` | 129,510 | `1474c31b8520d9891fb8ae6f6079a980` |
| `unpacked/files/customer-00-b-customer-page.dc.html` | 94,606 | `3d6242faf55e15a1ef94b6945b224fed` |
| `unpacked/files/customer-01-b-customer-dialog-open.dc.html` | 124,134 | `7dfb23833235ed67d7dd819d7fdcc4a9` |
| `unpacked/files/customer-02-b-new.dc.html` | 161,248 | `a1ca85a66c107116f3c2f544bdbffa1e` |
| `unpacked/files/customer-03-n2-edit.dc.html` | 97,704 | `73b56c4817c7438dc10846eb1fb6186a` |
| `unpacked/files/customer-04-n2-edit-list.dc.html` | 94,896 | `0788b308f3ab92e1b03777f81d292f3d` |
| `unpacked/files/customer-05-n2-edit-picked.dc.html` | 97,928 | `535806cffe6004153078c62788462e52` |
| `unpacked/files/customer-06-n2-add-tip.dc.html` | 98,714 | `9c0c02dab1779b286c9c9604fb8ee340` |
| `unpacked/files/customer-07-n2-add-menu.dc.html` | 100,498 | `29f2c47a487e6a19ff0c0e0992342e11` |
| `unpacked/files/customer-08-n2-service-parts.dc.html` | 98,922 | `b61235c4486e59695f419c597d76573c` |
| `unpacked/files/customer-09-n2-add-menu-2.dc.html` | 100,626 | `df4c7f115e5187738675d7bc53e1e89e` |
| `unpacked/files/customer-10-n2-three-added.dc.html` | 99,762 | `8fe83e2526a5ea903ad64e4c600c79e5` |
| `unpacked/files/customer-11-n2-ps-list.dc.html` | 96,004 | `576eae3d679a77feea8ccb54e17a2521` |
| `unpacked/files/customer-12-n2-three.dc.html` | 99,098 | `0e33d39de0fd7a31f55d168f955b1fbd` |
| `unpacked/files/customer-13-n2-remove-tip.dc.html` | 99,890 | `e3901de3cf4139c6f333c57ab12434ac` |
| `unpacked/files/customer-14-n2-ps-only.dc.html` | 98,422 | `826e525153f1ed1586dac472a6f3c401` |
| `unpacked/files/customer-15-n2-page-three.dc.html` | 123,712 | `dddcf199729ffc2bd508437bbc09d6e0` |
| `unpacked/files/customer-16-n2-new.dc.html` | 70,774 | `1cd7094544046f30331c8e8e9fd9e449` |
| `unpacked/files/customer-17-n2-new-menu.dc.html` | 73,902 | `167e73fb61cc21909606b81d347dce17` |
| `unpacked/files/customer-18-n2-new-ps.dc.html` | 73,494 | `62b39a295471b2adb8beed3ceb374bd2` |
| `unpacked/files/favicon-32x32.png` | 1,996 | `d1242f90916bdcde677dd294f430f7b3` |
| `unpacked/files/partsale-00-b-ps.dc.html` | 190,890 | `dd99a0e25c74d305d21522137827559f` |
| `unpacked/files/partsale-01-n3-rest.dc.html` | 55,992 | `639cf5f953b9eda60a864e8620ec0261` |
| `unpacked/files/partsale-02-n3-hover.dc.html` | 56,030 | `3d26a48778219ca5562d9883f9d80bfc` |
| `unpacked/files/partsale-03-n3-list.dc.html` | 54,608 | `99d7bb9a4ed4aa2dfaf4ef529ed29169` |
| `unpacked/files/partsale-04-n3-picked-hover.dc.html` | 56,110 | `e96cc01b0b5e1c999de214c1ac6c3cdc` |
| `unpacked/files/phone-00-b-phone-details.dc.html` | 145,692 | `b5085fe82f6e234026308cfa07589369` |
| `unpacked/files/phone-01-b-phone-open.dc.html` | 122,108 | `5b31b719be82765bfdb32c2f195f048e` |
| `unpacked/files/phone-02-n6-field.dc.html` | 53,606 | `047ce22e1363320969f3612b93713ca0` |
| `unpacked/files/phone-03-n6-list.dc.html` | 51,864 | `25e7a33198104c2ee9d8fc4d7abf4036` |
| `unpacked/files/phone-04-n6-picked.dc.html` | 56,030 | `bd8f1aacf9c6af8134c49f2abb44a023` |
| `unpacked/files/phone-05-n6-add-menu.dc.html` | 59,284 | `b010ec8d897b6b807dbf8af0e47ec727` |
| `unpacked/files/phone-06-n6-added.dc.html` | 56,392 | `5c452909ecc08a5e4446f0083e16b583` |
| `unpacked/files/phone-07-n6-parts-list.dc.html` | 54,324 | `7d2f1220fffca87aba15a5d7d2381763` |
| `unpacked/files/sbc-00-b-sbc-filter.dc.html` | 145,604 | `6ddf3346edeff7fa97e18326c083ec0b` |
| `unpacked/files/sbc-01-n5-sbc.dc.html` | 114,726 | `2ba77b3a60dffa68f0d61cc33ea880ab` |
| `unpacked/files/sbc-02-n5-sbc-open.dc.html` | 117,708 | `2dc9b7f718ac0f20409e39b7773f2ae8` |
| `unpacked/files/sbr-00-b-sbr.dc.html` | 152,052 | `809b9ca331ef642a82afbcf01f78f2c5` |
| `unpacked/files/sbr-01-b-sbr-filter.dc.html` | 146,082 | `6a095f74c5acfe553d020a8109552801` |
| `unpacked/files/sbr-02-b-sbr-columns.dc.html` | 161,962 | `5c654f8808c3054aacee3e6d01e7ca0d` |
| `unpacked/files/sbr-03-b-sbr-expanded.dc.html` | 328,604 | `a56d1c3423f2fd001a4f503ddb8c76a0` |
| `unpacked/files/sbr-04-a4-sbr-c.dc.html` | 140,725 | `1d6fb0407f6be14e2216f737ec9ffdfa` |
| `unpacked/files/sbr-05-a4-sbr-expanded.dc.html` | 197,946 | `886a7dbdd12531306415309aad8c0621` |
| `unpacked/files/sbr-06-a4-filter-open.dc.html` | 207,586 | `1091fb1fa85e3b8d432689da93cb6f52` |
| `unpacked/files/sbr-07-a4-sbr-labor-only.dc.html` | 140,432 | `e59cdff420583644496a5b603f3d25de` |
| `unpacked/files/sbr-08-a4-columns-off.dc.html` | 214,306 | `e0fbd3c7f1f57ed40af2fc1dc5c58d47` |
| `unpacked/files/sbr-09-a4-columns-on.dc.html` | 218,488 | `c32d98d4558c56b9ada6366a1c388534` |
| `unpacked/files/sbr-10-a4-sbr-expanded-type.dc.html` | 201,486 | `0fa305c664aaba282333ae34336b002b` |
| `unpacked/files/sbr-11-a4-export-csv.dc.html` | 155,679 | `e11f97f9fb50f33b34e76ed39ec037c3` |
| `unpacked/files/sbr-12-a4-export-pdf-crop-1.dc.html` | 161,927 | `6765c5aeb95d304b6d0e312c6bf7d6be` |

## Other sources read for this review

| Source | Size | Lines | Coverage |
|---|---|---|---|
| `sources/CONFLUENCE-919928833-v8-2026-10-19.txt` (PRD v8, 14 Oct 2026) | 42,356 bytes | 315 | lines 1–315, 100% |
| `build/skills/21-DESIGN-DRIVE-PROTOCOL.md` | 7,842 bytes | all | 100% |
| `build/LESSONS-REGISTER.md` | 1,545 bytes | all | 100% |
| `WORKER-BRIEF.md` | 6,627 bytes | all | 100% |
| Tech plan | 278,939 bytes | — | **not read by this worker** (not part of the design-drive task); grepped once only to check whether the design's "decision NN" numbers appear there (they do not) |

