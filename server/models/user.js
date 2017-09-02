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
    role: {
    	type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    }
});

module.exports = mongoose.model('User', UserSchema);