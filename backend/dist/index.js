"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv = __importStar(require("dotenv"));
const path_1 = __importDefault(require("path"));
const handlers_1 = require("./handlers");
dotenv.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.json());
// Have Node serve the files for our built React app
app.use(express_1.default.static(path_1.default.resolve(__dirname, '../../frontend/build')));
app.post('/api/users/new', handlers_1.createUser);
// create a new user in DB
app.post('/api/users/verify', handlers_1.verifyUser);
// receives an ID and hashed password from login, and returns the user object if valid
app.post('/api/profile/:id', handlers_1.getUserProfile);
// receives a user ID, return the user info
app.get('/api/users', handlers_1.getAllUsers);
// not used - returns all users from db
app.get('/api/categories', handlers_1.getAllCategories);
// gets all categories from the Yelp API
app.post('/api/providers', handlers_1.getProvidersForCategory);
// gets all providers (clinics) from the Yelp API for the specified category near the user's postal code
app.get('/api/provider/:id', handlers_1.getProviderById);
// gets a provider by id from the Yelp API
app.post('/api/postmessage', handlers_1.postMessage);
// post a message object to DB (has a recipientID and senderID)
app.post('/api/getmessages', handlers_1.getMessages);
// get messages from DB using a parameters object in the POST
app.post('/api/getmessagebyid', handlers_1.getMessageById);
// gets a message by ID from DB
app.patch('/api/updatemessage', handlers_1.updateMessage);
// updates a field of a message in DB, typically "read" from false to true
app.post('/api/createappointment', handlers_1.createAppointment);
// creates an appointment object in DB
app.post('/api/getappointments', handlers_1.getAppointments);
// retrieves appointments from DB for a specified patient or clinic
app.post('/api/getappointmentbyid', handlers_1.getAppointmentById);
// retrieves an appointment by ID from DB
app.patch('/api/updateappointment', handlers_1.updateAppointment);
// updates a field of an appointment in DB, typically "status" from confirmed to completed
app.post('/api/postdocument', handlers_1.postDocument);
// creates a document (e.g. receipt) object in DB
app.post('/api/getdocumentbyid', handlers_1.getDocumentById);
// retrieves a document by ID from DB
app.post('/api/getdocuments', handlers_1.getDocuments);
// retrieves all documents from DB for a specified patient or clinic
app.post('/api/getpatients', handlers_1.getPatients);
// retrieves all patients for a specified clinic
app.get('*', (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, '../../frontend/build', 'index.html'));
});
app.listen(port, () => {
    console.log(`*** Server is running on port ${port} ***`);
});
