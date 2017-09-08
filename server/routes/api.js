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
const moment = require('moment');
const _ = require('lodash');
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

/**
 * Mongoose configuration block
 */
mongoose.Promise = global.Promise;
mongoose.connect(config.DB_URL, {useMongoClient: true});

/**
 * moongose model imports
 */
const Role = require('../models/role');
const User = require('../models/user');
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
// Initialize app with a sample user and user roles //
//////////////////////////////////////////////////////
router.route('/setup')
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

////////////////////
// Authentication //
////////////////////
router.route('/authenticate')
	.post((req,res) => {
		let formFields = req.body;

		User.findOne({username: formFields.username})
		.populate('role')
		.exec()
		.then( user => {
			if (!user ){
				res.json(new BaseResponse([], 200, 'User or password not match'));
			} else {
				user.comparePassword(formFields.password, (err, isMatch) => {
			        if (err) throw err;
			        if(!isMatch){
				    	res.json(new BaseResponse([], 200, 'User or password not match'));
				    }else{
	    				let token = jwt.sign(user, config.SECRET, {
	    					expiresIn: 60*60*24 // Expires in one day
	    				});
	    				user.hidePassword();
	    				let response = new BaseResponse([{user: user, token: token}]);
	    				res.json(response);
	    			}
			        return isMatch;
			    });
			}
		})
		.catch((err) => {
			sendError(err, res);
		})
	});

// Adds multer middleware to handle file uploads
router.use('/users', upload.single('image'));

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

////////////////////////////////////////
// Route middelware to verify a token //
////////////////////////////////////////
router.use((req, res, next) =>{
	let token = req.body.token || req.query.token || req.headers['x-access-token'];

	if(token){
		jwt.verify(token, config.SECRET, (err, decoded) => {
			if(err){
				sendError('Failed to authenticate token', res, 401);
			}else{
				req.decoded = decoded;
				next();
			}
		});
	}else{
		sendError('No token provided.', res, 403);
	}
});

const currentUserIsAdmin = (req, res, next) => {
	Role.findOne({name: 'admin'})
	.then( role => {
		let currentUser = req.decoded._doc;
		if (currentUser.role._id == role._id)
			next();
		else
			sendError("Unauthorized Access.", res, 401);
	})
	.catch( (err) => {
		sendError(err, res);
	})
}

///////////////////////
// User Roles routes //
///////////////////////
router.route('/roles')
	/**
	 * Create a new User Role
	 */
	.post((req, res) => {
		currentUserIsAdmin(req, res, () => {
			let formFields = req.body;
			let role = new Role();
			role.name = formFields.name;
			role.save()
			.then((role) => {
				let status = 201;
				res.status(status).json(new BaseResponse(role, status));
			})
			.catch((err) => {				
				sendError(err, res, 409);
			});
		})
	})

	/**
	 * List Roles
	 */
	.get((req, res) => {
		currentUserIsAdmin(req, res, () => {
			Role.find()
			.then((roles) => {
	            res.json(new BaseResponse(roles));
	        })
	        .catch((err) => {
	            sendError(err, res);
	        });
		})
	});

//////////////////////////
// Specific Role routes //
//////////////////////////
router.route('/roles/:id')
	/**
	 * Get a specific Role
	 */
	.get((req, res) => {
		currentUserIsAdmin(req, res, () => {
			Role.findById(req.params.id)
			.then((role) => {
				if (role)
					res.json(new BaseResponse(role));
				else
					sendError('Role not found',res, 404);
			})
			.catch((err) => {
				sendError(err,res);
			})
		})
	})

	/**
	 * Update a Role
	 */
	.put((req, res) => {
		currentUserIsAdmin(req, res, () => {
			let formFields = req.body;
			Role.findById(req.params.id)
			.then((role) => {
				role.name = formFields.name;
				role.save()
				.then((role) => {
					res.json(new BaseResponse(role));
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
	 * Delete a Role
	 */
	.delete((req, res) => {
		currentUserIsAdmin(req, res, () => {
			Role.remove({_id: req.params.id})
			.then(() => {
				let status = 201;
				res.status(status).json(new BaseResponse([], status, 'Successfully deleted'));
			})
			.catch((err) => {
				sendError(err, res);
			})
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
		currentUserIsAdmin(req, res, () => {
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
router.route('/users/:id')
	/**
	 * Get a specific User
	 */
	.get((req, res) => {
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

	/**
	 * Update a User
	 */
	.put((req, res) => {
		currentUserIsAdmin(req, res, () => {
			let formFields = req.body;
			User.findById(req.params.id)
			.then((user) => {
				user.username = formFields.username;
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
		currentUserIsAdmin(req, res, () => {
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

module.exports = router;