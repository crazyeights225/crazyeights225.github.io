---
title: "Vulnhub: HappyCorp"
layout: archive
date:   2021-01-20
tags: Vulnhub
tags_label: true
---
This box was fun. It has some interesting vulnerabilities that you don't often see. The flow and pace was also nice. It is a great box for beginners. 10/10 - Nice 😁

Scanning
--------

Finding the box on the network using SYN scan.

```
nmap -PS 192.168.202.130

Starting Nmap 7.80 (https://nmap.org) at 2021-01-20 21:44 EST
Nmap scan report for 192.168.202.130
Host is up (0.0010s latency).
Not shown: 996 closed ports
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
111/tcp  open  rpcbind
2049/tcp open  nfs
```

Starting with the web service as always.

#### Web

Index Page:

![](/assets/images/happycorp/Screenshot_from_2021-01-20_21-46-23.png)

Enumerating pages and directories using dirsearch:

```
python3 tools/dirsearch/dirsearch.py -u http://192.168.202.130/ -E
```

![](/assets/images/happycorp/Screenshot_from_2021-01-20_21-45-51.png)

Visit the admin page:

![](/assets/images/happycorp/Screenshot_from_2021-01-20_21-47-14.png)

When you look in the page source you see:

![](/assets/images/happycorp/Screenshot_from_2021-01-20_21-47-35.png)

Assuming this means that this login page doesn't work. I tried to find credentials anyway.

On the index page there are several emails:

```
heather@happycorp.local
carolyn@happycorp.local
rodney@happycorp.local
jennifer@happycorp.local
```

When we try heather on the login page it gives the message "Invalid password" instead of "Invalid email" meaning that the user heather is a valid user.

When we try and crack the password for heather apparently the password is also heather. It does not actually work, so moving on to the NFS.

![](/assets/images/happycorp/Screenshot_from_2021-01-20_23-23-17.png)

#### NFS

List available shares. (Using the script I wrote)

![](/assets/images/happycorp/Screenshot_from_2021-01-20_22-03-49.png)

Mount the available share to view files:

![](/assets/images/happycorp/Screenshot_from_2021-01-20_22-05-09.png)

In the mounted share we can see the files are owned by a user with UID 1001:

![](/assets/images/happycorp/Screenshot_from_2021-01-20_22-05-33.png)


If we create a user on our machine with the uid 1001 as well we can read the files. I created a user with uid 1001 using the useradd command. For simplicity I also named the new user karl, and I set their password to karl as well.

![](/assets/images/happycorp/Screenshot_from_2021-01-20_22-15-25.png)

Login as the user we created: karl, and we now have access to all karl's files:

![](/assets/images/happycorp/Screenshot_from_2021-01-20_22-16-15.png)

#### User

Karl has a directory .ssh, so we can get his private key which will allow us to login as karl via SSH.

In Karl's ssh directory we also find a flag:

![](/assets/images/happycorp/Screenshot_from_2021-01-20_22-16-38.png)

Retrieve karl's private key:

I did `cat id_rsa` and copy pasted the output into a text file.

Karl's private key is password protected, so we must crack the password for the key before we can use it.

![](/assets/images/happycorp/Screenshot_from_2021-01-20_22-22-48.png)

Use ssh2john to retrieve the password hash for the private key:

```
python /usr/share/ssh2john.py karl_id_rsa
```

![](/assets/images/happycorp/Screenshot_from_2021-01-20_22-22-24.png)

Crack the password hash for the private key:

![](/assets/images/happycorp/Screenshot_from_2021-01-20_22-24-53.png)
Now that the have the password for the private key we can now login in as karl via SSH with the password sheep:

```
ssh -i karl_id_rsa karl@192.168.202.130
```

We can see that when we are logged in we are stuck in a restricted shell, that doesn't really seem to work, it seems to continuously spawn new processes:

![](/assets/images/happycorp/Screenshot_from_2021-01-20_22-43-31.png)

Trying to kill all the processes doesn't work.

Log out and log back in using the -t parameter to force pseudo-terminal allocation. Set the pseudo-terminal to sh.

We now can use the terminal normally:

![](/assets/images/happycorp/Screenshot_from_2021-01-20_22-46-03.png)

#### Root

We find the programs that have the SUID bit set. The /bin/cp program having the SUID bit set is unusual and can be exploited.

We can use cp to read from and write to files owned by root. For example /etc/shadow:

![](/assets/images/happycorp/Screenshot_from_2021-01-20_23-03-49.png)

To get a root shell we can insert our public key (id\_rsa.pub) into karl's authorized\_keys and copy the folder .ssh to root (since root doesn't have an .ssh folder).

```
$ echo "ssh-rsa AAAAB3Nza_my_public_key" > .ssh/authorized_keys

$ /bin/cp -r .ssh/ /root/
```

We can now login as root via ssh and get the root flag:

![](/assets/images/happycorp/Screenshot_from_2021-01-20_23-15-43.png)

### Cleanup

To clean up I am going to want to delete the user karl:

![](/assets/images/happycorp/Screenshot_from_2021-01-20_23-17-28.png)

FIN. 🥳