# usage: python3 redcount.py <dir> -> red (spell-underline) pixel count per *-typing.png / *-clicked-out.png
import sys,glob,os
from PIL import Image
for f in sorted(glob.glob(os.path.join(sys.argv[1],'*-[123]-*.png'))):
    im=Image.open(f).convert('RGB'); px=im.load(); n=0
    for y in range(im.height):
        for x in range(im.width):
            r,g,b=px[x,y]
            if r>190 and g<90 and b<90: n+=1
    print(f"{os.path.basename(f):45s} red_px={n:5d} size={im.size}")
