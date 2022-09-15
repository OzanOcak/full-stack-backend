const User = require("../models/User");
const Note = require("../models/Note");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// --------------------------
// desc: Get all users
// route: GET /users
// access: Private
const getAllUsers = asyncHandler(async (req, res) => {
  // Get all users from MongoDB
  const users = await User.find().select("-password").lean();
  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }
  /* res.json(typeof users);
  users is an object, basically function pointer,
  we first find User fields then selec no password
  then lean it to json(get ridd of all other build in methods)
  then finally execute it 
  we also use return if object array is empty cuz it may not return it cz of header already sent
  since user is object, empty object stills truthy so we need to use `if (!users?.length)`*/
  res.json(users);
});

// --------------------------
// desc: Create new user
// route: POST /users
// access: Private
const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;
  // Confirm data
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: "All fields are required" });
  }
  // Check for duplicate username
  const duplicate = await User.findOne({ username }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate username" });
  }
  // Hash password
  const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

  const userObject = { username, password: hashedPwd, roles };

  // Create and store new user
  const user = await User.create(userObject);

  if (user) {
    //created
    res.status(201).json({ message: `New user ${username} created` });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
});

// --------------------------
// desc: Update a user
// route: PATCH /users
// access: Private
const updateUser = asyncHandler(async (req, res) => {});

// --------------------------
// desc: Delete a user
// route: DELETE /users
// access: Private
const deleteUser = asyncHandler(async (req, res) => {});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
