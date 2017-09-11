const BaseResponse = require('./base_response');

/**
 * Error handling response
 */
function sendError(err, res, status = 500, data = []){
	let message = typeof err == 'object' ? err.message : err;
    res.status(status).json(new BaseResponse( data, status, message));
}

module.exports = sendError;