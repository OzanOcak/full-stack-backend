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

## Cors

Accessing from one process of browser to another is not allowed thus if we try to _fetch('http://localhost:3500')_ on google on the browaser console, we will get cors error

```console
yarn add cors
```

and if we use the middleware in server

```javascript
const cors = require("cors");
   ...
app.use(cors());
```

now we can access localhost server from browser, it will not give error but we can create our white list in order to protect back-end

create allowedOrigins.js corsOptions.js in config directory

```javascript
const allowedOrigins = ["http://localhost:3000"];
module.exports = allowedOrigins;
```

then call allowedOrigins in corsOptions.js

```javascript
const allowedOrigins = require("./allowedOrigins");

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
```

finally giving corsOptions as an argument in _cors(corsOptions)_ will allow the app only accessable for http://localhost:3000 or other given URLs.

---

## MongoDb

```console
yarn add dotenv
```

we need to add it in the beggining of server.js

```javascript
require("dotenv").config();
```

now we can create .env file, we should also add .env into .gitignore

```console
NODE_ENV=development
DATABASE_URI=mongodb+srv://<username>:<password>@cluster0.h5i9m07.mongodb.net/<databasename>?retryWrites=true&w=majority
```

### creating mongo database :

- create new project and name it
- click on build a database and create shared cloud which is free
- pick a cloud provider & region, name a cluster name create the cluster
- fill username and password your connection for authorization
- click add my current IP address, and click finish and close
- go database, click browse collection, click add my own data
- fill database name (ex. bookstoreDB) and collection name (ex. users)
- go database and click connect you application
- modify DATABASE_URI with username, password and databasename

Now we are done with mongoDB set up, we need mongoose for creating database schemas.
Mongoose is a MongoDB ODM (the NoSQL equivalent of an ORM) for Node. It provides you with a simple validation and query API to help you interact with your MongoDB database.

```javascript
yarn add mongoose
```

Now we can create schemas to crate database collections and data. We need create Note.js and User.js in models directory

- user model

```javascript
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  roles: [{ type: String, default: "Employee" }],
  active: { type: Boolean, default: true },
});
module.exports = mongoose.model("User", userSchema);
```

- note model

```javascript
const mongoose = require("mongoose");
const noteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    title: { type: String, required: true },
    text: { type: String, default: "Employee" },
    completed: { type: Boolean, default: false },
  },
  { timestamp: true }
);
module.exports = mongoose.model("Note", noteSchema);
```

Notes should assign to specific users thus we get ObjectId of reference User.
we also want when note created so we put another object as additionally timestamp.

MongoDb object id will autamatically created but they are very long strings and we want sequencial ticket number,
thus we will use another package

```console
yarn add mongo-sequence
```

then we will include in Note model, give n inc_field and id name and start counting it from 500

```javascript
const AutoIncrement = require("mongoose-sequence")(mongoose);

noteSchema.plugin(AutoIncrement, {
  inc_field: "ticket",
  id: "ticketNums",
  start_seq: 500,
});
```

Finally we code the connection; create dbConn.js under config directory

```javascript
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
  } catch (err) {
    console.log(err);
  }
};
module.exports = connectDB;
```

Then in server.js, then mongoose connect method will be called once when is the port open
and event listener will always on listening errors

```javascript
connectDB()
    ...
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})
```

---

## userController and userRoutes set-up

We start with adding npm packages;
express-async-handler handle exception so we dont need to try catch and throw error.

```console
yarn add express-async-handler bcrypt
```

then we will create a userController under controllers directory, wrap all the CRUD ops methods by asyncHandler then export them.

```javascript
const getAllUsers = asyncHandler(async (req, res) => {});
const createNewUser = asyncHandler(async (req, res) => {});
const updateUser = asyncHandler(async (req, res) => {});
const deleteUser = asyncHandler(async (req, res) => {});

module.exports = { getAllUsers, createNewUser, updateUser, deleteUser };
```

Then we will create userRoutes.js under routes, will create chainable route handle then will export it.

```javascript
router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createNewUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
```

Finally we will import userRoutes.js in server just after _use("/")_

```javascript
app.use("/users", require("./routes/userRoutes"));
```

---

## Logic of creating and getting users in controllers

We will fill the logic inside of _getAllUsers_ function,
users is an object, basically function pointer,
we first find User fields then selec no password
then lean it to json(get rid of all other build in methods)
then finally execute it
we also use return if object array is empty cuz it may not return it cz of header already sent
since user is object, empty object stills truthy so we need to use `if (!users?.length)`

```javascript
const users = await User.find().select("-password").lean();
if (!users?.length) {
  return res.status(400).json({ message: "No users found" });
}
res.json(users);
```

Then with in createUser function;
we first assign req.body arguments to variable to check them is exist in the request (400)
we also check if there is any duplication (409)
then hash the password with bcrpt npm package
then assign all the user's data new object to create new user

```javascript
const { username, password, roles } = req.body;
if (!username || !password || !Array.isArray(roles) || !roles.length) {
  return res.status(400).json({ message: "All fields are required" });
}
const duplicate = await User.findOne({ username }).lean().exec();
if (duplicate) {
  return res.status(409).json({ message: "Duplicate username" });
}
const hashedPwd = await bcrypt.hash(password, 10); // salt rounds
const userObject = { username, password: hashedPwd, roles };
const user = await User.create(userObject);
if (user) {
  res.status(201).json({ message: `New user ${username} created` });
} else {
  res.status(400).json({ message: "Invalid user data received" });
}
```

Now we can create(post) new user and get them all
whenever we send json type data, we have to add Content-type: application/json in the header
in curl -H flag indicates header

```console
curl -X POST -d '{"username":"Carr","password":"123456","roles":["employee"]}' -H 'content-type:application/json' http://localhost:4000/users

curl -X GET http://localhost:4000/users

curl http://localhost:4000/users -X DELETE -d '{"id": "6323265874f28ead05909faa"}' -H 'Content-type:application/json'

curl http://localhost:4000/users -X PATCH
-d {
	"id": "63232d7baf87f6d15a100018",
	"username": "jan",
	"password": "123456",
	"roles": ["employee"],
	"active": true
}
-H 'Content-type:application/json'
```

---

## Authentication :

Authentication means getting access with user id and password while Authorization mean having additional privillage to access some of protected routes.

We will start creating authController.js file

```javascript
const login = asyncHandler(async (req, res) => {});
const refresh = (req, res) => {};
const logout = (req, res) => {};

module.exports = { login, refresh, logout };
```

We need json web token for refresh method. when we access /refresh, new _access token_ will be created to give us authorization

```consol
yarn add jsonwebtoke
```

Then authRouthes.js to route and we will use route methods

```javascript
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.route("/").post(authController.login);
router.route("/refresh").get(authController.refresh);
router.route("/logout").post(authController.logout);

module.exports = router;
```

And finally we can add auth routh in the server.js as a middleware

```javascript
app.use("/auth", require("./routes/authRoutes"));
```

---

in the .env we need to fill 2 line

```console
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
```

in the terminal

```console
node
require('crpto').randomBytes(64).toString('hex') // for access token secret
require('crpto').randomBytes(64).toString('hex') // for refresh token secret
```

**login** function of controllers must check if the requirements full-filled incluided crupted password is matched along with user name, then should create access token, refresh token and cookie with refresh token and
responde with accress token

**refresh** function of controllers must check if there is token in the request, if there is, should check if it is matched with the one in .env then create new access token and responde with it.

**logou** function of controllers, should clear the token.

- all these functions are activated with the route
