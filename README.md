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

for all the other requests other than are defined we will us _app.all_, it need to be after defined routes.
There will be different types of responds along with _404_

```javascript
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});
```

---

## builtin middleware

The express.json() function is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser. We will add the midlleware befor calling other routings.

```javascript
app.use(express.json());
```

## custom middleware

To create history of logs and showing them in the console, we will create logger.js fle in middleware directory

```console
yarn add date-fns uuid
mkdir middleware logs
```

we need to access directory of the project ad create a log file within logs folder and we can include log folder in .gitignore file
Within logs folder, we need to creaye logger.js to handle logging projess and processing the next step.

```javascript
const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLog.log");
  console.log(`${req.method} ${req.path}`);
  next();
};
```

then finnally we will require logger file and call the middleware before passing other routes below.

```javascript
const { logger } = require("./middleware/logger");
        ...
app.use(logger);
```

---

## error handler middleware

we create errorHanler file within middleware directory,we are overwirtting default error handling comes with express, we will show statuscode in this middleware. since we call LogEvents middleware, we dont need to process next()

```javascript
const errorHandler = (err, req, res, next) => {
  logEvents(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    "errLog.log"
  );
        ...
```

Finally we will call errorHandler Middleware in the end of server.js just before listining the port

```javascript
app.use(errorHandler);
```

we need one more middle ware to parse cookies than we will call this middleware in server.js

```console
yarn add cookie-parser
```

---
