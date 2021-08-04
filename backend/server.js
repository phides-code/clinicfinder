"use strict";

// import the needed node_modules.

const express = require("express");
const cors = require('cors');

const morgan = require("morgan");
const bodyParser = require("body-parser");
const {
  createUser,
  verifyUser,
  getUserProfile,
  getAllUsers,
  getAllCategories,
  getProvidersForCategory,
  getProviderById
} = require("./handlers");

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
  .get('/api/categories', getAllCategories)
  .post('/api/providers', getProvidersForCategory)
  .get('/api/provider/:id', getProviderById)
  
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
