const pool = require("./pool");

async function getPosts() {
  const { rows } = await pool.query("SELECT * FROM messages");
  return rows;
}

async function insertPost(post, username, date, groupId) {
  await pool.query(
    "INSERT INTO messages (post, username, date, group_id) VALUES ($1, $2, $3, $4)",
    [post, username, date, groupId]
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
