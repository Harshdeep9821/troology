const express = require("express");
const userAuthController = require("./../controllers/userAuthController");

const router = express.Router();

router.route("/register").post(userAuthController.register);
router.route("/login").post(userAuthController.login);
router.route("/logout").get(userAuthController.logout);
router.route("/check").post(userAuthController.checkUser);
router
  .route("/getUserData")
  .get(userAuthController.protect, userAuthController.getUserData);

module.exports = router;
