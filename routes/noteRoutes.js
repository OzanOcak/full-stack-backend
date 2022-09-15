const express = require("express");
const { patch } = require("./root");
const router = express.Router();
const noteController = require("../controllers/noteController");

router
  .route("/")
  .get(noteController.getAllNotes)
  .post(noteController.createNewNote)
  .patch(noteController.updateNote)
  .delete(noteController.deleteNote);

module.exports = router;
