from PIL import Image, ImageDraw, ImageFont
FB="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FR="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
def F(sz,bold=True): return ImageFont.truetype(FB if bold else FR, sz)
RED=(211,47,47); GREEN=(27,120,60); BLUE=(21,101,192); WHITE=(255,255,255); DARK=(33,33,33)

def canvas(src, cap_lines, boxes, arrows):
    im=Image.open(src).convert("RGB")
    W,H=im.size
    caph=34*len(cap_lines)+28
    out=Image.new("RGB",(W,H+caph),WHITE)
    out.paste(im,(0,0))
    d=ImageDraw.Draw(out)
    for (x,y,w,h,color) in boxes:
        d.rectangle([x-4,y-4,x+w+4,y+h+4],outline=color,width=4)
    for (x1,y1,x2,y2,color) in arrows:
        d.line([x1,y1,x2,y2],fill=color,width=4)
        # arrowhead
        import math
        ang=math.atan2(y2-y1,x2-x1)
        for a in (ang-0.4,ang+0.4):
            d.line([x2,y2,x2-16*math.cos(a),y2-16*math.sin(a)],fill=color,width=4)
    y=H+12
    for (txt,color) in cap_lines:
        d.text((20,y),txt,fill=color,font=F(21)); y+=34
    return out

# Exhibit 1: entered 45.789 (dialog cost field ~ x544 y616 w92 h40)
e1=canvas("raw-01-entered.png",
  [("STEP 1  -  Edit Part Request: I entered a part cost of $45.789 (Seal Kit, PO vendor GCM Truck Repair).",DARK),
   ("Then clicked Save & Close.",DARK)],
  [(544,616,92,40,BLUE)],
  [(430,560,548,616,BLUE)])
e1.save("exhibit-01-entered.png")

# Exhibit 2: reopened -> 45.78900 (same geometry)
e2=canvas("raw-02-reopen.png",
  [("STEP 2  -  Reopened the Edit Part Request window: Cost still reads $45.78900 - NOT rounded to $45.79000.",GREEN),
   ("This is the reported bug (rounding on reopen). It is FIXED.",GREEN)],
  [(544,616,92,40,GREEN)],
  [(430,560,548,616,GREEN)])
e2.save("exhibit-02-reopen.png")

# Exhibit 3: bulk receive 45.78900 (x1207 y776 w150 h40)
e3=canvas("raw-03-bulk.png",
  [("STEP 3  -  Bulk Receive (Receive Vendor Parts) for the SAME part: Cost = $45.78900 - NOT $45.78950.",GREEN),
   ("The cost now matches across all three screens. FIXED.",GREEN)],
  [(1207,776,150,40,GREEN)],
  [(1120,720,1210,776,GREEN)])
e3.save("exhibit-03-bulk.png")
print("done")
