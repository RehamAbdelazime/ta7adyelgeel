#!/usr/bin/env python3
"""V50 curated 50-poster visual signatures. Layout positions reviewed against user's contact sheets.
Palette cell values sampled from the supplied local poster files, not downloaded media."""
from pathlib import Path
from PIL import Image
import numpy as np, json, csv
root=Path(__file__).resolve().parents[1]
bankpath=root/'src/game-core/minigames/visual-guess/visual-guess-questions.json'
bank=json.loads(bankpath.read_text(encoding='utf-8'))
movies=bank['movies'][:50]  # Do NOT overwrite the 31 new V57 poster profiles.
assert len(movies)==50
# Cast pattern: solo / duo / trio / ensemble / collage; Placement: center / split / scattered / side
# Palette names are editorial descriptors only; pixel-based palette has the authoritative image sample.
editorial=[
 ('solo','center','cyan','45 42 32 47 30'),
 ('ensemble','center','brown','38 48 40 50 19'),
 ('trio','center','navy','24 7 50 36 21'),
 ('ensemble','scattered','teal','48 31 38 40 50'),
 ('solo','side','cream-blue','34 9 29 8 10'),
 ('duo','center','teal','32 42 45 47 31'),
 ('solo','center','blue-orange','24 3 50 21 30'),
 ('collage','center','cream-red','27 9 13 14 29'),
 ('solo','center','cream-gold','29 10 27 8 13'),
 ('solo','center','cream-black','9 29 37 23 28'),
 ('ensemble','scattered','white-blue','12 37 18 41 28'),
 ('ensemble','scattered','white-red','11 37 18 41 28'),
 ('duo','split','cream-gold','14 23 39 27 9'),
 ('duo','split','cream-blue','13 23 39 8 27'),
 ('solo','side','black-white','17 46 36 25 5'),
 ('ensemble','scattered','pink-blue','20 35 31 32 26'),
 ('solo','side','black-gold','46 25 15 36 33'),
 ('trio','scattered','white-red','11 12 41 37 28'),
 ('ensemble','scattered','brown-orange','40 50 21 22 26'),
 ('ensemble','scattered','sky-blue','16 32 42 35 45'),
 ('duo','split','cream-red','50 8 27 40 19'),
 ('duo','split','orange-pink','40 50 19 26 7'),
 ('trio','scattered','cream-red','13 14 39 9 27'),
 ('solo','center','navy','3 7 36 50 25'),
 ('solo','side','sand-blue','46 17 36 21 50'),
 ('ensemble','scattered','olive-gold','19 40 22 6 35'),
 ('collage','scattered','cream-orange','8 9 39 29 13'),
 ('ensemble','scattered','white-red','11 12 18 41 37'),
 ('collage','center','cream-blue','9 8 27 39 10'),
 ('solo','center','blue-gold','1 7 42 26 24'),
 ('ensemble','scattered','teal','4 35 48 16 38'),
 ('duo','split','sky-blue','6 42 45 43 20'),
 ('trio','center','beige-orange','20 16 22 47 45'),
 ('solo','center','cream-blue','5 10 9 29 8'),
 ('ensemble','scattered','turquoise','31 20 16 38 18'),
 ('solo','center','dark-green','50 25 3 46 17'),
 ('ensemble','scattered','cream-white','12 18 11 28 41'),
 ('ensemble','scattered','green-blue','31 4 40 35 48'),
 ('duo','split','cream-blue','23 14 13 27 9'),
 ('ensemble','scattered','gold-orange','50 19 22 26 21'),
 ('ensemble','scattered','white-red','12 11 18 37 28'),
 ('duo','split','sky-blue','32 6 45 43 20'),
 ('duo','split','sky-blue','45 42 32 47 6'),
 ('duo','center','brown-cream','45 43 47 42 33'),
 ('duo','split','turquoise','43 42 32 47 6'),
 ('solo','center','black-white','17 25 15 36 34'),
 ('duo','center','sky-blue','43 45 42 32 35'),
 ('trio','center','dark-teal','4 31 38 2 40'),
 ('ensemble','scattered','cream-yellow','18 12 37 41 28'),
 ('ensemble','scattered','orange-brown','40 19 21 22 3'),
]
assert len(editorial)==50
asset_dir=root/'public/assets/game/runtime/minigames/visual-guess'
profiles={}
for idx,(m, (layout,placement,palette,close)) in enumerate(zip(movies, editorial), start=1):
    near_numbers=[int(x) for x in close.split()]
    assert len(near_numbers)==5 and len(set(near_numbers))==5 and idx not in near_numbers, f'{idx}: invalid neighbor list'
    assert all(1<=n<=len(movies) for n in near_numbers)
    image_file=asset_dir/m['asset']
    with Image.open(image_file) as src:
        img=src.convert('RGB').resize((96,144),Image.Resampling.BILINEAR)
        arr=np.asarray(img)
        # Median color in 9 regions, lower resolution and rounded/quantized for stable metadata.
        regions=[]
        for j in range(3):
            for i in range(3):
                cell=arr[j*48:(j+1)*48,i*32:(i+1)*32]
                regions.append([int(round(float(v)/8)*8) for v in np.median(cell,axis=(0,1))])
        central=arr[36:118,12:84].reshape(-1,3)
        median=np.median(central,axis=0)
        dominant=[int(round(float(x)/8)*8) for x in median]
    profiles[m['id']]={
        'castLayout':layout,'heroPlacement':placement,'paletteLabel':palette,
        'posterPaletteRGB':dominant,'spatialPaletteRGB':regions,
        'visualNearIds':[movies[n-1]['id'] for n in near_numbers],
    }
path=bankpath.parent/'poster-visual-profiles-v50.json'
# Legacy re-sampling must preserve V57's new 31 poster profiles.
if path.exists():
    latest=json.loads(path.read_text(encoding='utf-8'))
    profiles.update({k:v for k,v in latest.get('profiles',{}).items() if k not in profiles})
path.write_text(json.dumps({'version':1,'provenance':'Manual cast/placement/visually plausible associations from 50 user-supplied poster thumbnails; dominant and 3x3 regional RGB colors sampled from local assets. No external image sources.','profiles':profiles},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f'wrote {path} with {len(profiles)} poster profiles')
