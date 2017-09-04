/////////////////////////////////////////////////////
////////////////////////////////////////////////// //
// router to handle the CRUD operations via API // //
////////////////////////////////////////////////// //
/////////////////////////////////////////////////////

const express = require('express');
const router = express.Router();
const config = require('../config/server');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

/**
 * Mongoose configuration block
 */
mongoose.Promise = global.Promise;
mongoose.connect(config.db_url);

/**
 * moongose model imports
 */
const User = require('../models/user');
const Type = require('../models/type');
const Client = require('../models/client');

/**
 * Base response object
 */
class BaseResponse{
	constructor(data = [], status = 200, message = null){
		this.status = status;
		this.data = data;
		this.message = message;
	}
}

/**
 * Error handling response
 */
const sendError = (err, res, status = 500, data = []) => {
	let message = typeof err == 'object' ? err.message : err;
    res.status(status).json(new BaseResponse( data, status, message));
};

//////////////////////////////////////////////////////
// Initialize app with a sample user and user types //
//////////////////////////////////////////////////////
router.route('/setup')
	.get((req, res) => {
		let adminType, testUser;
		
		Type.findOne({name: "admin"})
		.then((type) => {
			if (type)
				adminType = type;
			else
				adminType = null;
		})
		.catch((err) => {
			adminType = null;
		});

		if(!adminType){
			adminType = new Type();
			adminType.name = 'admin';
			adminType.save();
		}

		testUser = new User();
		testUser.username = 'admin';
		testUser.password = 'admin';
		testUser.type=adminType._id;
		testUser.save()
		.then((user) => {
			let status = 201;
			res.status(status).json(new BaseResponse(user, status));
		})
		.catch((err) => {				
			sendError(err, res, 409);
		});
	});


///////////////////////
// User Types routes //
///////////////////////
router.route('/types')
	/**
	 * Create a new User Type
	 */
	.post((req, res) => {
		let formFields = req.body;
		let type = new Type();
		type.name = formFields.name;
		type.save()
			.then((type) => {
				let status = 201;
				res.status(status).json(new BaseResponse(type, status));
			})
			.catch((err) => {				
				sendError(err, res, 409);
			});
	})

	/**
	 * List Types
	 */
	.get((req, res) => {
		Type.find()
		.then((types) => {
            res.json(new BaseResponse(types));
        })
        .catch((err) => {
            sendError(err, res);
        });
	});


//////////////////////////
// Specific Type routes //
//////////////////////////
router.route('/types/:id')
	/**
	 * Get a specific Type
	 */
	.get((req, res) => {
		Type.findById(req.params.id)
		.then((type) => {
			if (type)
				res.json(new BaseResponse(type));
			else
				sendError('Type not found',res, 404);
		})
		.catch((err) => {
			sendError(err,res);
		})
	})

	/**
	 * Update a Type
	 */
	.put((req, res) => {
		let formFields = req.body;
		Type.findById(req.params.id)
		.then((type) => {
			type.name = formFields.name;
			type.save()
			.then((type) => {
				res.json(new BaseResponse(type));
			})
			.catch((err) => {
				sendError(err, res);
			});
		})
		.catch((err) => {
			sendError(err, res);
		});
	})

	/**
	 * Delete a Type
	 */
	.delete((req, res) => {
		Type.remove({_id: req.params.id})
		.then(() => {
			let status = 201;
			res.status(status).json(new BaseResponse([], status, 'Successfully deleted'));
		})
		.catch((err) => {
			sendError(err, res);
		})
	});


/////////////////
// User routes //
/////////////////
router.route('/users')
	/**
	 * Create a new User
	 */
	.post((req, res) => {
		let formFields = req.body;
		let user = new User();
		user.username = formFields.username;
		user.password = formFields.password;
		user.type = formFields.type;
		user.save()
			.then((user) => {
				let status = 201;
				res.status(status).json(new BaseResponse(user, status));
			})
			.catch((err) => {				
				sendError(err, res, 409);
			});
	})

	/**
	 * List Users
	 */
	.get((req, res) => {
		User.find()
		.populate('type')
		.exec()
		.then((users) => {
            res.json(new BaseResponse(users));
        })
        .catch((err) => {
            sendError(err, res);
        });
	});

