///////////////////
//////////////// //
// User Model // //
//////////////// //
///////////////////
const mongoose     = require('mongoose');
const Schema       = mongoose.Schema;

const UserSchema   = new Schema({
    username: {
    	type: String,
    	required: true,
    	unique: true,
    	trim: true
    },
    password: {
    	type: String,
    	required: true
    },
    type: {
    	type: mongoose.Schema.Types.ObjectId,
        ref: 'Type'
    }
});

module.exports = mongoose.model('User', UserSchema);