"use strict";

// import the needed node_modules.
require("dotenv").config();
const express = require("express");
const cors = require('cors');
const request = require('request-promise');
const { YELP_TOKEN } = process.env;
const options = {
  uri: 'https://api.yelp.com/v3/categories',
  headers: {
    "Authorization": `Bearer ${YELP_TOKEN}` 
  },
  json: true // Automatically parses the JSON string in the response
};
const morgan = require("morgan");
const bodyParser = require("body-parser");
const {
  createUser,
  verifyUser,
  getUserProfile,
  getAllUsers
} = require("./handlers");

let data;
(async () => {
  try {
    data = await request(options);
    console.log(data.categories.length);
  } catch (err) {
    console.log('error retrieving data: ');
    console.log(err);
  }
})();

express()
  // Below are methods that are included in express(). We chain them for convenience.
  // --------------------------------------------------------------------------------

  // This will give us will log more info to the console. see https://www.npmjs.com/package/morgan
  .use(morgan("tiny"))
  .use(bodyParser.json())

  // Any requests for static files will go into the public folder
  .use(express.static("public"))
  .use(cors())

  // Nothing to modify above this line
  // ---------------------------------
  // add new endpoints here 👇

  .post('/api/users/new', createUser)
  .post('/api/users/verify', verifyUser)
  .post('/api/profile/:id', getUserProfile)
  .get('/api/users', getAllUsers)
  
  // add new endpoints here ☝️
  // ---------------------------------
  // Nothing to modify below this line

  // this is our catch all endpoint.
  .get("*", (req, res) => {
    res.status(404).json({
      status: 404,
      message: "This is obviously not what you are looking for.",
    });
  })

  // Node spins up our server and sets it to listen on port 8000.
  .listen(8000, () => console.log(`Listening on port 8000`));
