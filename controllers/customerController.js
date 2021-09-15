const Customer = require("../models/customer");
const { validationResult } = require("express-validator");
exports.register = async (req, res, next) => {
  try {
    const { name, phonenumber, department, userid } = req.body;
    //validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("format invalid");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }

    //check userName
    const existUserName = await Customer.findOne({
      userId: userid,
    });
    if (existUserName) {
      const error = new Error("คุณได้ทำการลงทะเบียนแล้ว");
      error.statusCode = 400;
      throw error;
    }
    let customer = new Customer();
    customer.userId = userid;
    customer.name = name;
    customer.numberPhone = phonenumber;
    customer.department = department;
    await customer.save();
    return res.status(201).json({
      message: "registed",
    });
  } catch (error) {
    next(error);
  }
};
