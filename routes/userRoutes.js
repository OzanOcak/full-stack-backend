const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT); // without token you can not route anywhere it fetches data from db

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createNewUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
