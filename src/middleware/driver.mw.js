const jwt = require("jsonwebtoken");
const Drivers = require("../models").Drivers;

exports.DriverAuth = (req, res, next) => {
  const { authorization } = req.headers;
  const error = new Error();

  //console.log(authorization);
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
    const { user, expiresIn } = jwt.verify(token, process.env.SECERT);
    if (Date.now() >= expiresIn * 1000) {
      error.status = 401;
      error.message = "Token time out. Login again";
      return next(error);
    }

    Drivers.findOne({
      where: {
        email: user.email,
      },
      attributes: ["email", "name"],
    }).then((res) => {
      if (res === null) {
        error.status = 403;
        error.message = "Access denied";
        return next(error);
      }
    });

    req.user = user;
    return next();
  } catch (error) {
    //console.log(error);
    if (error.message == "jwt expired") {
      error.message = "Token expired. Login again";
    }

    error.status = 401;
    return next(error);
  }
  //return next();
};
