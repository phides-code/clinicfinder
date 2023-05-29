import express, { Express, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import path from 'path';
import {
    createAppointment,
    createUser,
    getAllCategories,
    getAllUsers,
    getAppointmentById,
    getAppointments,
    getDocumentById,
    getDocuments,
    getMessageById,
    getMessages,
    getPatients,
    getProviderById,
    getProvidersForCategory,
    getUserProfile,
    postDocument,
    postMessage,
    updateAppointment,
    updateMessage,
    verifyUser,
} from './handlers';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../../frontend/build')));

app.post('/api/users/new', createUser);
// create a new user in DB

app.post('/api/users/verify', verifyUser);
// receives an ID and hashed password from login, and returns the user object if valid

app.post('/api/profile/:id', getUserProfile);
// receives a user ID, return the user info

app.get('/api/users', getAllUsers);
// not used - returns all users from db

app.get('/api/categories', getAllCategories);
// gets all categories from the Yelp API

app.post('/api/providers', getProvidersForCategory);
// gets all providers (clinics) from the Yelp API for the specified category near the user's postal code

app.get('/api/provider/:id', getProviderById);
// gets a provider by id from the Yelp API

app.post('/api/postmessage', postMessage);
// post a message object to DB (has a recipientID and senderID)

app.post('/api/getmessages', getMessages);
// get messages from DB using a parameters object in the POST

app.post('/api/getmessagebyid', getMessageById);
// gets a message by ID from DB

app.patch('/api/updatemessage', updateMessage);
// updates a field of a message in DB, typically "read" from false to true

app.post('/api/createappointment', createAppointment);
// creates an appointment object in DB

app.post('/api/getappointments', getAppointments);
// retrieves appointments from DB for a specified patient or clinic

app.post('/api/getappointmentbyid', getAppointmentById);
// retrieves an appointment by ID from DB

app.patch('/api/updateappointment', updateAppointment);
// updates a field of an appointment in DB, typically "status" from confirmed to completed

app.post('/api/postdocument', postDocument);
// creates a document (e.g. receipt) object in DB

app.post('/api/getdocumentbyid', getDocumentById);
// retrieves a document by ID from DB

app.post('/api/getdocuments', getDocuments);
// retrieves all documents from DB for a specified patient or clinic

app.post('/api/getpatients', getPatients);
// retrieves all patients for a specified clinic

app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, '../../frontend/build', 'index.html'));
});

app.listen(port, () => {
    console.log(`*** Server is running on port ${port} ***`);
});
