const { Pool } = require("pg");
const connectionString = process.env.CONNECTION_STRING;

// Check if the connection string is defined
if (!connectionString) {
  throw new Error(
    "DATABASE CONNECTION STRING is not defined in environment variables."
  );
}

const pool = new Pool({
  connectionString: connectionString,
});

// Handle connection errors
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

module.exports = pool;
