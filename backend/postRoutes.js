const express = require("express");
const database = require("./connect");
const objectId = require("mongodb").ObjectId;
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./config.env" });

let postRoutes = express.Router();

//crud operations

//1. retrive all
//http://15.206.185.169:3001/post

postRoutes.route("/post").get(verifytokens, async (req, res) => {
  let db = database.getDb();
  let data = await db.collection("post").find({}).toArray();
  if (data.length > 0) {
    res.json(data);
  } else {
    throw new Error("No data found");
  }
});

//2. retrive one
//http://15.206.185.169:3001/post/1234

postRoutes.route("/post/:id").get(async (req, res) => {
  if (!objectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }
  let db = database.getDb();
  let data = await db
    .collection("post")
    .findOne({ _id: new objectId(req.params.id) });
  if (Object.keys(data).length > 0) {
    res.json(data);
  } else {
    throw new Error("No data found");
  }
});

//3. create
//http://15.206.185.169:3001/post
postRoutes.route("/post").post(verifytokens, async (req, res) => {
  let db = database.getDb();
  let mongoObject = {
    title: req.body.title,
    description: req.body.description,
    content: req.body.content,
    author: req.body.user.name,
    userEmail: req.body.user.email, // ✅ this enables frontend filtering
    dateCreated: new Date(),
    imageid: req.body.imageid,
  };
  let data = await db.collection("post").insertOne(mongoObject);
  res.json(data);
});
//4. update
//http://15.206.185.169:300/post/1234
postRoutes.route("/post/:id").put(verifytokens, async (req, res) => {
  let db = database.getDb();
  let mongoObject = {
    $set: {
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      author: req.body.author,
      dateCreated: new Date(),
      imageid: req.body.imageid,
    },
  };
  let data = await db
    .collection("post")
    .updateOne({ _id: new objectId(req.params.id) }, mongoObject);
  res.json(data);
});

//5. delete
//http://15.206.185.169:3001/post/1234
postRoutes.route("/post/:id").delete(verifytokens, async (req, res) => {
  if (!objectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }
  let db = database.getDb();
  let data = await db
    .collection("post")
    .deleteOne({ _id: new objectId(req.params.id) });
  res.json(data);
});

function verifytokens(req, res, next) {
  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader && authHeader.split(" ")[1];
  if (!bearerToken) {
    return res.status(401).send("Access Denied");
  }
  jwt.verify(bearerToken, process.env.SECRETKEY, (err, user) => {
    if (err) {
      return res.status(403).send("Invalid Token");
    }
    req.body.user = user;
    next();
  });
}
module.exports = postRoutes;
