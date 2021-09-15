const User = require("../models/user");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("../config/index");
const axios = require("axios");

exports.register = async (req, res, next) => {
  try {
    const { name, userName, password } = req.body;

    //validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("format invalid");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }

    //check userName
    const existUserName = await User.findOne({
      userName: userName,
    });
    if (existUserName) {
      const error = new Error("exist UserName repeat");
      error.statusCode = 400;
      throw error;
    }
    let user = new User();
    user.name = name;
    user.userName = userName;
    user.password = await user.encryPassword(password);
    await user.save();
    return res.status(201).json({
      message: "registed",
    });
  } catch (error) {
    next(error);
  }
};
exports.login = async (req, res, next) => {
  try {
    const { userName, password } = req.body;

    //check userName exist system
    const user = await User.findOne({
        userName: userName,
    });
    if (!user) {
      const error = new Error("not found user");
      error.statusCode = 404;
      throw error;
    }
    // compare password ถ้าไม่ตรง Return false
    const isValid = await user.checkPassword(password);
    if (!isValid) {
      const error = new Error("password invalid");
      error.statusCode = 401;
      throw error;
    }

    //create token
    const token = await jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      config.JWT_SECRET,
      {
        expiresIn: "2 days",
      }
    );

    //decode expiresIn
    const expires_in = jwt.decode(token);
    return res.status(200).json({
      message: "login success",
      access_token: token,
      expires_in: expires_in.exp,
      token_type: "Bearer",
    });
  } catch (error) {
    next(error);
  }
};
exports.profile = async (req, res, next) => {
  try {
    const { _id, name, userName } = req.user;
    return res.status(200).json({
      user: {
        id: _id,
        name: name,
        userName: userName,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getProfileLine = async (req, res, next) => {
  const { access_token } = req.body;
  const respProfile = await axios.get("https://api.line.me/v2/profile", {
    headers: {
      Authorization: "Bearer " + access_token,
    },
  });
  console.log(respProfile.data);
};
exports.index = async (req, res, next) => {
  try {
    const user = await User.find().select("-password").sort({ _id: -1 });
    res.status(200).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
