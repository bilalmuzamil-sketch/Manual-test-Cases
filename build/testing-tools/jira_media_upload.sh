#!/bin/bash
# Upload local files to Atlassian Media with the short-lived token from uploadAttachmentToJiraIssue phase 1 (collection-wide,
# ~20 min). Usage: JTOK='<token>' jira_media_upload.sh file1 [file2 ...]  -> prints "<mediaId> <size> <name>" per file.
# SECRET-FREE: the token comes from the environment only and is never written to disk or logs.
set -e; : "${JTOK:?set JTOK}"; COLL=${JCOLL:-upload-user-collection-1343233018}
for f in "$@"; do n=$(basename "$f")
  curl -sS --location "https://api.media.atlassian.com/file/binary?collection=$COLL&name=$n" --header 'Accept: application/json' \
    --header "Authorization: Bearer $JTOK" --header 'X-Client-Id: 254871b9-6749-473c-8a0e-25fefb6cc105' --data-binary "@$f" \
  | python3 -c "import json,sys;d=json.load(sys.stdin)['data'];print(d['id'],d.get('size'),d.get('name'))"
done
