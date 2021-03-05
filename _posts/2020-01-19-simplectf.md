---
title: "TryHackMe: SimpleCTF"
layout: archive
date:   2020-01-19
tags: TryHackMe
tags_label: true
---
This is a CTF for beginners from tryhackme, it is a good intro to finding and using exploits from the internet/searchsploit.

### Scanning:

Initial scan to find the machine on the network

![](/assets/images/2/s1.png)

Full scan to get details about running services

![](/assets/images/2/s2.png)

### Web:

Enumerate the server:

Used dirb, scan revealed a file robots.txt and a directory simple/
```
crazyeights@kali:~$ dirb http://10.10.126.252
``` 

Checking out robots.txt

![](/assets/images/2/s3.png)

In the folder simple/ we found out that the server is running: CMS Made Simple version 2.2.8

Found an exploit using searchsploit: CMS Made Simple < 2.2.10 - SQL Injection, exploits/php/webapps/46635.py

##### Running the exploit:

![](/assets/images/2/s4.png)

##### Cracking the hash:

Use john with the wordlist /usr/share/seclists/Passwords/Common-Credentials/best110.txt. The cracked hash is secret.

We now have credentials mitch:secret

### User:

Login with SSH as mitch:

![](/assets/images/2/s5.png)

#### User Flag:

![](/assets/images/2/s6.png)

### Root:

Check if the user can run any commands with elevated privileges:

![](/assets/images/2/s7.png)

#### Vim shell
```
:!sh
```

#### Root Flag:

![](/assets/images/2/s8.png)

Fin.