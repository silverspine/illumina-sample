/////////////////////////////////////////////////////
////////////////////////////////////////////////// //
// router to handle the CRUD operations via API // //
////////////////////////////////////////////////// //
/////////////////////////////////////////////////////

const express = require('express');
const router = express.Router();
const config = require('../config/server');
const mongoose = require('mongoose');

const moment = require('moment');
const sendError = require('../helpers/error_handler');

/**
 * Mongoose configuration block
 */
mongoose.Promise = global.Promise;
mongoose.connect(config.DB_URL, {useMongoClient: true});

const serverInitialize = require('../controllers/initialize');
const authenticate = require('../controllers/authenticate');
const roles = require('../controllers/roles');
const users = require('../controllers/users');
const clients = require('../controllers/clients');

router.use((req, res, next) => {
	console.log('');
	console.log('%s %s %s', req.method, req.url, req.path);
	console.log('headers:');
	console.log(req.headers);
	console.log('body:');
	console.log(req.body);
	console.log('file:');
	console.log(req.file);
	next();
});

router.use('/setup', serverInitialize);
router.use('/authenticate', authenticate);
router.use('/roles', roles);
router.use('/users', users);
router.use('/clients', clients);

module.exports = router;