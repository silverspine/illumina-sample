///////////////////////////////
// Authentication controller //
///////////////////////////////
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

///////////////////////////////
// Configuration file import //
///////////////////////////////
const config = require('../config/server');

///////////////////
// Model imports //
///////////////////
const User = require('../models/user');

////////////////////
// Helper imports //
////////////////////
const BaseResponse = require('../helpers/base_response');
const sendError = require('../helpers/error_handler');

////////////////////
// Authentication //
////////////////////
router.route('/')
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

module.exports = router;