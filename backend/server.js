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
  getProviderById,
  postMessage,
  getMessages,
  getMessageById,
  updateMessage,
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  postDocument,
  getDocumentById,
  getDocuments,
  getPatients,
  // newMessageCheck
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
  // create a new user in DB
  
  .post('/api/users/verify', verifyUser)
  // receives an ID and hashed password from login, and returns the user object if valid 

  .post('/api/profile/:id', getUserProfile)
  // receives a user ID, return the user info
  
  .get('/api/users', getAllUsers)
  // not used - returns all users from db

  .get('/api/categories', getAllCategories)
  // gets all categories from the Yelp API

  .post('/api/providers', getProvidersForCategory)
  // gets all providers (clinics) from the Yelp API for the specified category near the user's postal code

  .get('/api/provider/:id', getProviderById)
  // gets a provider by id from the Yelp API

  .post('/api/postmessage', postMessage)
  // post a message object to DB (has a recipientID and senderID)

  .post('/api/getmessages', getMessages)
  // get messages from DB using a parameters object in the POST

  .post('/api/getmessagebyid', getMessageById)
  // gets a message by ID from DB

  .patch('/api/updatemessage', updateMessage)
  // updates a field of a message in DB, typically "read" from false to true

  .post('/api/createappointment', createAppointment)
  // creates an appointment object in DB

  .post('/api/getappointments', getAppointments)
  // retrieves appointments from DB for a specified patient or clinic

  .post('/api/getappointmentbyid', getAppointmentById)
  // retrieves an appointment by ID from DB

  .patch('/api/updateappointment', updateAppointment)
  // updates a field of an appointment in DB, typically "status" from confirmed to completed 

  .post('/api/postdocument', postDocument)
  // creates a document (e.g. receipt) object in DB

  .post('/api/getdocumentbyid', getDocumentById)
  // retrieves a document by ID from DB

  .post('/api/getdocuments', getDocuments)
  // retrieves all documents from DB for a specified patient or clinic

  .post('/api/getpatients', getPatients)
  // retrieves all patients for a specified clinic

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
