const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.validateInputData = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errors.array();
  }

  return false;
};

exports.getSignedToken = (user) => {
  return jwt.sign(
    {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    },
    process.env.SECERT,
    {
      expiresIn: process.env.EXP,
    }
  );
};
