"use strict";
const assert = require('assert');
const { resolveSoa } = require('dns');
const CryptoJS = require("crypto-js");

require("dotenv").config();

/// mongo stuff //////////////////////////////////////////////////////////////
const { MongoClient } = require("mongodb");
const { MONGO_URI } = process.env;
const options = { useNewUrlParser: true, useUnifiedTopology: true };
////////////////////////////////////////////////////////////////////////////

// use this package to generate unique ids: https://www.npmjs.com/package/uuid
const { v4: uuidv4 } = require("uuid");

// handlers functions here
/////////////////////////////////////////////////////////////////////////
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
//////////////////////////////////////////////////////////////////////////
const verifyUser = async (req, res) => {
  console.log(`verifying patientId: ${req.body.patientId}`);
  
  const client = new MongoClient (MONGO_URI, options);
  await client.connect();
  const db = client.db("healthdb");
  console.log("connected to db");

  try {
    const result = await db.collection("users").findOne({ _id: req.body.patientId });
    if (result) {

      if ( CryptoJS.AES.decrypt(result.password, 'hello').toString(CryptoJS.enc.Utf8) ===
        CryptoJS.AES.decrypt(req.body.password, 'hello').toString(CryptoJS.enc.Utf8) ) {
        // is the password ok?
        // yes, return the user (minus pw)
        res.status(200).json({ 
          status: 200, message: "ok", 
          // omitting password from return obj
          user: (({ password, ...userData }) => userData)(result) 
        });
      } else {
        // no, return 403
        res.status(403).json({ status: 403, message: "invalid login", user: "invalid login" })
      }

    } else {
      res.status(403).json({ status: 403, message: "invalid login", user: "invalid login" });
    }  

  } catch (err) {
    console.log(`verifyUser caught an error: `);
    console.log(err);
    res.status(404).json({ status: 404, message: err, user: "verifyUser error" });
  }

  client.close();
  console.log("disconnected from db");
};
//////////////////////////////////////////////////////////////////////////
const userProfile = async (req, res) => {
  console.log(`looking up profile id: ${req.params.id}`);
  
  const client = new MongoClient (MONGO_URI, options);
  await client.connect();
  const db = client.db("healthdb");
  console.log("connected to db");

  try {

  const result = await db.collection("users").findOne({ _id: req.params.id });
  if (result) {

    res.status(200).json({ 
      status: 200, message: "ok", 
      // omitting password from return obj
      profile: (({ password, ...userData }) => userData)(result) 
    });
    
  } else {
    res.status(404).json({ status: 404, message: "profile not found", user: "profile not found" });
  }  

  } catch (err) {
    console.log(`userProfile caught an error: `);
    console.log(err);
    res.status(404).json({ status: 404, message: err, profile: "userProfile error" });
  }
  client.close();
  console.log("disconnected from db");
};

module.exports = {
  createUser,
  verifyUser,
  userProfile
};