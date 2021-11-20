require("dotenv").config();

const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME, DB_DRIVER, DB_PORT } =
  process.env;
module.exports = {
  development: {
    username: DB_USERNAME,
    port: DB_PORT,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    dialect: DB_DRIVER,
  },
  test: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    dialect: DB_DRIVER,
  },
  production: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    dialect: DB_DRIVER,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
