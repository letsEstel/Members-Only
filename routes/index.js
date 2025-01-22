const express = require("express");
const { getPosts, insertPost, deletePost } = require("../db/queries");
const router = express.Router();
const passport = require("passport");

// Handle requests to the root route
router.get("/", async (req, res) => {
  const messages = await getPosts();
  console.log(messages);
  res.render("index", { title: "Message Board", messages: messages });
});
router.get("/new", (req, res) => {
  res.render("form");
});
router.post("/new", (req, res) => {
  let messageText = req.body.messageText;
  let messageUser = req.body.messageUser;
  insertPost(messageText, messageUser);
  res.redirect("/");
});

router.post("/sign-up", async (req, res, next) => {
  try {
    await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
      req.body.username,
      req.body.password,
    ]);
    res.redirect("/");
  } catch (err) {
    return next(err);
  }
});
router.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);

router.get("/sign-up", (req, res) => res.render("sign-up-form"));
module.exports = router;
