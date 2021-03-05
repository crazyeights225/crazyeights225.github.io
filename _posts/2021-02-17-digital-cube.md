---
title: "HackTheBox: Digital Cube"
layout: archive
date:   2021-02-17
tags: jeopardy
tags_label: true
---
This is an easy forensics challenge from HackTheBox. It is pretty unique, and we get to do some programming which is neat.

![htb_dc/Screenshot_2021-02-17_Stego_Challenges.png](/assets/images/htb_dc/Screenshot_2021-02-17_Stego_Challenges.png)

Download the zip, and decompress it.

You get the following:

![htb_dc/Screenshot_from_2021-02-17_20-28-49.png](/assets/images/htb_dc/Screenshot_from_2021-02-17_20-28-49.png)

Since the challenge name is digital cube, and its a stego challenge, we can assume that we can turn this into an image, since there are 50x50 bits the image is a square.
```
Set each 1 to a black pixel
Set each 0 to a white pixel
```

Using python:

```python
from PIL import Image

cubetext = ""
with open("digitalcube.txt", "r") as f:
	cubetext = f.read()

width=50
height=50
image = Image.new("RGB", (width, height))
putpixel = image.putpixel
imgx, imgy = image.size

p = 0
for i in range(50):
	for j in range(50):
		if cubetext[p] == "1":
			putpixel((i, j), (0,0,0))
		else:
			putpixel((i, j), (255,255,255))
		p+=1
image.save("digital_cube.png")
image.show()
```

We get:

![htb_dc/digital_cube.png](/assets/images/htb_dc/digital_cube.png)

Looking this up using zxing.org, we get:

![htb_dc/Screenshot_2021-02-17_Decode_Succeeded.png](/assets/images/htb_dc/Screenshot_2021-02-17_Decode_Succeeded.png)

FIN. 🥳