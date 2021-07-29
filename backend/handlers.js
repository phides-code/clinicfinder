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
const getReservations = async (req, res) => {
  // const client = new MongoClient (MONGO_URI, options);
  // await client.connect();
  // const db = client.db("healthdb");
  console.log("running getReservations...");

  try {
    res.status(200).json({
      status: 200,
      message: "ok",
    });
  } catch (err) {
    console.log(`getReservations error: `);
    console.log(err);
  }
  // client.close();
  // console.log("disconnected from db");
};

module.exports = {

  getReservations,
  // addReservations,
  // getSingleReservation,
  // deleteReservation,
  // updateReservation,
};