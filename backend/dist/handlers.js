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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPatients = exports.getDocuments = exports.getDocumentById = exports.postDocument = exports.updateAppointment = exports.getAppointmentById = exports.getAppointments = exports.createAppointment = exports.updateMessage = exports.getMessageById = exports.getMessages = exports.postMessage = exports.getProviderById = exports.getProvidersForCategory = exports.getAllCategories = exports.getAllUsers = exports.getUserProfile = exports.verifyUser = exports.createUser = void 0;
const mongodb_1 = require("mongodb");
const dotenv = __importStar(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const crypto_js_1 = __importDefault(require("crypto-js"));
dotenv.config();
/// request-promise stuff //////////////////////////////////////////////////////
// const request = require('request-promise');
const { YELP_TOKEN } = process.env;
const YelpApiHeader = { Authorization: `Bearer ${YELP_TOKEN}` };
//////////////////////////////////////////////////////////////////////////////
/// mongo stuff //////////////////////////////////////////////////////////////
const MONGO_URI = process.env.MONGO_URI;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
////////////////////////////////////////////////////////////////////////////
const uuid_1 = require("uuid");
// handlers functions here
/////////////////////////////////////////////////////////////////////////
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('running createUser...');
    // generating 8-character long random ID, attaching to req.body
    const newUser = Object.assign({
        _id: Math.floor(Math.random() * (99999999 - 10000000) + 10000000).toString(),
    }, req.body);
    const client = new mongodb_1.MongoClient(MONGO_URI, options);
    yield client.connect();
    const db = client.db('healthdb');
    console.log('connected to db');
    try {
        const result = yield db.collection('users').insertOne(newUser);
        if (result) {
            res.status(201).json({
                status: 201,
                message: 'ok',
                newUser: newUser,
            });
        }
        else {
            res.status(404).json({
                status: 404,
                message: 'error inserting user',
                newUser: 'error',
            });
        }
    }
    catch (err) {
        console.log(`createUser caught an error: `);
        console.log(err);
        res.status(404).json({ status: 404, message: err, newUser: 'error' });
    }
    client.close();
    console.log('disconnected from db');
});
exports.createUser = createUser;
//////////////////////////////////////////////////////////////////////////
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`verifying patientId: ${req.body.patientId}`);
    const client = new mongodb_1.MongoClient(MONGO_URI, options);
    yield client.connect();
    const db = client.db('healthdb');
    console.log('connected to db');
    try {
        const result = yield db
            .collection('users')
            .findOne({ _id: req.body.patientId });
        if (result) {
            if (crypto_js_1.default.AES.decrypt(result.password, 'hello').toString(crypto_js_1.default.enc.Utf8) ===
                crypto_js_1.default.AES.decrypt(req.body.password, 'hello').toString(crypto_js_1.default.enc.Utf8)) {
                // is the password ok?
                // yes, return the user (minus pw)
                res.status(200).json({
                    status: 200,
                    message: 'ok',
                    // omitting password from return obj
                    user: ((_a) => {
                        var { password } = _a, userData = __rest(_a, ["password"]);
                        return userData;
                    })(result),
                });
            }
            else {
                // no, return 403
                res.status(403).json({
                    status: 403,
                    message: 'invalid login',
                    user: 'invalid login',
                });
            }
        }
        else {
            res.status(403).json({
                status: 403,
                message: 'invalid login',
                user: 'invalid login',
            });
        }
    }
    catch (err) {
        console.log(`verifyUser caught an error: `);
        console.log(err);
        res.status(404).json({
            status: 404,
            message: err,
            user: 'verifyUser error',
        });
    }
    client.close();
    console.log('disconnected from db');
});
exports.verifyUser = verifyUser;
//////////////////////////////////////////////////////////////////////////
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`looking up profile id: ${req.params.id}`);
    console.log(`requesting id: ${req.body.requestingId}`);
    const client = new mongodb_1.MongoClient(MONGO_URI, options);
    yield client.connect();
    const db = client.db('healthdb');
    console.log('connected to db');
    if (req.body.requestingId !== req.params.id) {
        // if user not requesting their own profile, check if usertype !== "clinician"
        const result = yield db
            .collection('users')
            .findOne({ _id: req.body.requestingId }, { projection: { userType: 1 } });
        if ((result === null || result === void 0 ? void 0 : result.userType) !== 'clinician') {
            // if not a clinician, refuse request
            client.close();
            console.log('disconnected from db');
            res.status(403).json({
                status: 403,
                message: 'unauthorized',
                profile: 'unauthorized',
            });
            return;
        }
    }
    // otherwise, retrieve the profile from DB
    try {
        const result = yield db.collection('users').findOne({ _id: req.params.id }, { projection: { password: 0 } } // omitting password from return obj
        );
        if (result) {
            res.status(200).json({
                status: 200,
                message: 'ok',
                profile: result,
            });
        }
        else {
            res.status(404).json({
                status: 404,
                message: 'profile not found',
                user: 'profile not found',
            });
        }
    }
    catch (err) {
        console.log(`getUserProfile caught an error: `);
        console.log(err);
        res.status(404).json({
            status: 404,
            message: err,
            profile: 'getUserProfile error',
        });
    }
    client.close();
    console.log('disconnected from db');
});
exports.getUserProfile = getUserProfile;
//////////////////////////////////////////////////////////////////////
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`retrieving all users`);
    const client = new mongodb_1.MongoClient(MONGO_URI, options);
    yield client.connect();
    const db = client.db('healthdb');
    console.log('connected to db');
    try {
        const results = yield db.collection('users').find({}).toArray();
        console.log(`got results: `);
        console.log(results);
        if (results) {
            // stripping passwords from the results
            const resultsNoPasswords = results.map((result) => {
                return ((_a) => {
                    var { password } = _a, userData = __rest(_a, ["password"]);
                    return userData;
                })(result);
            });
            res.status(200).json({
                status: 200,
                message: 'ok',
                users: resultsNoPasswords,
            });
        }
        else {
            console.log(`getAllUsers error getting users`);
            res.status(404).json({
                status: 404,
                message: 'getAllUsers error getting users',
                users: 'getAllUsers error getting users',
            });
        }
    }
    catch (err) {
        console.log(`getAllUsers caught an error: `);
        console.log(err);
        res.status(404).json({
            status: 404,
            message: err,
            users: 'getAllUsers error',
        });
    }
    client.close();
    console.log('disconnected from db');
});
exports.getAllUsers = getAllUsers;
const getAllCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const allCategories = await request({
        //     uri: 'https://api.yelp.com/v3/categories',
        //     headers: YelpApiHeader,
        //     json: true, // Automatically parses the JSON string in the response
        // });
        const response = yield axios_1.default.get('https://api.yelp.com/v3/categories', {
            headers: YelpApiHeader,
        });
        const allCategories = response.data;
        console.log(`got allCategories.categories array length: ${allCategories.categories.length}`);
        const allHealthCategories = allCategories.categories
            .filter((category) => category.parent_aliases[0] === 'health')
            .map((category) => {
            // return category.title;
            return {
                title: category.title,
                alias: category.alias,
            };
        });
        if (allHealthCategories.length !== 0) {
            res.status(200).json({
                status: 200,
                message: 'ok',
                categories: allHealthCategories,
            });
        }
        else {
            res.status(404).json({
                status: 404,
                message: 'getAllCategories got an error',
                categories: 'getAllCategories got an error',
            });
        }
    }
    catch (err) {
        console.log('error retrieving categories: ');
        console.log(err);
    }
});
exports.getAllCategories = getAllCategories;
const getProvidersForCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`got req.body.category: ${req.body.category}`);
    console.log(`got req.body.postalcode: ${req.body.postalcode}`);
    try {
        // const providers = await request({
        //     uri: `https://api.yelp.com/v3/businesses/search?categories=${req.body.category}&location=${req.body.postalcode}`,
        //     headers: YelpApiHeader,
        //     json: true, // Automatically parses the JSON string in the response
        // });
        const response = yield axios_1.default.get(`https://api.yelp.com/v3/businesses/search?categories=${req.body.category}&location=${req.body.postalcode}`, {
            headers: YelpApiHeader,
        });
        const providers = response.data;
        console.log(`got providers.businesses array length: ${providers.businesses.length}`);
        if (providers.businesses.length !== 0) {
            res.status(200).json({
                status: 200,
                message: 'ok',
                providers: providers.businesses,
            });
        }
        else {
            res.status(404).json({
                status: 404,
                message: 'getProvidersForCategory got an error',
                categories: 'none found',
            });
        }
    }
    catch (err) {
        res.status(404).json({
            status: 404,
            message: err.message,
            categories: 'getProvidersForCategory caught an error',
        });
    }
});
exports.getProvidersForCategory = getProvidersForCategory;
const getProviderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`got id: ${req.params.id}`);
    try {
        // const provider = await request({
        //     uri: `https://api.yelp.com/v3/businesses/${req.params.id}`,
        //     headers: YelpApiHeader,
        //     json: true, // Automatically parses the JSON string in the response
        // });
        const response = yield axios_1.default.get(`https://api.yelp.com/v3/businesses/${req.params.id}`, {
            headers: YelpApiHeader,
        });
        const provider = response.data;
        if (provider['error']) {
            res.status(404).json({
                status: 404,
                message: 'provider ID not found',
                provider: 'error',
            });
        }
        else {
            res.status(200).json({
                status: 200,
                message: 'ok',
                provider: provider,
            });
        }
    }
    catch (err) {
        res.status(404).json({
            status: 404,
            message: err.message,
            provider: 'caught error - provider ID not found',
        });
    }
});
exports.getProviderById = getProviderById;
const postMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newMessage = Object.assign({ _id: (0, uuid_1.v4)().split('-').join('').substring(0, 8) }, req.body);
    const client = new mongodb_1.MongoClient(MONGO_URI, options);
    yield client.connect();
    const db = client.db('healthdb');
    console.log('connected to db');
    try {
        const result = yield db.collection('messages').insertOne(newMessage);
        if (result) {
            res.status(201).json({
                status: 201,
                message: 'ok',
                newMessage: newMessage,
            });
        }
        else {
            res.status(404).json({
                status: 404,
                message: 'error inserting message',
                newMessage: 'error',
            });
        }
    }
    catch (err) {
        console.log(`postMessage caught an error: `);
        console.log(err);
        res.status(404).json({
            status: 404,
            message: err,
            newMessage: 'error',
        });
    }
    client.close();
    console.log('disconnected from db');
});
exports.postMessage = postMessage;
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`retrieving messages with params: `);
    console.log(req.body.queryParams);
    const client = new mongodb_1.MongoClient(MONGO_URI, options);
    yield client.connect();
    const db = client.db('healthdb');
    console.log('connected to db');
    try {
        const results = yield db
            .collection('messages')
            .find(req.body.queryParams)
            .toArray();
        if (results) {
            res.status(200).json({
                status: 200,
                message: 'ok',
                messages: results,
            });
        }
        else {
            res.status(404).json({
                status: 404,
                message: 'no messages found',
                messages: 'no messages found',
            });
        }
    }
    catch (err) {
        console.log(`caught error getting messages`);
        console.log(err);
        res.status(404).json({
            status: 404,
            message: err,
            messages: 'getMessages caught error',
        });
    }
    client.close();
    console.log('disconnected from db');
});
exports.getMessages = getMessages;
const getMessageById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`looking up message id: ${req.body.messageId}`);
    console.log(`requesting id: ${req.body.requestingId}`);
    const client = new mongodb_1.MongoClient(MONGO_URI, options);
    yield client.connect();
    const db = client.db('healthdb');
    console.log('connected to db');
    try {
        const result = yield db
            .collection('messages')
            .findOne({ _id: req.body.messageId });
        if (result) {
            // check if the requesting ID is the sender or recipient of this message
            if (req.body.requestingId === result.recipientId ||
                req.body.requestingId === result.senderId) {
                // if ok, respond with the message
                res.status(200).json({
                    status: 200,
                    message: result,
                });
            }
            else {
                // otherwise, respond unauthorized
                res.status(403).json({
                    status: 403,
                    message: 'unauthorized',
                });
            }
        }
        else {
            res.status(404).json({ status: 404, message: 'message not found' });
        }
    }
    catch (err) {
        console.log(`getMessageById caught an error: `);
        console.log(err);
        res.status(404).json({
            status: 404,
            message: 'getMessageById caught an error',
        });
    }
    client.close();
    console.log('disconnected from db');
});
exports.getMessageById = getMessageById;
const updateMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new mongodb_1.MongoClient(MONGO_URI, options);
    yield client.connect();
    const db = client.db('healthdb');
    console.log('connected to db');
    console.log('got update: ');
    console.log(req.body.update);
    try {
        const updateResult = yield db
            .collection('messages')
            .updateOne({ _id: req.body.messageId }, { $set: req.body.update });
        if (updateResult.modifiedCount === 1) {
            res.status(201).json({ status: 200, message: 'ok' });
        }
        else {
            res.status(404).json({
                status: 404,
                message: 'could not update message',
            });
        }
    }
    catch (err) {
        console.log(`updateMessage caught an error: `);
        console.log(err);
        res.status(404).json({ status: 404, message: err });
    }
    client.close();
    console.log('disconnected from db');
});
exports.updateMessage = updateMessage;
const createAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newAppointment = Object.assign({ _id: (0, uuid_1.v4)().split('-').join('').substring(0, 8) }, req.body);
    const client = new mongodb_1.MongoClient(MONGO_URI, options);
    yield client.connect();
    const db = client.db('healthdb');
    console.log('connected to db');
    try {
        const result = yield db
            .collection('appointments')
            .insertOne(newAppointment);
        if (result) {
            res.status(201).json({
                status: 201,
                message: 'ok',
                newAppointment: newAppointment,
            });
        }
        else {
            res.status(404).json({
                status: 404,
                message: 'error inserting appointment',
                newAppointment: 'error',
            });
        }
    }
    catch (err) {
        console.log(`createAppointment caught an error: `);
        console.log(err);
        res.status(404).json({
            status: 404,
            message: err,
            newAppointment: 'error',
        });
    }
    client.close();
    console.log('disconnected from db');
});
exports.createAppointment = createAppointment;
const getAppointments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`retrieving appointments for viewer ${req.body.viewerId}`);
    const client = new mongodb_1.MongoClient(MONGO_URI, options);
    yield client.connect();
    const db = client.db('healthdb');
    console.log('connected to db');
    let results;
    // if the viewer is a patient, search on patientId, else search on clinicID
    try {
        if (req.body.viewerType === 'patient') {
            results = yield db
                .collection('appointments')
                .find({
                patientId: req.body.viewerId,
            })
                .toArray();
        }
        else {
            results = yield db
                .collection('appointments')
                .find({
                clinicId: req.body.viewerId,
            })
                .toArray();
        }
        if (results) {
            res.status(200).json({
                status: 200,
                message: 'ok',
                appointments: results,
            });
        }
        else {
            res.status(404).json({
                status: 404,
                message: 'no appointments found',
                appointments: 'no appointments found',
            });
        }
    }
    catch (err) {
        console.log(`caught error getting appointments`);
        console.log(err);
        res.status(404).json({
            status: 404,
            message: err,
            appointments: 'getAppointments caught error',
        });
    }
    client.close();
    console.log('disconnected from db');
});
exports.getAppointments = getAppointments;
const getAppointmentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`looking up appointment id: ${req.body.appointmentId}`);
    console.log(`requesting id: ${req.body.requestingId}`);
    const client = new mongodb_1.MongoClient(MONGO_URI, options);
    yield client.connect();
    const db = client.db('healthdb');
    console.log('connected to db');
    try {
        const result = yield db
            .collection('appointments')
            .findOne({ _id: req.body.appointmentId });
        if (result) {
            // check if the requesting ID matches the patientId or clinicId for this appointment
            if (req.body.requestingId === result.patientId ||
                req.body.requestingId === result.clinicId) {
                // if ok, respond with the appointment
                res.status(200).json({
                    status: 200,
                    message: 'ok',
                    appointment: result,
                });
            }
            else {
                // otherwise, respond unauthorized
                res.status(403).json({
                    status: 403,
                    message: 'unauthorized',
                });
            }
        }
        else {
            res.status(404).json({
                status: 404,
                message: 'appointment not found',
            });
        }
    }
    catch (err) {
        console.log(`getAppointmentById caught an error: `);
        console.log(err);
        res.status(404).json({
            status: 404,
            message: 'getAppointmentById caught an error',
        });
    }
    client.close();
    console.log('disconnected from db');
});
exports.getAppointmentById = getAppointmentById;
const updateAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new mongodb_1.MongoClient(MONGO_URI, options);
    yield client.connect();
    const db = client.db('healthdb');
    console.log('connected to db');
    console.log('got update: ');
    console.log(req.body.update);
    try {
        const updateResult = yield db
            .collection('appointments')
            .updateOne({ _id: req.body.appointmentId }, { $set: req.body.update });
        if (updateResult.modifiedCount === 1) {
            res.status(201).json({ status: 200, message: 'ok' });
        }
        else {
            res.status(404).json({
                status: 404,
                message: 'could not update appointment',
            });
        }
    }
    catch (err) {
        console.log(`updateAppointment caught an error: `);
        console.log(err);
        res.status(404).json({ status: 404, message: err });
    }
    client.close();
    console.log('disconnected from db');
});
exports.updateAppointment = updateAppointment;
const postDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`running postDocument...`);
    const newDocument = Object.assign({ _id: (0, uuid_1.v4)().split('-').join('').substring(0, 8) }, req.body);
    const client = new mongodb_1.MongoClient(MONGO_URI, options);
    yield client.connect();
    const db = client.db('healthdb');
    console.log('connected to db');
    try {
        const result = yield db.collection('documents').insertOne(newDocument);
        if (result) {
            res.status(201).json({
                status: 201,
                message: 'ok',
                newDocument: newDocument,
            });
        }
        else {
            res.status(404).json({
                status: 404,
                message: 'error inserting document',
                newDocument: 'error',
            });
        }
    }
    catch (err) {
        console.log(`postDocument caught an error: `);
        console.log(err);
        res.status(404).json({
            status: 404,
            message: err,
            newDocument: 'error',
        });
    }
    client.close();
    console.log('disconnected from db');
});
exports.postDocument = postDocument;
const getDocumentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`looking up document id: ${req.body.documentId}`);
    console.log(`requesting id: ${req.body.requestingId}`);
    const client = new mongodb_1.MongoClient(MONGO_URI, options);
    yield client.connect();
    const db = client.db('healthdb');
    console.log('connected to db');
    try {
        const result = yield db
            .collection('documents')
            .findOne({ _id: req.body.documentId });
        if (result) {
            // check if the requesting ID is the patient or clinic of this receipt
            if (req.body.requestingId === result.patientId ||
                req.body.requestingId === result.clinicId) {
                // if ok, respond with the document
                res.status(200).json({
                    status: 200,
                    message: 'ok',
                    document: result,
                });
            }
            else {
                // otherwise, respond unauthorized
                res.status(403).json({
                    status: 403,
                    message: 'unauthorized',
                });
            }
        }
        else {
            res.status(404).json({
                status: 404,
                message: 'document not found',
            });
        }
    }
    catch (err) {
        console.log(`getDocumentByApptId caught an error: `);
        console.log(err);
        res.status(404).json({
            status: 404,
            message: 'getDocumentByApptId caught an error',
        });
    }
    client.close();
    console.log('disconnected from db');
});
exports.getDocumentById = getDocumentById;
const getDocuments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`retrieving documents with params: `);
    console.log(req.body.queryParams);
    const client = new mongodb_1.MongoClient(MONGO_URI, options);
    yield client.connect();
    const db = client.db('healthdb');
    console.log('connected to db');
    try {
        const results = yield db
            .collection('documents')
            .find(req.body.queryParams)
            .toArray();
        if (results) {
            res.status(200).json({
                status: 200,
                message: 'ok',
                documents: results,
            });
        }
        else {
            res.status(404).json({
                status: 404,
                message: 'no documents found',
                documents: 'no documents found',
            });
        }
    }
    catch (err) {
        console.log(`caught error getting documents`);
        console.log(err);
        res.status(404).json({
            status: 404,
            message: err,
            documents: 'getDocuments caught error',
        });
    }
    client.close();
    console.log('disconnected from db');
});
exports.getDocuments = getDocuments;
const getPatients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`retrieving patients for clinic ${req.body.clinicId}: `);
    const client = new mongodb_1.MongoClient(MONGO_URI, options);
    yield client.connect();
    const db = client.db('healthdb');
    console.log('connected to db');
    try {
        // get all patients who have sent messages to this clinic
        const senders = yield db
            .collection('messages')
            .find({ recipientId: req.body.clinicId }, { projection: { _id: 0, senderId: 1, senderName: 1 } })
            .toArray();
        // get unique {senderId, senderName} pairs from senders
        const patients = [
            ...new Map(senders.map((item) => [item['senderId'], item])).values(),
        ];
        if (patients) {
            res.status(200).json({
                status: 200,
                message: 'ok',
                patients: patients,
            });
        }
        else {
            res.status(404).json({
                status: 404,
                message: 'no patients found',
            });
            console.log(`no patient Id's found`);
        }
    }
    catch (err) {
        res.status(404).json({
            status: 404,
            message: 'getPatients caught an error',
        });
        console.log('getPatients caught an error');
    }
    client.close();
    console.log('disconnected from db');
});
exports.getPatients = getPatients;
// const newMessageCheck = async (req: Request, res: Response) => {
//   const client = new MongoClient (MONGO_URI, options);
//   await client.connect();
//   const db = client.db("healthdb");
//   console.log("connected to db");
//   try {
//     const results = await db.collection("messages").find()
//   } catch (err) {
//   }
// };
// module.exports = {
//     createUser,
//     verifyUser,
//     getUserProfile,
//     getAllUsers,
//     getAllCategories,
//     getProvidersForCategory,
//     getProviderById,
//     postMessage,
//     getMessages,
//     getMessageById,
//     updateMessage,
//     createAppointment,
//     getAppointments,
//     getAppointmentById,
//     updateAppointment,
//     postDocument,
//     getDocumentById,
//     getDocuments,
//     getPatients,
//     // newMessageCheck
// };
