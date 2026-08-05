# Sales By Representative: four columns are missing from the Summary spreadsheet download

**Summary line for Jira:** `Sales By Representative Summary spreadsheet is missing four columns the screen shows, and adds a Totals row`

| Field | Value |
|---|---|
| Type | Bug |
| Priority | **Low** |
| Severity | Medium |
| Product Area | Reports & Dashboards |
| Parent | **SV-8582** (the epic) |
| Links | **Relates** → SV-8631 (Sales By Representative, the downloads story) |
| Labels | `reports-suite`, `qa-found` |

---

## 1 · Description

The Sales By Representative report can be downloaded as a spreadsheet in a short "Summary" version.

That spreadsheet is **missing four of the columns the report is built on**:

- **# Invoices** — how many invoices the representative wrote
- **# Customers** — how many different customers they sold to
- **Hrs Worked**
- **Hrs Invoiced**

**The figures are not missing from the product** — the report has them and can show them. It is only
the downloaded file that leaves them out. So this reads as an unfinished download rather than missing
data.

**Why it matters:** these are the counting columns. Somebody working out how many jobs or how many
customers a representative handled has to go back to the screen and copy the numbers by hand, which
is exactly what the download exists to avoid. The product owner's words when he was shown this were:
**"on-screen should match download"**.

**One more thing in the same file:** the spreadsheet also **ends with a Totals row**, which the
written description says the Summary version should not have.

---

## 2 · Branch / Environment

| | |
|---|---|
| Application | `https://sv8582.qa.shopview.com` |
| API host | `https://sv8582api.qa.shopview.com` |
| Build marker (`<meta name="app-version">`) | **`v3.4.1-0ed4433`** |
| Observed on | **2026-08-03** |
| Organisation | Staging Foothills Group Inc |
| Location selection | **All locations** (the default) |
| Signed in as | `admin@shopview.com` (Administrator) |
| Date range | **This Month** (the report's own default) |

---

## 3 · Steps to reproduce

1. Sign in as `admin@shopview.com` (Administrator) at `https://sv8582.qa.shopview.com`.
2. Open **Reports → Sales By Representative**.
3. Leave every control at its default: date range **This Month**, **Product Type** = *Parts &
   Service*, **Invoice Status** = *All Statuses*, **Location** = *All locations*.
4. Read the column headings across the top of the report and note that **# Invoices**, **#
   Customers**, **Hrs Worked** and **Hrs Invoiced** are among them.
5. Open the three-dot menu in the toolbar and choose **Download Summary (CSV)**.
6. Open the downloaded file in a plain-text editor — not a spreadsheet application, so you see the
   real first line — and read the heading row.
7. Compare it with what you read in step 4.
8. Scroll to the bottom of the file and look for a **Totals** row.

**What was tried and ruled out:**

| Tried | Result |
|---|---|
| **Download Expanded (CSV)** on the same report | **Hrs Worked** and **Hrs Invoiced** **are** present in that file, so the figures plainly exist. **# Invoices** and **# Customers** are absent from it too, but they are per-representative totals and the Expanded file is one row per invoice, so that is expected there |
| **All locations** versus a single location selected | Same four columns missing either way. The only difference is the **Location** column itself, which correctly appears only when more than one location is in view |
| Date range **This Month** and **This Year** | Same four columns missing on both, so it is not a date-range effect |
| The equivalent Sales By Customer Summary download | **Not affected** — this is specific to Sales By Representative |

---

## 4 · Expected behaviour

The Summary spreadsheet carries the same columns the Summary view shows on screen, including
**# Invoices**, **# Customers**, **Hrs Worked** and **Hrs Invoiced**.

The product owner's words, 2026-08-05, when shown the short file:

> "on-screen should match download :)."

And on the extra row, the written description for this download says the Summary spreadsheet should
not carry a Totals row.

---

## 5 · Current behaviour

The Summary spreadsheet has **ten** columns and this exact heading row, read straight out of the
downloaded file:

```
Representative,Location,"Inv. Hrs","Labor Invoiced","Labor Margin","Parts Invoiced","Parts Margin",Margin,"Margin %",Subtotal
```

**# Invoices**, **# Customers**, **Hrs Worked** and **Hrs Invoiced** are not there.

*(With a single location selected the same file has nine columns, because the **Location** column
correctly drops out. The four missing ones are missing either way.)*

The file also **ends with a Totals row**.

---

## 6 · Images

**No image is attached, and here is why:** the fault is in the contents of a downloaded file, not on a
screen. A screenshot of the report would show the four columns present and correct, which would
mislead rather than help. The exact heading row read out of the file is quoted verbatim in section 5,
and that is the evidence.

---

## 7 · Technical details for developers

**Headings captured from the downloaded files themselves, not retyped from any document.**

Sales By Representative — **Summary** CSV:
```
Representative,Location,"Inv. Hrs","Labor Invoiced","Labor Margin","Parts Invoiced","Parts Margin",Margin,"Margin %",Subtotal
```
Sales By Representative — **Expanded** CSV:
```
Representative,"Invoice #",Date,Customer,"Invoice Status",Location,"Hrs Worked","Hrs Invoiced","Inv. Hrs","Labor Invoiced","Labor Margin","Parts Invoiced","Parts Margin",Margin,"Margin %",Subtotal
```

Every CSV opens with a UTF-8 byte-order mark and a metadata line `"Locations: All locations"`, and
ends with a `Totals` row.

**The data is present in the response the screen is drawn from** — it carries `invoice_count`,
`hours_worked` and `hours_invoiced`. So this is a mapping gap in the file writer, not missing data.

**Specification references.** Sales By Representative description, version 15 (2026-07-29): `S14-R15`
enumerates the Summary heading list and `S14-R18` covers the Expanded one; `S14-R15` also states the
Summary file has no Totals row. `S14-R20` adds the Location column to all four downloads, and that
part **is** implemented correctly.

**Evidence in the repo:** `build/report-suite/viu-2026-08-03/batch-sbc-sbr/VERDICTS.md` §4 and §5 —
§5 holds all four verbatim heading rows, captured from the files.
