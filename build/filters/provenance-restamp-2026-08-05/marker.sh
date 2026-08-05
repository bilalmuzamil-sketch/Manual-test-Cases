#!/bin/bash
# Read the build marker WITHOUT touching quick-login. Raw cookies only.
TAG="$1"
CK=$(cat /tmp/filters-viu/cookiehdr.txt)
curl -s -D "hdr-$TAG.txt" -o "index-$TAG.html" \
  -H "Cookie: $CK" \
  -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36' \
  https://sv8785.qa.shopview.com/index.html
echo "== $TAG =="
date -u +"read at %Y-%m-%dT%H:%M:%SZ"
grep -i -E '^(HTTP/|last-modified|etag|content-length)' "hdr-$TAG.txt"
grep -o '<meta name="app-version"[^>]*>' "index-$TAG.html"
sha256sum "index-$TAG.html"
