"use strict";
const assert = require('assert');
const { resolveSoa } = require('dns');
const CryptoJS = require("crypto-js");
require("dotenv").config();
/// request-promise stuff //////////////////////////////////////////////////////
const request = require('request-promise');
const { YELP_TOKEN } = process.env;
const YelpApiHeader = { "Authorization": `Bearer ${YELP_TOKEN}`};
//////////////////////////////////////////////////////////////////////////////
/// mongo stuff //////////////////////////////////////////////////////////////
const { MongoClient } = require("mongodb");
const { MONGO_URI } = process.env;
const options = { useNewUrlParser: true, useUnifiedTopology: true };
////////////////////////////////////////////////////////////////////////////
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
const getUserProfile = async (req, res) => {
  console.log(`looking up profile id: ${req.params.id}`);
  console.log(`requesting id: ${req.body.requestingId}`);
  
  const client = new MongoClient (MONGO_URI, options);
  await client.connect();
  const db = client.db("healthdb");
  console.log("connected to db");

  if ( req.body.requestingId !== req.params.id ) { 
    // if user not requesting their own profile, check if usertype !== "clinician"
    const result = await db.collection("users").findOne(
      { _id: req.body.requestingId }, 
      { projection: { userType: 1 } }
    );

    if ( result.userType !== "clinician" ) {
      // if not a clinician, refuse request
      client.close();
      console.log("disconnected from db");
      res.status(403).json({ 
        status: 403, message: "unauthorized", 
        profile: "unauthorized" 
      });
      return;
    }
  } 
  // otherwise, retrieve the profile from DB
  try {
    const result = await db.collection("users").findOne(
      { _id: req.params.id }, 
      { projection: { password: 0 } } // omitting password from return obj
    );

    if (result) {
      res.status(200).json({ 
        status: 200, message: "ok", 
        profile: result
      });
      
    } else {
      res.status(404).json({ status: 404, message: "profile not found", user: "profile not found" });
    }

  } catch (err) {
    console.log(`getUserProfile caught an error: `);
    console.log(err);
    res.status(404).json({ status: 404, message: err, profile: "getUserProfile error" });
  }
  client.close();
  console.log("disconnected from db");
};
//////////////////////////////////////////////////////////////////////
const getAllUsers = async (req, res) => {
  console.log(`retrieving all users`);

  const client = new MongoClient (MONGO_URI, options);
  await client.connect();
  const db = client.db("healthdb");
  console.log("connected to db");

  try {
    const results = await db.collection("users").find({}).toArray();
    
    console.log(`got results: `);
    console.log(results);

    if (results) {
      // stripping passwords from the results
      const resultsNoPasswords = results.map(result => {
        return (({ password, ...userData }) => userData)(result)
      })

      res.status(200).json({
        status: 200, message: "ok",
        users: resultsNoPasswords
      });
    } else {
      console.log(`getAllUsers error getting users`);
      res.status(404).json({ status: 404, message: err, 
        users: "getAllUsers error getting users" 
      });
    }
  } catch (err) {
    console.log(`getAllUsers caught an error: `);
    console.log(err);
    res.status(404).json({ status: 404, message: err, 
      users: "getAllUsers error" 
    });
  }
  client.close();
  console.log("disconnected from db");
};

const getAllCategories = async (req, res) => {
  try {
    const allCategories = await request({
      uri: 'https://api.yelp.com/v3/categories',
      headers: YelpApiHeader,
      json: true // Automatically parses the JSON string in the response
    });
    console.log(`got allCategories.categories array length: ${allCategories.categories.length}`);

    const allHealthCategories = allCategories.categories.filter(
      category => category.parent_aliases[0] === "health"
    ).map(category => {
        // return category.title;
        return {
          title: category.title,
          alias: category.alias
        };
    });

    if (allHealthCategories.length !== 0 ) {
      res.status(200).json({
        status: 200, message: "ok",
        categories: allHealthCategories
      });
    } else {
      res.status(404).json({
        status: 404, message: "getAllCategories got an error", 
        categories: "getAllCategories got an error"
      });
    }
  } catch (err) {
    console.log('error retrieving categories: ');
    console.log(err);
  }
};

