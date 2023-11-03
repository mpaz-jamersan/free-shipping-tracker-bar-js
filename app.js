const express = require("express");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config();
const {
  getBCAuth,
  buildRedirectUrl,
  getBCVerify,
  encodePayload,
} = require("./bigcommerce");
global.session = null;

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/auth", async (req, res) => {
  console.log("auth..");
  try {
    const session = await getBCAuth(req.query);
    const encodedContext = encodePayload(session);
    global.session = session;
    res.redirect(302, `?context=${encodedContext}`);
  } catch (error) {
    const { message, response } = error;
    res.status(response?.status || 500).json({ message });
  }
});

app.get("/load", async (req, res) => {
  console.log("load..");
  try {
    const session = await getBCVerify(req.query);
    console.log("session..", session);
    const encodedContext = encodePayload(session);
    global.session = session;
    res.redirect(302, buildRedirectUrl(session.url, encodedContext));
  } catch (error) {
    const { message, response } = error;
    console.log("error..", error);

    res.status(response?.status || 500).json({ message });
  }
});

app.get("/logout", (req, res) => {
  try {
    global.session = null;
    res.status(200).end();
  } catch (error) {
    const { message, response } = error;
    res.status(response?.status || 500).json({ message });
  }
});

app.get("/uninstall", async (req, res) => {
  try {
    global.session = null;
    res.status(200).end();
  } catch (error) {
    const { message, response } = error;
    res.status(response?.status || 500).json({ message });
  }
});

app.get("/remove-user", async (req, res) => {
  try {
    global.session = null;
    res.status(200).end();
  } catch (error) {
    const { message, response } = error;
    res.status(response?.status || 500).json({ message });
  }
});

app.get("/", (req, res) => {
  res.send("home");
});

app.listen(4000, function () {
  console.log("SERVER STARTED ON localhost:4000");
});
