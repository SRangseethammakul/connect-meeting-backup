const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const passportJWT = require("../middleware/passportJWT");
const customerController = require("../controllers/customerController");

router.post(
  "/",
  [
    body("name").not().isEmpty().withMessage("please insert name"),
    body("phonenumber")
      .not()
      .isEmpty()
      .withMessage("please insert Phone Number"),
    body("department").not().isEmpty().withMessage("please insert department"),
    body("userid").not().isEmpty().withMessage("please insert userid"),
  ],
  customerController.register
);

module.exports = router;
