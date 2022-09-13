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
