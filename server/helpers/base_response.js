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

module.exports = BaseResponse;