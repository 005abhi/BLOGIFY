const bcrypt = require("bcrypt");
const express = require("express");
const database = require("./connect");
const objectId = require("mongodb").ObjectId;
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./config.env" });

let userRoutes = express.Router();

const SALT_ROUNDS = 10;
//crud operations

//1. retrive all
//http://15.206.185.169:3001/user

userRoutes.route("/user").get(async (req, res) => {
  let db = database.getDb();
  let data = await db.collection("user").find({}).toArray();
  if (data.length > 0) {
    res.json(data);
  } else {
    throw new Error("No data found");
  }
});

//2. retrive one
//http://15.206.185.169:3001/user/1234

userRoutes.route("/user/:id").get(async (req, res) => {
  const id = req.params.id;
  if (!objectId.isValid(id)) {
    return res.status(400).send("Invalid ID format");
  }
  let db = database.getDb();
  let data = await db.collection("user").findOne({ _id: new objectId(id) });
  if (Object.keys(data).length > 0) {
    res.json(data);
  } else {
    throw new Error("No data found");
  }
});

//3. create
//http://15.206.185.169:3001/user
userRoutes.route("/user").post(async (req, res) => {
  let db = database.getDb();

  const takenemail = await db
    .collection("user")
    .findOne({ email: req.body.email });
  if (takenemail) {
    res.json({ message: "Email already taken" });
  } else {
    const hash = await bcrypt.hash(req.body.password, SALT_ROUNDS);
    let mongoObject = {
      name: req.body.name,
      email: req.body.email,
      password: hash,
      joindate: new Date(),
      posts: [],
    };
    let data = await db.collection("user").insertOne(mongoObject);
    res.json(data);
  }
});

//4. update
//http://15.206.185.169:3001/user/1234
userRoutes.route("/user/:id").put(async (req, res) => {
  const id = req.params.id;
  if (!objectId.isValid(id)) {
    return res.status(400).send("Invalid ID format");
  }
  let db = database.getDb();
  let mongoObject = {
    $set: {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      joindate: req.body.joindate,
      posts: req.body.posts,
    },
  };
  let data = await db
    .collection("user")
    .updateOne({ _id: new objectId(id) }, mongoObject);
  res.json(data);
});

//5. delete
//http://15.206.185.169:3001/user/1234
userRoutes.route("/user/:id").delete(async (req, res) => {
  const id = req.params.id;
  if (!objectId.isValid(id)) {
    return res.status(400).send("Invalid ID format");
  }
  let db = database.getDb();
  let data = await db.collection("user").deleteOne({ _id: new objectId(id) });
  res.json(data);
});

//6. login
userRoutes.route("/user/login").post(async (req, res) => {
  let db = database.getDb();

  const user = await db
    .collection("user")
    .findOne({ email: req.body.email.toLowerCase() });

  if (user) {
    let comnfirm = await bcrypt.compare(req.body.password, user.password);
    if (comnfirm) {
      const token = jwt.sign(user, process.env.SECRETKEY, {
        expiresIn: "1h",
      });
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Password incorrect" });
    }
  } else {
    res.json({ success: false, message: "User not found" });
  }
});
module.exports = userRoutes;
