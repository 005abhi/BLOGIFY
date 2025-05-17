const crypto = require("crypto");

const secretKeyBuffer = crypto.randomBytes(32);

const secretKeyHex = secretKeyBuffer.toString("hex");

console.log("secretkey: " + secretKeyHex);
