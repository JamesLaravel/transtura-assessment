const jwt = require("jsonwebtoken");
const Riders = require("../models").Riders;

exports.Auth = (req, res, next) => {
  const { authorization } = req.headers;
  const error = new Error();

  if (!authorization) {
    error.status = 401;
    error.message = "Unauthorized";
    return next(error);
  }

  const token = authorization.split("Bearer ")[1];

  if (!token) {
    error.status = 401;
    error.message = "Invalid Token";
    return next(error);
  }

  try {
    const { user, expiresIn } = jwt.verify(token.trim(), process.env.SECERT);

    if (Date.now() >= expiresIn * 1000) {
      error.status = 401;
      error.message = "Token time out. Login again";
      return next(error);
    }

    console.log("here", user);

    Riders.findOne({
      where: {
        email: user.email,
      },
      attributes: ["email", "name"],
    }).then((res) => {
      console.log("rider", res);
      if (res === null) {
        error.status = 403;
        error.message = "Access denied";
        return next(error);
      }
    });

    req.user = user;
    return next();
  } catch (error) {
    console.log(error);
    if (error.message == "jwt expired") {
      error.message = "Token expired. Login again";
    }

    error.status = 401;
    return next(error);
  }
  //return next();
};
