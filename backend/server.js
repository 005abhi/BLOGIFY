const connect = require("./connect");
const express = require("express");
const cors = require("cors");
const post = require("./postRoutes");
const user = require("./userRoutes");
const imageRoutes = require("./imageRoutes");
const multer = require("multer");
const upload = multer();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(post);
app.use(user);
app.use("/uploads", express.static("public/uploads")); // serve images statically
app.use(imageRoutes);

app.listen(port, () => {
  connect.connecttoserver();
  console.log(`Server is running on port ${port}`);
});
