exports.index = async (req, res, next) => {
  try {
    res.status(200).json({
      data: "rooms",
    });
  } catch (error) {
    next(error);
  }
};
