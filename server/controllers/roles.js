////////////////////////////////
// Roles resource controlloer //
////////////////////////////////
const express = require('express');
const router = express.Router();

//////////////////
// Model import //
//////////////////
const Role = require('../models/role');

////////////////////
// Helper imports //
////////////////////
const BaseResponse = require('../helpers/base_response');
const sendError = require('../helpers/error_handler');

///////////////////////////////
// Authentication middleware //
///////////////////////////////
const tokenVerify = require('../middleware/token_verify');
const userAuthorized = require('../middleware/user_authorized');
router.use('/', tokenVerify);

///////////////////////
// User Roles routes //
///////////////////////
router.route('/')
	/**
	 * Create a new User Role
	 */
	.post((req, res) => {
		userAuthorized(req, res, () => {
			let formFields = req.body;
			let role = new Role();
			role.name = formFields.name;
			role.save()
			.then((role) => {
				let status = 201;
				res.status(status).json(new BaseResponse(role, status));
			})
			.catch((err) => {				
				BaseResponse.sendError(err, res, 409);
			});
		})
	})

	/**
	 * List Roles
	 */
	.get((req, res) => {
		userAuthorized(req, res, () => {
			Role.find()
			.then((roles) => {
	            res.json(new BaseResponse(roles));
	        })
	        .catch((err) => {
	            BaseResponse.sendError(err, res);
	        });
		})
	});

//////////////////////////
// Specific Role routes //
//////////////////////////
router.route('/:id')
	/**
	 * Get a specific Role
	 */
	.get((req, res) => {
		userAuthorized(req, res, () => {
			Role.findById(req.params.id)
			.then((role) => {
				if (role)
					res.json(new BaseResponse(role));
				else
					BaseResponse.sendError('Role not found',res, 404);
			})
			.catch((err) => {
				BaseResponse.sendError(err,res);
			})
		})
	})

	/**
	 * Update a Role
	 */
	.put((req, res) => {
		userAuthorized(req, res, () => {
			let formFields = req.body;
			Role.findById(req.params.id)
			.then((role) => {
				role.name = formFields.name;
				role.save()
				.then((role) => {
					res.json(new BaseResponse(role));
				})
				.catch((err) => {
					BaseResponse.sendError(err, res);
				});
			})
			.catch((err) => {
				BaseResponse.sendError(err, res);
			});
		})
	})

	/**
	 * Delete a Role
	 */
	.delete((req, res) => {
		userAuthorized(req, res, () => {
			Role.remove({_id: req.params.id})
			.then(() => {
				let status = 201;
				res.status(status).json(new BaseResponse([], status, 'Successfully deleted'));
			})
			.catch((err) => {
				BaseResponse.sendError(err, res);
			})
		})
	});

module.exports = router;