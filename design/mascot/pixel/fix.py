import subprocess, re
txt = subprocess.run(['magick','pixel-64.png','txt:-'],capture_output=True,text=True).stdout
g = [[None]*64 for _ in range(64)]
for line in txt.splitlines()[1:]:
    m = re.match(r'(\d+),(\d+):.*?#([0-9A-F]{8})', line)
    x,y,c = int(m[1]),int(m[2]),m[3]
    g[y][x] = None if c.endswith('00') else c[:6]
OUT='141414'; TAN='FCD290'
cow={'FBF3E3','3A393A','F0B770'}; horse={'FCA330','89432B','693726'}
key={None:'.','FCD290':'t','FCA330':'o','FBF3E3':'c','3A393A':'k','141414':'#','89432B':'b','693726':'d','F0B770':'p','FBD290':'t'}
import sys
if sys.argv[1:]==['show']:
    for y in range(8,56): print(f'{y:2d} '+''.join(key.get(g[y][x],'?') for x in range(64)))
    sys.exit()
n4 = lambda x,y: [(x+dx,y+dy) for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)) if 0<=x+dx<64 and 0<=y+dy<64]
# 1) outline the horse where it touches the cow
edits = [(x,y) for y in range(64) for x in range(64) if g[y][x] in horse and any(g[b][a] in cow for a,b in n4(x,y))]
for x,y in edits: g[y][x]=OUT
# 2) split the two muzzles down column 32
for y in range(36,46):
    if g[y][32] in (TAN,'FBD290','FBF3E3'): g[y][32]=OUT
# 3) drop outline pixels that touch nothing opaque
for y in range(64):
    for x in range(64):
        if g[y][x]==OUT and not any(g[b][a] not in (None,OUT) for a,b in n4(x,y)): g[y][x]=None
lines=['# ImageMagick pixel enumeration: 64,64,255,srgba']
for y in range(64):
    for x in range(64):
        c=g[y][x]; lines.append(f'{x},{y}: ' + ('(0,0,0,0)' if c is None else '(%d,%d,%d,255)'%tuple(int(c[i:i+2],16) for i in (0,2,4))))
open('fixed.txt','w').write('\n'.join(lines)+'\n')
print(len(edits),'horse edge pixels')
