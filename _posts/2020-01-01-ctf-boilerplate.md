---
title: "CTF Boilerplate (WIP)"
layout: archive
classes: wide
date:   2020-01-01
tags: jeopardy
tags_label: true
---

Just a cheatsheet for writing scripts to automate some CTF tasks. My dumb lizard brain always forgets how to use these tools.

## Web:

#### Python requests:

```python
import requests

# GET request:
params = {"param": "test"}
resp = requests.get(url, params=params)
# Response:
print(resp.text)

# POST request:
post_data = {"user": "admin", "pass": "password"}
r = requests.post(url, data=post_data)
# Response:
print(r.status_code)
print(r.headers['content-type'])
if 'application/json' in r.headers['content-type']:
    result = json.loads(r.text)
    print(result['data'])

# Download file:
dl_query = {"query": "get_file", "sha256_hash": query}
file_name = query+".zip"
out_file = os.path.join(out_folder, file_name)
print(out_file)
r = requests.post(api_url, dl_query, allow_redirects=True, stream=True)

if not r.status_code == requests.codes.ok:
    print("ERROR")
    print(r.status_code)
    print(r.headers)
    print(r.text)
    break
                
f = open(out_file, "wb")
for chunk in r.iter_content(chunk_size=1024):
    f.write(chunk)
```

## RE:

#### r2-pipe:

**Example**: Get entry point
```python
def get_ie_offset(file_name):
    r2 = r2pipe.open(file_name, flags=['-e', 'bin.verbose=false'])
    
    _ = r2.cmd("a")

    ie = r2.cmd("iej")
    try:
        iej = json.loads(ie)
        if len(iej) == 1:
            return iej[0]["paddr"]
        elif len(iej) == 0:
            return 0
        return iej["paddr"]
    except Exception as e:
        print(e)
        return -1

# Some useful commands:
# afl - list functions 
# axl - list cross-references 
# ia - get info
# iSS - get segments, iS - get sections
# izz - strings
```

Tools:
- zelos
- z3
- cutter

Resources:
```
https://infosecwriteups.com/how-to-unpack-upx-packed-malware-with-a-single-breakpoint-4d3a23e21332
https://dlnhxyz.medium.com/manually-unpacking-a-upx-packed-binary-with-radare2-part-1-7039317c2ed8
```

## Pwn:

#### Pwnlib (Ptrlib):

I always forget how to use this one. 

```python
from ptrlib import *

# Run a file:
elf = ELF("./vuln")
# proc 
proc = Process("./vuln")

# socket:
# connect to address at port:
sock = Socket("10.10.14.120", 4902)

# ELF: get symbols:
main_addr = elf.symbol("main")
print("addr main(): {}".format(main_addr))
print("addr main(): hex {}".format(hex(main_addr)))

func_addr = elf.symbol("func")
print("addr func(): {}".format(hex(func_addr)))

# process:
# recieve a line of output:
print(sock.recvline())

# recieve output into you encounter a particular character:
print(proc.recvuntil(">"))

# Send line to the process:
proc.sendline("2")

payload = b'A'*51
sock.sendline(payload)

# Send line after recieving some text:
sock.sendlineafter("Input some text:", payload)

#Enter interactive mode to interact with the processs:
sock.interactive()

```

#### gdb:

```
x/x 0x000011b0 <- check memory at address 0x000011b0
b <function name> <- set breakpoint at function
b *0x11b4 <- set breakpoint at address 0x11b4
info breakpoints <- list breakpoints
delete <- clear all breakpoints and watchpoints
delete 3 <- delete specific breakpoint 3

info file
```

recipe: find address of specific line in binary:
```
b main 
p <target function>  <- get address of the target function
info line *(0x<function address>+offset) 
list *(0x<function address>+offset)
info symbol *(0x<function address>+offset)
b *(0x<function address>+offset)
```

## Forensics:

#### Helpful Resources:
- https://bitvijays.github.io/LFC-Forensics.html 

### PIL

Create an image:
```python
from PIL import Image

width=50
height=50
# create an image
image = Image.new("RGB", (width, height))
putpixel = image.putpixel
imgx, imgy = image.size

# put pixel in the new image
putpixel((i, j), (255,255,255))

# save and show image
image.save("digital_cube.png")
image.show()
```

