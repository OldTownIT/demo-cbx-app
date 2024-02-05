## Nucleus Admin

Vite + ViTest + JavaScript + React + Redux + Mui + ESLint + Prettier

#### Getting Started

Make sure nodejs is installed.  Tested using node v 18.16.1

#### Clone the repo

```
git clone https://github.com/oldtownit/demo-cbx-app
```

```
cd demo-cbx-app
```

#### Install Dependencies

```
npm ci
```

You can also run `npm install` here, but the `ci` command insures that node_modules gets cleaned for a "fresh" install based on package-lock.json.  [[stack overflow](https://stackoverflow.com/questions/52499617/what-is-the-difference-between-npm-install-and-npm-ci)]

#### Run

```
npm run dev
```

#### Paths

Application using absolute paths
Example: '@/components/Counter/Counter';


### Scripts


| Script           | Description                         |
| ---------------- | ----------------------------------  |
| npm run dev      | Runs the application.               |
| npm run build    | Makes prod build in "/build-local"  |
| npm run deploy   | Makes prod build in "/build-deploy" |
| npm run preview  | Runs the Vite preview               |
| npm run lint     | Display eslint errors               |
| npm run lint:fix | Fix the eslint errors               |
| npm run format   | Runs prettier for all files         |
| npm run test     | Run tests                           |


Note that `npm run build` and `npm run deploy` do fundamentally the same thing.  They just build and put the "prod" vesion of the app in a different folder.  So there is no actual deploy happening out of the box (these scripts don't deliver the built app to another place).


### SERVER CONFIGURATION

At the top level of the repo, there is a file called `vite.config.js` where you can change some options.  If you can't get HTTPS set up on your machine, you can comment out the "server" object in the `vite.config.js` file.

```
// ---- COMMENT OUT THIS "server" SECTION IF YOU CAN'T USE HTTPS ----
server: {
    port: 443,
    host: '127.0.0.6',
    https: sslSettings,
},
// ---- -------- ---- ---- ---- ---- ---- ---- ---- ---- ---- -------

```

In the `/config/` directory you will find `/config/ssl-settings-example.js`.  

You should make a copy and call it `/config/ssl-settings.js`  That file has a reference to some credentials that provide ssl https security for your local server.  The rest of these instructions are about how to create the files that the `ssl-settings.js` is lookng for.

If you're doing any significant development, then **SSL is necessary**.  Browsers behave differently, CORS behaves differently, when your server is secure.  We need to test and develop in a secure environment.  If we don't, then surprises and failures await us.

### SSL CONFIGURATION

To set up an HTTPS server, we need openssl.  On windows, git includes a version of openssl.exe, which might work for you.  Or you can install it using chocolatey

```
choco install openssl
```

Or you can [check stackoverflow](https://stackoverflow.com/questions/50625283/how-to-install-openssl-in-windows-10) for more details about how to get openssl installed on your machine, and registered in the PATH list.  The point is, we need to make a key and certificate that our machine trusts, that the server can use for SSL.

The following examples assume a file structure like this

```
/your-git-repos/
    /nuke-admin/
    /openSSL/
```

In the `/openSSL/` directory, you can save a file called `"cbx_demo_ssl.cnf"`.

The file should have this text:

```
[req]
distinguished_name = req_distinguished_name
x509_extensions = v3_req
prompt = no
[req_distinguished_name]
C = US
ST = VA
L = Alexandria
O = Gravitate
OU = Nucleus
CN = www.localhost.com
[v3_req]
keyUsage = critical, digitalSignature, keyAgreement
extendedKeyUsage = serverAuth
subjectAltName = @alt_names
[alt_names]
DNS.1 = www.cbx-demo.test
DNS.2 = cbx-demo.test
DNS.3 = localhost
```

There are options in this cnf file that we don't care much about.  But the last lines of this setup should let you add "https://cbx-demo.test" to your `hosts` file later, and then use that URL in your browseer.

Once you have saved `"cbx_demo_ssl.cnf"`, run a terminal window in /your-git-repos/openSSL/

This is the command...

```
openssl req -x509 -nodes -days 3650 -newkey rsa:2048 -keyout cbx_demo_ssl.key -out cbx_demo_ssl.crt -config cbx_demo_ssl.cnf -sha256

```

Here is a breakdown of that command

```
openssl req 
    -x509 
    -nodes 
    -days 3650                 # valid for 10 years
    -newkey rsa:2048 
    -keyout cbx_demo_ssl.key   # file name for generated "key" file
    -out cbx_demo_ssl.crt      # file name for generated "cert" file
    -config cbx_demo_ssl.cnf   # file name of source for config items
    -sha256
```

If you run this command successfully, you should end up with 3 files in your `/openSSL/` folder.

```
/your-git-repos/
    /cbx-demo/
    /openSSL/
        cbx_demo_ssl.cnf
        cbx_demo_ssl.crt
        cbx_demo_ssl.key
```

Now double-click on the `cbx_demo_ssl.crt` file.  In windows, you should see a certificate screen...

![Windows Certificate 1](https://user-images.githubusercontent.com/556467/148208938-e47549dc-1db8-4827-a03d-ed55997db0b3.png)

Click on "Install Certificate"  
and then click on "Place all certificates in the followin store"   
and then click the [Browse] button.

![Windows Cert 2](https://user-images.githubusercontent.com/556467/148209535-2c72c0d3-f6b8-4ebe-afd4-02f1a7b73e85.png)

Choose the "Trusted Root Certification Authorities" folder, and click "OK".  You should now be done.  The certificate is installed.

### The `hosts` file.

To reference a real URL besides "localhost", we need to add an entry to the `hosts` file.

On windows, you find the hosts file here:

```
C:\Windows\System32\drivers\etc\hosts
```

Open it with an editor, and add a line to the file (you will need admin access to save this edit)

```
# Copyright (c) 1993-2009 Microsoft Corp.
#
# This is a sample HOSTS file used by Microsoft TCP/IP for Windows.
# localhost name resolution is handled within DNS itself.
#   127.0.0.1       localhost
#   ::1             localhost
127.0.0.6           cbx-demo.test
```

The lines beginning with `#` are comments.  The last line is the one you need to add, so that `cbx-demo.test` is available as a URL for your browser.

Now it is time to **REBOOT your machine**.  In theory, you don't need to reboot, and your browser and terminal windows can just be refreshed with various commands to `ipconfig`.  However, on Windows, I have never gotten SSL certificates to work properly without a full reboot.  Your mileage may vary.

Assuming you have followed the above steps for installing an SSL certificate, and you are using `http-server` to serve the website, you should now be ready to serve the website via https.  

