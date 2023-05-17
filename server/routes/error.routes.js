const errorMessages = (error, req, res, next) => {
  let response = {
    status: "Internal server error",
    message: error,
  };

  switch (true) {
    case error.code !== undefined:
      response = {
        status: error.status,
        message: error.message,
      };
      return res.status(error.code).json(response);

    case error.message === "Validation error":
      response = {
        status: "Sequelize validation error",
        message: error.errors.map((e) => e.message),
      };
      return res.status(400).json(response);

    case error.name === "SequelizeForeignKeyConstraintError":
      response = {
        status: "Unauthorized",
        message: error.message,
        detail: error.parent.detail,
      };
      return res.status(401).json(response);

    case error.stack !== undefined:
      const errStack = error.stack
        .split("\n")
        .slice(1)
        .map((e) => e.trim());
      response = {
        status: "Internal server error",
        message: error.message,
        stack: errStack,
      };
      return res.status(500).json(response);

    default:
      return res.status(500).json(response);
  }
};

module.exports = errorMessages;
