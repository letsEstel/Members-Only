const { Pool } = require("pg");
const connectionString = process.env.CONNECTION_STRING;

module.exports = new Pool({
  connectionString,
});
