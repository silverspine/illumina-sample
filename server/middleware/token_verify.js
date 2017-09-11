const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config/server');
const sendError = require('../helpers/error_handler');

////////////////////////////////////////
// Route middelware to verify a token //
////////////////////////////////////////
router.use((req, res, next) =>{
	console.log("TokenVerify");
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

module.exports = router;