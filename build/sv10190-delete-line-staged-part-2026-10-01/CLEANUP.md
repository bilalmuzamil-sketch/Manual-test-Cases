# SV-10190 — staging clean-up record

Staging is a shared environment, so nothing pre-existing was modified. Only new records were
created, every description prefixed `ZZAUTOTEST`.

## Removed

- `13d28cc8-6740-4c85-87b7-1bfda809208d`
- `773f38d9-bc96-4f2d-b610-ef6e6f54c7ca`

## Could not be removed — the application itself refuses

`POST /api/work-orders/delete` answers **400**:

> Work order cannot be deleted because it has received parts. Please return or move the parts first.

That is correct behaviour and worth noting in passing: the **work-order** delete has the
received-parts guard that `lines/delete` was missing. (Related ticket SV-9706 says this guard counts
the wrong rows in some cases; it is still Ready to Fix and was not tested here.)

These scratch work orders therefore remain, each holding one received `ZZAUTOTEST` part:

- `4dd01dba-05bb-4e17-b980-bf4bafa3d5ca`
- `accf1937-0f85-45e9-8e5c-2bca88db8216`
- `493d658c-9d8c-4ad9-a54d-48812d950579`
- `1e2f0cd3-19ce-49ee-83ab-13cc64233cef`
- `3a4f243d-64b3-4d7a-b70e-5f609667ae7d`
- `391d01f9-a511-460d-a758-8a59ac2fbba0`
- `99f81755-d59e-4477-8eda-dc4299e85547`

## Kept deliberately, as the reproduction

- **S2-34499** `28d60f52-4bae-4f1d-837d-9d1129e68be3` — line *Replace - Hub cap gaskets*, part `SV10190-CLICK`: where the refused delete was captured.
- **S2-34483** `52e0753e-23cd-4789-a8cc-b37135328b23` — three lines with received parts: the correct fresh-load state.

Say the word if you want the lot cleared; it needs the parts returned or moved first.