const getProvidersForCategory = async (req, res) => {
  console.log(`got req.body.category: ${req.body.category}`);
  console.log(`got req.body.postalcode: ${req.body.postalcode}`);
  try {
    const providers = await request({
      uri: `https://api.yelp.com/v3/businesses/search?categories=${req.body.category}&location=${req.body.postalcode}`,
      headers: YelpApiHeader,
      json: true // Automatically parses the JSON string in the response
    });

    console.log(`got providers.businesses array length: ${providers.businesses.length}`);

    if (providers.businesses.length !== 0) {
      res.status(200).json({
        status: 200, message: "ok",
        providers: providers.businesses
      });
    } else {
      res.status(404).json({
        status: 404, message: "getProvidersForCategory got an error", 
        categories: "none found"
      });
    }
  } catch (err) {
    res.status(404).json({
      status: 404, message: err.message, 
      categories: "getProvidersForCategory caught an error"
    });
  }
};

const getProviderById = async (req, res) => {
  console.log(`got id: ${req.params.id}`);

  try {
    const provider = await request({
      uri: `https://api.yelp.com/v3/businesses/${req.params.id}`,
      headers: YelpApiHeader,
      json: true // Automatically parses the JSON string in the response
    });

    if (provider["error"]) {
      res.status(404).json({
        status: 404, message: "provider ID not found",
        provider: "error"
      });
    } else {
      res.status(200).json({
        status: 200, message: "ok",
        provider: provider
      });
    }

  } catch (err) {
    res.status(404).json({
      status: 404, message: err.message,
      provider: "caught error - provider ID not found"
    });
  }
};

const postMessage = async (req, res) => {
  const newMessage = {
    ...{_id: uuidv4().split('-').join('').substring(0,8)},
    ...req.body
  };

  const client = new MongoClient (MONGO_URI, options);
  await client.connect();
  const db = client.db("healthdb");
  console.log("connected to db");

  try {
    const result = await db.collection("messages").insertOne(newMessage);
    if (result) {
      res.status(201).json({ status: 201, message: "ok", newMessage: newMessage })
    } else {
      res.status(404).json({ status: 404, message: "error inserting message", newMessage: "error" });
    }  
  }
  catch (err) {
    console.log(`postMessage caught an error: `);
    console.log(err);
    res.status(404).json({ status: 404, message: err, newMessage: "error" });
  }
  client.close();
  console.log("disconnected from db");
};

const getMessages = async (req, res) => {
  console.log(`retrieving messages for recipient ${req.body.recipientId}`);

  const client = new MongoClient (MONGO_URI, options);
  await client.connect();
  const db = client.db("healthdb");
  console.log("connected to db");

  try {
    const results = await db.collection("messages").find({
      recipient: req.body.recipientId
    }).toArray();

    if (results) {
      res.status(200).json({
        status: 200, message: "ok",
        messages: results
      });
    } else {
      res.status(404).json({
        status: 404, message: "no messages found",
        messages: "no messages found"
      });
    }

  } catch (err) {
    console.log(`caught error getting messages`);
    console.log(err);
    res.status(404).json({
      status: 404, message: err,
      messages: "getMessages caught error"
    });
  }
  client.close();
  console.log("disconnected from db");
};

const getMessageById = async (req, res) => {
  console.log(`looking up message id: ${req.body.messageId}`);
  console.log(`requesting id: ${req.body.requestingId}`);
  
  const client = new MongoClient (MONGO_URI, options);
  await client.connect();
  const db = client.db("healthdb");
  console.log("connected to db");

  try {
    const result = await db.collection("messages").findOne(
      { _id: req.body.messageId }
    );

    if (result) {
      // check if the requesting ID is the sender or recipient of this message
      if (req.body.requestingId === result.recipient || req.body.requestingId === result.senderId) {
        // if ok, respond with the message 
        res.status(200).json({ 
          status: 200, message: result, 
        });
      } else {
        // otherwise, respond unauthorized
        res.status(403).json({ 
          status: 403, message: "unauthorized", 
        });
      }
    } else {
      res.status(404).json({ status: 404, message: "message not found" });
    }

  } catch (err) {
    console.log(`getMessageById caught an error: `);
    console.log(err);
    res.status(404).json({ status: 404, message: "getMessageById caught an error" });
  }
  client.close();
  console.log("disconnected from db");
};

module.exports = {
  createUser,
  verifyUser,
  getUserProfile, 
  getAllUsers,
  getAllCategories,
  getProvidersForCategory,
  getProviderById,
  postMessage,
  getMessages, 
  getMessageById
};