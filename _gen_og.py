from PIL import Image, ImageDraw, ImageFont
import os

W, H = 1200, 630
PAPER = (245, 242, 233)
INK = (26, 28, 26)
CORAL = (229, 92, 69)

SHOUJIN = "app/fonts/HYShouJinShuF.ttf"
PRETESTO = "app/fonts/PreTesto-Italic.ttf"

img = Image.new("RGB", (W, H), PAPER)
d = ImageDraw.Draw(img)
d.rectangle([24, 24, W - 24, H - 24], outline=INK, width=2)
d.ellipse([72, 80, 86, 94], fill=CORAL)

font_eyebrow = ImageFont.truetype(PRETESTO, 26)
d.text((110, 82), "REALITY ENGINE / AI BUILDER / 2026", font=font_eyebrow, fill=INK)

# Title: 让 AI 落地 — shared baseline, AI in coral PreTesto
f = ImageFont.truetype(SHOUJIN, 150)
fp = ImageFont.truetype(PRETESTO, 205)
segments = [
    ("让 ", f, INK),
    ("AI", fp, CORAL),
    (" 落地", f, INK),
]
# use anchor='ls' (left baseline) to align; measure widths
widths = [d.textlength(t, font=ft) for t, ft, _ in segments]
total = sum(widths)
baseline = 350
x = (W - total) / 2
for (t, ft, col), w in zip(segments, widths):
    d.text((x, baseline), t, font=ft, fill=col, anchor="ls")
    x += w

# Subtitle
font_sub = ImageFont.truetype(SHOUJIN, 40)
sub = "生物制药工艺开发 · 公众号「信使引擎」主理人"
wsub = d.textlength(sub, font=font_sub)
d.text(((W - wsub) / 2, 435), sub, font=font_sub, fill=INK)

font_meta = ImageFont.truetype(PRETESTO, 24)
d.text((72, H - 84), "YUXIAOMO-AI-NOTES", font=font_meta, fill=INK)
github = "github.com/rcrusoe88-bot"
wgh = d.textlength(github, font=font_meta)
d.text((W - 72 - wgh, H - 84), github, font=font_meta, fill=INK)

out = "public/og.png"
img.save(out)
print("saved", out, os.path.getsize(out), "bytes")