//////////////////////////
// Specific User routes //
//////////////////////////
router.route('/users/:id')
	/**
	 * Get a specific User
	 */
	.get((req, res) => {
		User.findById(req.params.id)
		.populate('type')
		.exec()
		.then((user) => {
			if (user)
				res.json(new BaseResponse(user));
			else
				sendError('User not found',res, 404);
		})
		.catch((err) => {
			sendError(err,res);
		})
	})

	/**
	 * Update a User
	 */
	.put((req, res) => {
		let formFields = req.body;
		User.findById(req.params.id)
		.then((user) => {
			user.username = formFields.username;
			user.password = formFields.password;
			user.type = formFields.type;
			user.save()
			.then((user) => {
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

	/**
	 * Delete a User
	 */
	.delete((req, res) => {
		User.remove({_id: req.params.id})
		.then(() => {
			let status = 201;
			res.status(status).json(new BaseResponse([], status, 'Successfully deleted'));
		})
		.catch((err) => {
			sendError(err, res);
		})
	});

///////////////////
// Client routes //
///////////////////
router.route('/clients')
	/**
	 * Create a new Client
	 */
	.post((req, res) => {
		let formFields = req.body;
		let client = new Client();
		client.name = formFields.name;
		client.phone = formFields.phone;
		client.married = formFields.married;
		client.male = formFields.male;
		client.age = formFields.age;
		client.profession = formFields.profession;
		client.save()
			.then((client) => {
				let status = 201;
				res.status(status).json(new BaseResponse(client, status));
			})
			.catch((err) => {				
				sendError(err, res, 409);
			});
	})

	/**
	 * List Clients
	 */
	.get((req, res) => {
		Client.find()
		.then((clients) => {
            res.json(new BaseResponse(clients));
        })
        .catch((err) => {
            sendError(err, res);
        });
	});

////////////////////////////
// Specific Client routes //
////////////////////////////
router.route('/clients/:id')
	/**
	 * Get a specific Client
	 */
	.get((req, res) => {
		Client.findById(req.params.id)
		.then((client) => {
			if (client)
				res.json(new BaseResponse(client));
			else
				sendError('Client not found',res, 404);
		})
		.catch((err) => {
			sendError(err,res);
		})
	})

	/**
	 * Update a Client
	 */
	.put((req, res) => {
		let formFields = req.body;
		Client.findById(req.params.id)
		.then((client) => {
			client.name = formFields.name;
			client.phone = formFields.phone;
			client.married = formFields.married;
			client.male = formFields.male;
			client.age = formFields.age;
			client.profession = formFields.profession;
			client.save()
			.then((client) => {
				res.json(new BaseResponse(client));
			})
			.catch((err) => {
				sendError(err, res);
			});
		})
		.catch((err) => {
			sendError(err, res);
		});
	})

	/**
	 * Delete a Client
	 */
	.delete((req, res) => {
		Client.remove({_id: req.params.id})
		.then(() => {
			let status = 201;
			res.status(status).json(new BaseResponse([], status, 'Successfully deleted'));
		})
		.catch((err) => {
			sendError(err, res);
		})
	});

////////////////////
// Authentication //
////////////////////
router.route('/authenticate')
	.post((req,res) => {
		let formFields = req.body;

		User.findOne({username: formFields.username})
		.then((user) => {
			if (!user || user.password !== formFields.password ){
				res.json(new BaseResponse([], 200, 'User or password not match'));
			} else {
				let token = jwt.sign(user, config.secret, {
					expiresIn: 60*60*24 // Expires in one day
				});
				res.json(new BaseResponse([token]));
			}
		})
		.catch((err) => {
			sendError(err, res);
		})
	});

module.exports = router;