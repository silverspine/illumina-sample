/////////////////////
////////////////// //
// Client Model // //
////////////////// //
/////////////////////
const mongoose     = require('mongoose');
const Schema       = mongoose.Schema;

const ClientSchema   = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    married: Boolean,
    male: Boolean,
    age: {
        type: Number,
        get: v => Math.round(v),
        set: v => Math.round(v)
    },
    profession: {
        type: String,
        trim: true
    }
});

module.exports = mongoose.model('Client', ClientSchema);