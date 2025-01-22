const { Client } = require("pg");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// SQL to create the tables
const SQL = `
CREATE TABLE IF NOT EXISTS groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    pwd TEXT NOT NULL,
    group_id INT REFERENCES groups(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    post TEXT NOT NULL,
    username VARCHAR(255) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
    date TIMESTAMP NOT NULL,
    group_id INT REFERENCES groups(id) ON DELETE CASCADE
);
`;

// Sample groups, users, and messages
const groups = ["Gensis", "2049"];
const users = [
  { username: "Alice", password: "alicepwd", group: "Gensis" },
  { username: "Joi", password: "joipwd", group: "2049" },
  { username: "Charlie", password: "charliepwd", group: "Gensis" },
  { username: "Diana", password: "dianapwd", group: "Gensis" },
];
const messages = [
  {
    post: "Hello, world!",
    username: "Alice",
    date: new Date("2025-01-01T10:00:00"),
    group: "Gensis",
  },
  {
    post: "I want to be real for you",
    username: "Joi",
    date: new Date("2049-08-17T12:00:00"),
    group: "2049",
  },
  {
    post: "This is a great message board!",
    username: "Charlie",
    date: new Date("2025-01-03T14:00:00"),
    group: "Gensis",
  },
  {
    post: "Happy New Year!",
    username: "Diana",
    date: new Date("2025-01-01T00:00:00"),
    group: "Gensis",
  },
];

async function populateDatabase() {
  let client;

  try {
    console.log("Connecting to the database...");
    client = new Client({ connectionString: process.env.CONNECTION_STRING });
    await client.connect();

    console.log("Creating tables...");
    await client.query(SQL);

    console.log("Inserting groups...");
    for (const group of groups) {
      await client.query(
        "INSERT INTO groups (name) VALUES ($1) ON CONFLICT (name) DO NOTHING",
        [group]
      );
    }

    console.log("Inserting users...");
    for (const user of users) {
      const { username, password, group } = user;

      // Get the group ID for the user
      const groupResult = await client.query(
        "SELECT id FROM groups WHERE name = $1",
        [group]
      );
      const groupId = groupResult.rows[0].id;

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the user
      await client.query(
        "INSERT INTO users (username, pwd, group_id) VALUES ($1, $2, $3) ON CONFLICT (username) DO NOTHING",
        [username, hashedPassword, groupId]
      );
    }

    console.log("Inserting messages...");
    for (const message of messages) {
      const { post, username, date, group } = message;

      // Get the group ID for the message
      const groupResult = await client.query(
        "SELECT id FROM groups WHERE name = $1",
        [group]
      );
      const groupId = groupResult.rows[0].id;

      // Insert the message
      await client.query(
        "INSERT INTO messages (post, username, date, group_id) VALUES ($1, $2, $3, $4)",
        [post, username, date, groupId]
      );
    }

    console.log("Database populated successfully.");
  } catch (err) {
    console.error("Error populating the database:", err);
  } finally {
    if (client) {
      await client.end();
      console.log("Database connection closed.");
    }
  }
}

// Run the populate script
populateDatabase();
