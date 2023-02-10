const errorMessages = (error, req, res, next) => {
  if (error.code) {
    return res.status(error.code).json({
      status: error.status,
      message: error.message,
    });
  } else if (error.message === "Validation error") {
    return res.status(400).json({
      status: "Sequelize validation error",
      message: error.errors.map((e) => e.message),
    });
  } else if (error.name === "SequelizeForeignKeyConstraintError") {
    return res.status(401).json({
      status: "Unauthorized",
      message: error.message,
      detail: error.parent.detail,
    });
  } else if (error.stack) {
    //Internal server error
    const errStack = error.stack.split("\n");
    errStack.shift();
    const errLocation = errStack.map((e) => e.trim());
    return res.status(500).json({
      status: "Internal server error",
      message: error.message,
      stack: errLocation,
    });
  } else {
    return res.status(500).json({
      status: "Internal server error",
      message: error,
    });
  }
};

module.exports = errorMessages;
