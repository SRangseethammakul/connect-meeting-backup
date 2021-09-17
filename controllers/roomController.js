const Room = require("../models/room");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("../config/index");
const axios = require("axios");

exports.index = async (req, res, next) => {
  try {
    const rooms = await Room.find().select("-id").sort({ _id: -1 });
    res.status(200).json({
      data: rooms,
    });
  } catch (error) {
    next(error);
  }
};
exports.insert = async (req, res, next) => {
  try {
    const { name } = req.body;
    let room = new Room({
      name: name,
    });
    await room.save();
    res.status(201).json({
      data: room,
    });
  } catch (error) {
    next(error);
  }
};
exports.show = async (req, res, next) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id);
    if (!room) {
      throw new Error("Not Found Data");
    }
    res.status(200).json({
      data: room,
    });
  } catch (error) {
    next(error);
  }
};
exports.edit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, isUsed } = req.body;
    const room = await Room.updateOne(
      { _id: id },
      {
        name: name,
        isUsed: isUsed,
      }
    );
    if (room.nModified === 0) {
      throw new Error("ไม่สามารถแก้ไขข้อมูลได้");
    } else {
      res.status(200).json({
        message: "updated",
      });
    }
  } catch (error) {
    next(error);
  }
};
exports.destroy = async (req, res, next) => {
  try{
      const { id } = req.params;
      const room = await Room.deleteOne({_id:id});
      if(room.deletedCount === 0){
          throw new Error('ไม่สามารถลบข้อมูลได้');
      }else {
          res.status(200).json({
              message: 'deleted'
          });
      }
  }catch(error){
      res.status(400).json({
          error : {
              message : 'Error ' + error.message
          }
      });
  }
}