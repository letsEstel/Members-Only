const express = require("express");
const { getPosts, insertPost, deletePost } = require("../db/queries");
const router = express.Router();
const passport = require("passport");

// Handle requests to the root route
router.get("/", async (req, res) => {
  const messages = await getPosts();
  console.log(messages);
  console.log(req);
  if (req.user) {
    for (let message of messages) {
      if (message.group_id != req.user.group_id) {
        message.username = "****";
      }
    }
  } else {
    for (let message of messages) {
      message.username = "****";
    }
  }
  res.render("index", {
    title: "Message Board",
    messages: messages,
    user: req.user,
  });
});
router.get("/new", (req, res) => {
  if (req.user) {
    res.render("form");
  } else {
    res.send("Please login!");
  }
});
router.post("/new", (req, res) => {
  let messageText = req.body.messageText;
  let messageUser = req.body.messageUser;
  insertPost(messageText, messageUser);
  res.redirect("/");
});

router.post("/sign-up", async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
      req.body.username,
      hashedPassword,
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
router.get("/log-in", (req, res) => {
  res.render("log-in");
});
router.get("/sign-up", (req, res) => res.render("sign-up-form"));
router.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
