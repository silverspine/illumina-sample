///////////////////////////////
// users resource controller //
///////////////////////////////
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const moment = require('moment');
const fs = require('fs');
const multer = require('multer');
const upload = multer({
	dest: '/uploads/',
	onFileUploadStart: function (file) {
		let imagePath = file.path;

		gm(imagePath).resize(850, 850).quality(70).noProfile().write('public/uploads/spots/850x850/'+file.name+moment(), function (err) {
			if (!err) {
				gm(imagePath).resize(150, 150).quality(70).noProfile().write('public/uploads/spots/150x150/'+file.name+moment(), function (err) {
					if (!err) {

					}
					else{
						console.log('Error: '+err);
					}
				});
			}else{
				console.log('Error: '+err);
			}
		});
	}
});
router.use('/', upload.single('image'));

const tokenVerify = require('../middleware/token_verify');
router.use('/', tokenVerify);

const userAuthorized = require('../middleware/user_authorized');

const User = require('../models/user');
const BaseResponse = require('../helpers/base_response');
const sendError = require('../helpers/error_handler');



/////////////////
// User routes //
/////////////////
router.route('/')
	/**
	 * Create a new User
	 */
	.post((req, res) => {
		userAuthorized(req, res, () => {
			let formFields = req.body;
			if(typeof formFields.role !== 'object')
				formFields.role = {_id: formFields.role};
			let user = new User();
			Role.findOne(formFields.role)
			.then((role) => {
				user.username = formFields.username;
				user.password = formFields.password;
				user.role = formFields.role;
				user.save()
				.then((user) => {
					user.hidePassword();
					user.role = role;
					let status = 201;
					res.status(status).json(new BaseResponse(user, status));
				})
				.catch((err) => {				
					sendError(err, res, 409);
				});
			})
			.catch((err) => {				
				sendError(err, res, 409);
			});
		})
	})

	/**
	 * List Users
	 */
	.get((req, res) => {
		User.find()
		.populate('role')
		.exec()
		.then((users) => {
			_.each(users, (user) => {
				user.hidePassword();
			});
            res.json(new BaseResponse(users));
        })
        .catch((err) => {
            sendError(err, res);
        });
	});

//////////////////////////
// Specific User routes //
//////////////////////////
router.route('/:id')
	/**
	 * Get a specific User
	 */
	.get((req, res) => {
		userAuthorized(req, res, () => {
			User.findById(req.params.id)
			.populate('role')
			.exec()
			.then((user) => {
				if (user){
					user.hidePassword();
					res.json(new BaseResponse(user));
				}else
					sendError('User not found',res, 404);
			})
			.catch((err) => {
				sendError(err,res);
			})
		})
	})

	/**
	 * Update a User
	 */
	.put((req, res) => {
		userAuthorized(req, res, () => {
			let formFields = req.body;
			User.findById(req.params.id)
			.then((user) => {
				user.username = formFields.username;
				let passwordFieldDefined = typeof formFields.password !== 'undefined';
				let modifiedPasswordFieldDefined = typeof formFields.modifiedPassword !== 'undefined';
				let newPassword = (passwordFieldDefined && !modifiedPasswordFieldDefined);
				let modifiedPassword = (passwordFieldDefined && modifiedPasswordFieldDefined && formFields.modifiedPassword);
				if(newPassword || modifiedPassword)
					user.password = formFields.password;
				user.role = formFields.role;
				user.save()
				.then((user) => {
					user.hidePassword();
					res.json(new BaseResponse(user));
				})
				.catch((err) => {
					sendError(err, res);
				});
			})
			.catch((err) => {
				sendError(err, res);
			});
		})
	})

	/**
	 * Delete a User
	 */
	.delete((req, res) => {
		userAuthorized(req, res, () => {
			User.remove({_id: req.params.id})
			.then(() => {
				let status = 201;
				res.status(status).json(new BaseResponse([], status, 'Successfully deleted'));
			})
			.catch((err) => {
				sendError(err, res);
			})
		})
	});

module.exports = router;