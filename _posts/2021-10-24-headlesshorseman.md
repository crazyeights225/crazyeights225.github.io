---
title: "Buckeye CTF 2021: Headless Horseman"
classes: wide
layout: archive
date:   2021-10-24
tags: jeopardy
tags_label: true
---

This challenge was a medium-difficulty reverse-engineering challenge for Buckeye CTF 2021. It was basicallly 4 reverse engineering challenges in one. It was a very sP0oooKy halloween-themed challenge 👻.

![Headless Horseman](/assets/images/buckeye/disney-headless.gif)

We are given the zip file `headless_horseman` containing the following:

![Folder Contents](/assets/images/buckeye/1.png)

In the README file there is a Sp0oOO0ooKy message:

![readme](/assets/images/buckeye/2.png)

We begin by checking out the `headless_horseman` binary. When we run it asks us to give the horseman some pumpkins. 

We enter 1, and it says we haven't given the horseman enough pumpkins:
![headless_horseman](/assets/images/buckeye/3.png)

We must inspect the binary to figure out what is enough pumpkins.

Using ghidra we open and decompile the binary. We find the function `count_offering`, which calls two functions `first_count`, and `second_count` which decide whether or not we have offered enough pumpkins to the horseman:
![count_offering](/assets/images/buckeye/4.png)

The function `first_count` contains the following:
```c
int first_count(uint param_1){
    return param_1 >> 0x10 == 0xdead;
}
```
The function `second_count` contains the following:
```c
int second_count(int param_1){
    return param_1 == 0xface;   
}
```
In order for our offering to be accepted by the horseman it must pass both counts.

The correct offering is `0xdeadface` because its spooky, and because ...

**For first_count**:

When we perform bitwise shift right we add `0` to the front, and drop the least significant bit, so for:
```
first_count:
---
0xdeadface >> 0x10
----
11011110 10101101 11111010 11001110 >> 16
                
We get:
00000000 00000000 11011110 10101101
-----
11011110 10101101 = 0xdead
```

**For second count**:
This one is in truncation due to casting. The offering is first cast to an signed int when we call second_count (`int second_count(int param_1)`) and truncated into a unsigned short when it is compared to `0xdead`:
```c
// second_count:
#include <stdio.h>

int main(){
 int a = 0xdeadface;
 printf("%u\n", a);
 printf("%d\n", a);
 printf("%u\n", (unsigned short)((signed)a));
 return 0;
}
// Output:
// 3735943886
// -559023410
// 64206 = 0xface
```
So `0xdeadface` passes both counts.

We try it with the correct offering, and we get the following:
![correct_offering](/assets/images/buckeye/5.png)

It creates 6 `head` files:
```
crazyeights@es-base:~/Downloads/headless_horseman/distributed_files$ file *

dessicated_head:   ERROR: error reading

fetid_head:        ELF 64-bit LSB shared object, x86-64, version 1 (SYSV)

moldy_head:        ERROR: error reading

putrid_head:       ELF 64-bit LSB shared object, x86-64, version 1 (SYSV)

shrunken_head:     ELF 32-bit LSB shared object, Intel 80386, version 1 (SYSV)

swollen_head:      ELF 64-bit LSB shared object, x86-64, version 1 (SYSV)
```

It seems that we need to match the head files to the body files in `body_bag`.

If we look in `bloated_body` we find the following base64 string:
![bloated_bodyb64](/assets/images/buckeye/6.png)

We decode this and we get:
![bloated_body_flag](/assets/images/buckeye/7.png)

I got rick-rolled........ 😟
We can assume that this is first part of the flag.

We now must figure out the other 2 bodies.

First we need to match the head files to the body files and combine them. I tried to guess the head-body matches manually but failed, so I wrote a script to do it for me.

```python
heads = ["dessicated_head", "fetid_head", "moldy_head", "putrid_head", "shrunken_head", "swollen_head"]
bodies = ["body_bag/decomposing_body", "body_bag/bloated_body", "body_bag/rotting_body"]
for h in heads:
    for b in bodies:
        print("cat {0} {1} > {2}", h, b, (h+"_"+b.split("/")[1]+"1"))
        print("chmod a+x "+(h+"_"+b.split("/")[1]+"1"))
```

This script prints the bash commands to create all combinations of heads and bodies:
![body_combos](/assets/images/buckeye/8.png)

We get the following files. We can see that the files `dessicated_head_decomposing_body1`, and `shrunken_head_rotting_body1` appear to good (as well as `moldy_head_bloated_body1`, but we already the flag part from it):
![result_files](/assets/images/buckeye/9.png)

We begin with `dessicated_head_decomposing_body1`. This one was easier. "Katrina" asks for an encryption key that is either the street they grew up on, or her hometown. In the README.txt file there is following line:

> A mysterious figure has been terrorizing the village of **Sleepy Hollow.**

We can assume that their hometown in Sleepy Hollow. We get the following:
![katrina_flag](/assets/images/buckeye/10.png)

We now have two flag parts which makes `flag{the_horseman_really_loves_`.

One to go!

We run `shrunken_head_decomposing_body1`, "Bron" asks us to give him some amount of medicine to clear his thoughts. When we enter a number it gives us the following hint:
![brom](/assets/images/buckeye/11.png)

This implies that we must do some sort of buffer overflow.
Using ghidra we decompile the binary, and we find the following function.
![brom_func](/assets/images/buckeye/12.png)

We can see to get the flag we must modify the value of local_10.
```c
//local_10 is set to 
local_10 = -0x21524111;
//local_10 is checked against 0x44414544:
bVar1 = local_10 != 0x44414544;
// if bVar1 is false then we get the flag so we need to set local_10 equal to 0x44414544

// Since it appears right after the buffer local_24, which we write the amount of medicine to give brom to, then if we can overflow local_24 then we can alter the value of local_10.
```
Since `local_10` is directly after `local_24` in the stack, and since `local_24` is initialized (when we write the amount of medicine to give Bron to it), after `local_10`, writing outside of the `20 bytes` allocated for `local_24` will write to `local_10`.

We use metasploit's pattern generator to generate a value that is exactly 20 bytes.
![buffer](/assets/images/buckeye/13.png)

Since we want to make local_10 equal to 0x44414544 our payload is:
```
payload = 'Aa0Aa1Aa2Aa3Aa4Aa5Aa'+'\x44\x45\x41\x44'
```

We use the ptrlib module to write a script to test our payload.
This just create a process, runs the binary, and writes our payload to stdin after we recieve the line asking for the amount of medicine to give.

```python
from ptrlib import *

sock = Process("./shrunken_head_rotting_body1")
sock.recvuntil("'think you have any medicine to help straighten out my thoughts?'")
payload = 'Aa0Aa1Aa2Aa3Aa4Aa5Aa'+'\x44\x45\x41\x44'

sock.sendline(payload)

sock.interactive()
```

We run this and get:
![bron_payload](/assets/images/buckeye/14.png)

So our flag is:
```
flag{the_horseman_really_loves_pumpkin_pie}
```
Nice! Happy Halloween! 🎃

FIN. 