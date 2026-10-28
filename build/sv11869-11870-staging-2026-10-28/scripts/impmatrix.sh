#!/bin/bash
# Builds one CSV per case and imports each on screen. ENVX=staging|prod. Results -> ev/import/results.txt
cd "$(dirname "$0")/.."
T=$(date +%H%M%S); NEW='*Shop Location,*Customer,VIN,Year,Make,Model,Unit #,Unit Type,Mileage,Hours,*Invoice Number,*Invoice Date,PO,Service Advisor,*Item,*Line Title,Line Description,Tech Story,Part #,Part Description,*Qty,*Rate,*Total,*Tax Amount'
OLD='*Shop Location,*Customer,VIN,Year,Make,Model,Unit #,Unit Type,Mileage,Hours,*Invoice Number,*Invoice Date,PO,Service Advisor,*Item,*Line Title - What are you doing,Line Description - Why are you doing it,Tech Story,Part #,Part Description,*Qty,*Rate,*Total,*Tax Amount'
L=${LOCLINE:-'Staging Heavy Duty - 9919,4 Star Truck Repair,,,,,,,,'}
row(){ echo "$L,$1,10/28/2026,,,$2,$3,$4,,$5,$6,1,10,10,0"; }   # inv item title desc part# partdesc
mk(){ f=ev/import/$1.csv; shift; printf '%s\n' "$@" > $f; echo $f; }
cases=(
 "labor-empty|$(mk labor-empty "$NEW" "$(row ZZ11870-L$T Labor '' 'excessive play' '' '')")"
 "part-empty|$(mk part-empty "$NEW" "$(row ZZ11870-P$T Part '' 'brake pads' ZZP11870 'Brake pad set')")"
 "labor-filled|$(mk labor-filled "$NEW" "$(row ZZ11870-OK$T Labor 'Replace tie rod' 'excessive play' '' '')")"
 "shop-supplies-empty|$(mk shop-supplies-empty "$NEW" "$(row ZZ11870-SS$T Labor 'Inspect brakes' 'noise' '' '')" "$(row ZZ11870-SS$T 'Shop Supplies' '' '' '' '')")"
 "misc-empty|$(mk misc-empty "$NEW" "$(row ZZ11870-MI$T Labor 'Inspect brakes' 'noise' '' '')" "$(row ZZ11870-MI$T Misc '' '' '' '')")"
 "credit-memo-empty|$(mk credit-memo-empty "$NEW" "$(row ZZ11870-CM$T 'Credit Memo' '' '' '' '')")"
 "sublet-empty|$(mk sublet-empty "$NEW" "$(row ZZ11870-SB$T Sublet '' 'tow' '' '')")"
 "old-header-empty|$(mk old-header-empty "$OLD" "$(row ZZ11870-OH$T Labor '' 'excessive play' '' '')")"
 "old-header-filled|$(mk old-header-filled "$OLD" "$(row ZZ11870-OF$T Labor 'Replace tie rod' 'excessive play' '' '')")"
 "invoice-date-empty|$(mk invoice-date-empty "$NEW" "$(echo "$L,ZZ11870-ID$T,,,,Labor,Replace tie rod,excessive play,,,,1,10,10,0")")"
 "lowercase-shop-supplies|$(mk lowercase-shop-supplies "$NEW" "$(row ZZ11870-LC$T Labor 'Inspect brakes' 'noise' '' '')" "$(row ZZ11870-LC$T 'shop supplies' '' '' '' '')")"
 "title-zero|$(mk title-zero "$NEW" "$(row ZZ11870-Z$T Labor 0 'excessive play' '' '')")"
)
OUT=ev/import/results${ENVX:+-$ENVX}.txt; : > $OUT
for c in "${cases[@]}"; do n=${c%%|*}; f=${c#*|}; echo "== $n" | tee -a $OUT
  timeout 200 node scripts/imp.mjs $f ev/import/${ENVX:-staging}-$n 2>&1 | grep -E 'api/imports|TOASTS|AFTER IMPORT' | cut -c1-400 | tee -a $OUT; done