Extract pixels from an image:
```python
from PIL import Image

im = Image.open('not_art.png')
rgb_im = im.convert('RGB')
width = 300
height = 300
block_size = 30

for i in range(30):
	i*=10
	for j in range(30):
		j*=10 
		r, g, b = rgb_im.getpixel((j, i))
		#print(r, g, b)
		print('#%02x%02x%02x' % (r,g,b))

```


#### Scapy

This is a bit rough:
```python
from scapy.all import *

# Open a pcap:
r = rdpcap("icmp.pcap")
list_type_bytes = [] #list to store all type bytes

# loop through the packets:
for i in range(len(r)):
    # Filter by protocol:
    # if r[i].haslayer(DNS)
    # if r[i].haslayer(TCP)
    # if r[i].haslayer(TCP) and Raw in r[i][TCP]:

    if r[i].haslayer(ICMP):
    
    	# and r[i][IP].dst == '127.0.0.2': # filter to check destination IP and ICMP layer.
        #type_byte = str(hex(r[i][ICMP].id))
    
        type_byte = r[i][ICMP].load.decode("utf-8")
    
        # r[i].payload
        list_type_bytes += type_byte

concatenate = ''.join(list_type_bytes) # join all the list elements to form single string stream.

f = open('flag2','w')
f.write(concatenate)
f.close()
```

#### OpenCV2

```python
import cv2
import numpy as np
import math

count = 0
# 214152

end_count = 214152

success = 1

vid = cv2.VideoCapture("surveillance-camera42-2022.03.19_part8.mp4")
#vid.set(cv2.CAP_PROP_POS_FRAMES, count)
#cnt = vid.get(cv2.CAP_PROP_FRAME_COUNT)

success, image = vid.read()

#cv2.imwrite("frames/frame%d.jpg" % count, image)
#cv2.imshow("frame", image)
```

#### Volatility:

```
//Full command reference:
https://github.com/volatilityfoundation/volatility/wiki/Command-Reference

//Image Info:
volatility -f crashdump.elf imageinfo

//Dump files:
volatility --profile=Win7SP1x64 -f crashdump.elf dumpfiles --dump-dir /tmp/dump_files/

//Scan for files:
volatility --profile=Win7SP1x64 -f crashdump.elf filescan

//List processes:
volatility --profile=Win7SP1x64 -f crashdump.elf pslist

//Dump process memory by pid (2424 here)
volatility --profile=Win7SP1x64 -f crashdump.elf memdump -p 2424 --dump-dir=./

//Dump command lines:
volatility --profile=Win7SP1x64 -f crashdump.elf consoles

// Dump hashes of cached domain credentials stored in registry:
volatility --profile=Win7SP1x64 -f crashdump.elf hashdump

// Dump LSA secrets from registry:
volatility --profile=Win7SP1x64 -f crashdump.elf lsadump

// Dump screen:
volatility --profile=Win7SP1x64 -f crashdump.elf screenshot --dump-dir /tmp/dump_screenshots

```

### Misc:

#### Asyncio shell commands:

```python
import asyncio

async def call_extern(args):
    cmd = " ".join(args)
    process = await asyncio.create_subprocess_shell(cmd, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE)
    stdout, stderr = await process.communicate()
    return stdout

def get_hashdump(name):
    cmd = ["hexdump", name]
    hex_dmp = asyncio.run(call_extern(cmd))
```

#### Os shell commands:

```python
from subprocess import Popen, PIPE

def call_external_script(file_name, args):
    args =[file_name]+args
    process = Popen(args, stdout=PIPE, stderr=PIPE)
    time.sleep(4)
    stdout, stderr = process.communicate()
    print(stderr.decode("utf-8"))
    return stdout
```


#### Python - Bytes to Int and Bytes from Int

I always forget these two.

```python
>>> (1024).to_bytes(2, byteorder='big')
>>> int.from_bytes(b'\xde', byteorder='little')
```

#### Crypto:

```
Cipher Identifier:
https://www.dcode.fr/cipher-identifier
Good Factorization Calculator:
https://www.alpertron.com.ar/ECM.HTM
```

