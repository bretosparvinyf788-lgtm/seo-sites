#!/usr/bin/env python3
"""Generate original, lightweight editorial covers for LitBuyVIP guides."""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "litbuyvip.org" / "assets"
W, H = 1200, 675
BLACK, CHARCOAL = "#080806", "#171714"
YELLOW, ORANGE, CREAM = "#FFD400", "#FF5B00", "#FFFDF2"
MUTED, LINE = "#B7B1A0", "#35342D"
FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"


def font(size, bold=False):
    return ImageFont.truetype(FONT_BOLD if bold else FONT, size)


def base(kicker, title, accent=YELLOW):
    image = Image.new("RGB", (W, H), BLACK)
    draw = ImageDraw.Draw(image)
    for x in range(0, W, 60):
        draw.line((x, 0, x, H), fill="#11110F", width=1)
    for y in range(0, H, 60):
        draw.line((0, y, W, y), fill="#11110F", width=1)
    draw.rounded_rectangle((55, 48, 330, 96), 20, fill=accent)
    draw.text((78, 61), kicker, fill=BLACK, font=font(18, True))
    lines = title.split("\n")
    y = 128
    for line in lines:
        draw.text((60, y), line, fill=CREAM, font=font(50, True))
        y += 60
    draw.rectangle((60, 292, 360, 299), fill=accent)
    draw.text((60, 605), "LITBUYVIP.ORG  •  INDEPENDENT BUYER GUIDE", fill=MUTED, font=font(17, True))
    return image, draw


def save(image, name):
    image.save(OUT / name, "WEBP", quality=86, method=6)


def payment():
    image, d = base("PAYMENT", "ADD MONEY\nWITH A RECORD", YELLOW)
    d.rounded_rectangle((655, 120, 1100, 510), 36, fill=CREAM)
    d.rounded_rectangle((708, 178, 1048, 368), 26, fill=ORANGE)
    d.rectangle((748, 222, 818, 267), fill=YELLOW)
    d.rounded_rectangle((748, 303, 965, 324), 10, fill="#8D2F00")
    d.rounded_rectangle((748, 340, 910, 361), 10, fill="#8D2F00")
    for i, x in enumerate((720, 810, 900, 990)):
        d.ellipse((x, 420, x + 56, 476), fill=YELLOW if i % 2 == 0 else ORANGE, outline=BLACK, width=4)
    d.line((620, 520, 1125, 520), fill=YELLOW, width=8)
    save(image, "litbuy-add-money-payment-methods.webp")


def ordering():
    image, d = base("ORDERING", "SOURCE → QC\n→ PARCEL", ORANGE)
    boxes = [(620, 125, 780, 250), (855, 125, 1015, 250), (735, 390, 900, 525)]
    colors = [YELLOW, CREAM, ORANGE]
    labels = ["SOURCE", "ORDER", "WAREHOUSE"]
    for box, color, label in zip(boxes, colors, labels):
        d.rounded_rectangle(box, 24, fill=color)
        cx = (box[0] + box[2]) // 2
        d.text((cx, box[1] + 48), label, fill=BLACK, font=font(18, True), anchor="mm")
    d.line((780, 188, 855, 188), fill=CREAM, width=10)
    d.polygon([(855, 188), (832, 173), (832, 203)], fill=CREAM)
    d.line((935, 250, 840, 390), fill=YELLOW, width=10)
    d.polygon([(840, 390), (840, 362), (863, 378)], fill=YELLOW)
    d.line((700, 250, 780, 390), fill=ORANGE, width=10)
    save(image, "litbuy-how-to-order-marketplaces.webp")


def legit():
    image, d = base("INDEPENDENT REVIEW", "VERIFY EVERY\nHANDOFF", YELLOW)
    d.rounded_rectangle((690, 105, 1065, 545), 34, fill=CREAM)
    d.polygon([(875, 145), (1000, 195), (980, 355), (875, 455), (770, 355), (750, 195)], fill=YELLOW, outline=BLACK)
    d.line((815, 295, 860, 340, 940, 245), fill=BLACK, width=22, joint="curve")
    for y in (478, 512):
        d.rounded_rectangle((760, y, 1000, y + 14), 7, fill=ORANGE if y == 478 else CHARCOAL)
    save(image, "litbuy-legit-review.webp")


