"use strict";
const assert = require('assert');
require("dotenv").config();

/// mongo stuff //////////////////////////////////////////////////////////////
const { MongoClient } = require("mongodb");
const { MONGO_URI } = process.env;
const options = { useNewUrlParser: true, useUnifiedTopology: true };

////////////////////////////////////////////////////////////////////////////

// use this package to generate unique ids: https://www.npmjs.com/package/uuid
const { v4: uuidv4 } = require("uuid");

// handlers functions here
/////////////////

// const getReservations = async (req, res) => {
//   // const client = new MongoClient (MONGO_URI, options);
//   // await client.connect();
//   // const db = client.db("healthdb");
//   console.log("running getReservations...");

//   try {
//     res.status(200).json({
//       status: 200,
//       message: "ok",
//     });
//   } catch (err) {
//     console.log(`getReservations error: `);
//     console.log(err);
//   }
//   // client.close();
//   // console.log("disconnected from db");
// };

const createUser = async (req, res) => {
  console.log("running createUser...");
  // generating 8-character long random ID, attaching to req.body
  const newUser = {
    ...{ _id: Math.floor(Math.random() * (99999999 - 10000000) + 10000000).toString() }, 
    ...req.body
  };

  const client = new MongoClient (MONGO_URI, options);
  await client.connect();
  const db = client.db("healthdb");
  console.log("connected to db");

  try {
      const result = await db.collection("users").insertOne(newUser);
      if (result) {
        res.status(201).json({ status: 201, message: "ok", newUser: newUser })
      } else {
        res.status(404).json({ status: 404, message: "error inserting user", newUser: "error" });
      }  
  } catch (err) {
      console.log(`createUser caught an error: `);
      console.log(err);
      res.status(404).json({ status: 404, message: err, newUser: "error" });
  }
  client.close();
  console.log("disconnected from db");
};

module.exports = {
  createUser
};