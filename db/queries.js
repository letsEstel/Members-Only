const pool = require("./pool");

async function getPosts() {
  const { rows } = await pool.query("SELECT * FROM messages");
  return rows;
}

async function insertPost(post, name) {
  await pool.query(
    "INSERT INTO messages (post, name, date) VALUES ($1, $2, NOW())",
    [post, name]
  );
}

async function deletePost(id) {
  await pool.query("DELETE FROM messages WHERE id = $1", [id]);
}

module.exports = {
  getPosts,
  insertPost,
  deletePost,
};
