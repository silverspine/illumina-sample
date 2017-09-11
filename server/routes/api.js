////////////////////////
// router for the API //
////////////////////////
const express = require('express');
const router = express.Router();
const config = require('../config/server');
const mongoose = require('mongoose');

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

router.use('/setup', serverInitialize);
router.use('/authenticate', authenticate);
router.use('/roles', roles);
router.use('/users', users);
router.use('/clients', clients);

module.exports = router;