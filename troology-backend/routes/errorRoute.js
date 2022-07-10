const express = require("express");
const errorController = require("./../controllers/errorController");

const router = express.Router();

router
  .route("*")
  .get(errorController.error)
  .post(errorController.error)
  .delete(errorController.error)
  .put(errorController.error)
  .patch(errorController.error);

module.exports = router;
