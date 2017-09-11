const express = require('express');
const router = express.Router();

const Role = require('../models/role');
const User = require('../models/user');
const Client = require('../models/client');
const BaseResponse = require('../helpers/base_response');
const sendError = require('../helpers/error_handler');

//////////////////////////////////////////////////////
// Initialize app with a sample user and user roles //
//////////////////////////////////////////////////////
router.route('/')
	.get((req, res) => {
		let adminRole, testUser;
		
		User.remove({})
		.then(() => {
			Role.remove({})
			.catch( (err) => {
				sendError(err, res, 409);
			});
		})
		.then(() => {
			Client.remove({})
			.catch( (err) => {
				sendError(err, res, 409);
			});
		})
		.then(() => {
			adminRole = new Role();
			adminRole.name = 'admin';
			adminRole.save()
			.then( role => {
				adminRole = role; // This asignation is done just to make sure that the adminRole has the new _id
			})
			.catch( err => {
				sendError(err, res, 409);
			});
		})
		.then(() => {
			testUser = new User();
			testUser.username = 'admin';
			testUser.password = 'admin';
			testUser.role=adminRole._id;
			testUser.save()
			.then( user => {
				let status = 201;
				res.status(status).json(new BaseResponse(user, status));
			})
			.catch( err => {				
				sendError(err, res, 409);
			});
		})
		.catch( err => {
			sendError(err, res, 409);
		});
	});

module.exports = router;