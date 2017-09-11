const Role = require('../models/role');
const sendError = require('../helpers/error_handler');

////////////////////////////////////////////////////////
// Route middelware to verify if a user is authorized //
////////////////////////////////////////////////////////
function userAuthorized(req, res, next) {
	console.log("UserAuthorized");
	Role.findOne({name: 'admin'})
	.then( role => {
		let currentUser = req.decoded._doc;
		console.log('check if authorized');
		console.log('%s %s %s', req.method, req.url, req.path);
		let isAdmin = currentUser.role._id == role._id;
		console.log('isAdmin: '+ isAdmin);
		let hasParamId = typeof req.params.id !== 'undefined';
		console.log('hasParamId: '+ hasParamId);
		let editsSelf = hasParamId && req.params.id === currentUser._id;
		console.log('editsSelf: '+ editsSelf);
		if (isAdmin || editsSelf)
			next();
		else
			sendError("Unauthorized Access.", res, 401);
	})
	.catch( (err) => {
		sendError(err, res);
	})
}

module.exports = userAuthorized;