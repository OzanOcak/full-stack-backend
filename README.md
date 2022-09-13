```console
node -v
npm -v
yarn -v
npm init -y
```

initialization npm will create a json file which will keep dependencies and scripts to run server

```console
yarn add express
yarn add -D nodemon
```

we will add express node package as a dependency and nodemon for develping environtment with -D flag then we will modify start and dev script.

```json
{
  "name": "full-stack-tut",
  "version": "1.0.0",
  "description": "backend for ticketting app",
  "main": "server.js",
  "scripts": {
    "start": "node server",
    "dev": "nodemon server"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.1"
  },
  "devDependencies": {
    "nodemon": "^2.0.19"
  }
}
```

git initilazition and adding gitignore file in order to not to push somefile to github.For now we will add node_modules in .gitignore and server.js files.

```console
git init
touch .gitignore server.js
```

Express, is a back end web application framework for Node.js. We will require it in server.js.

```javascript
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3500;

app.listen(PORT, () => console.log(`server is running on the port ${PORT}`));
```

We can run _yarn dev_ in terminal. We will see log in the terminal.

---

we will require path in order to access folders then we will create css file in public folder

```javascript
const path = require("path");
       ...
app.listen(PORT, () => console.log(`server is running on the port ${PORT}`));
```

we want to respond with html page to requests, we need to use express to direct _get_ url and neet to us path to accecc files in **../views/index.html**

create root.js in routes and html file in views directory.

```javascript
const express = require("express");
const router = express.Router();
const path = require("path");

router.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

module.exports = router;
```

And finally if we call the root in server.js

```javascript
app.use("/", require("./routes/root"));
```

now index.html will be publicly accessible when we access the port 3500 in the browser

---
