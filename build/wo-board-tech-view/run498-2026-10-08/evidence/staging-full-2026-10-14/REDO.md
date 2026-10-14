# Staging full run (14 Oct 2026) — checks to re-run after the main run (my script's fault, not the product)
| Case | Script | Why | Fix |
|---|---|---|---|
| C96912 | s1-batch4a | location switch: the script's picker found 0 options on staging ("options for Staging Lethbridge = 0") | switch with profile menu → `select_location` (stg6.mts `switchLoc`) |
| C96923 | s1-batch4a | same location-picker fault; then the Tech View click timed out | same |
