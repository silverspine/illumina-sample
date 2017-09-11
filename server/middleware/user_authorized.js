const Role = require('../models/role');
const sendError = require('../helpers/error_handler');

////////////////////////////////////////////////////////
// Route middelware to verify if a user is authorized //
////////////////////////////////////////////////////////
function userAuthorized(req, res, next) {
	Role.findOne({name: 'admin'})
	.then( role => {
		let currentUser = req.decoded._doc;
		let isAdmin = currentUser.role._id == role._id;
		let hasParamId = typeof req.params.id !== 'undefined';
		let editsSelf = hasParamId && req.params.id === currentUser._id;
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