def refund():
    image, d = base("REFUNDS", "TRACK ITEM\nAND MONEY", ORANGE)
    d.rounded_rectangle((640, 120, 1090, 520), 34, fill=CHARCOAL, outline=LINE, width=3)
    d.arc((690, 155, 930, 395), 70, 310, fill=YELLOW, width=24)
    d.polygon([(713, 179), (760, 163), (742, 213)], fill=YELLOW)
    d.arc((800, 240, 1040, 480), 250, 490, fill=ORANGE, width=24)
    d.polygon([(1015, 457), (972, 478), (985, 425)], fill=ORANGE)
    d.rounded_rectangle((742, 254, 985, 345), 20, fill=CREAM)
    d.text((864, 300), "BALANCE", fill=BLACK, font=font(24, True), anchor="mm")
    save(image, "litbuy-refund-guide.webp")


def size():
    image, d = base("SIZE & FIT", "MEASURE\nBEFORE SHIP", YELLOW)
    d.rounded_rectangle((610, 100, 1100, 545), 34, fill=CREAM)
    d.polygon([(730, 185), (805, 135), (885, 185), (965, 150), (1015, 260), (945, 295), (920, 500), (700, 500), (675, 295), (605, 260), (655, 150)], fill=ORANGE, outline=BLACK)
    d.rounded_rectangle((640, 420, 1045, 472), 14, fill=YELLOW, outline=BLACK, width=3)
    for x in range(665, 1030, 36):
        d.line((x, 420, x, 444 if x % 72 else 455), fill=BLACK, width=3)
    save(image, "litbuy-size-guide.webp")


def app():
    image, d = base("APP & SOURCETRACK", "KEEP THE\nSOURCE ATTACHED", ORANGE)
    d.rounded_rectangle((745, 85, 1005, 555), 44, fill=CREAM)
    d.rounded_rectangle((770, 130, 980, 485), 24, fill=CHARCOAL)
    d.ellipse((855, 505, 895, 545), fill=YELLOW)
    nodes = [(680, 210, YELLOW), (850, 250, ORANGE), (930, 390, YELLOW), (680, 445, ORANGE)]
    for a, b in ((0, 1), (1, 2), (1, 3)):
        d.line((nodes[a][0], nodes[a][1], nodes[b][0], nodes[b][1]), fill=CREAM, width=8)
    for x, y, color in nodes:
        d.ellipse((x - 32, y - 32, x + 32, y + 32), fill=color, outline=BLACK, width=4)
    save(image, "litbuy-app-sourcetrack.webp")


def stock():
    image, d = base("SELLER EXCEPTIONS", "OUT OF STOCK?\nCHOOSE THE BRANCH", YELLOW)
    for row in range(3):
        for col in range(4):
            x, y = 620 + col * 112, 128 + row * 112
            color = ORANGE if (row, col) == (1, 2) else CHARCOAL
            d.rounded_rectangle((x, y, x + 86, y + 86), 18, fill=color, outline=LINE, width=3)
            if (row, col) == (1, 2):
                d.line((x + 18, y + 18, x + 68, y + 68), fill=CREAM, width=10)
                d.line((x + 68, y + 18, x + 18, y + 68), fill=CREAM, width=10)
    d.rounded_rectangle((660, 505, 1045, 560), 20, fill=YELLOW)
    d.text((852, 532), "ACCEPT  •  REPLACE  •  CANCEL", fill=BLACK, font=font(18, True), anchor="mm")
    save(image, "litbuy-out-of-stock-price-change.webp")


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    payment(); ordering(); legit(); refund(); size(); app(); stock()
    print("Generated 7 editorial covers")
