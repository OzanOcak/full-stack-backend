const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

//desc: login
//route POST /auth/login
//access public
const login = asyncHandler(async (req, res) => {});

//desc: refresh
//route GET /auth/refresh
//access public - need to get new access token when it is expired
const refresh = (req, res) => {};

//desc: login
//route POST /auth/logout
//access public - clear cookie if exist
const logout = (req, res) => {};

module.exports = {
  login,
  refresh,
  logout,
};
