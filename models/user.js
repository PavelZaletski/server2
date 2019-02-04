var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	username: {
		type: String,
		default: ''
	},
	password: {
		type: String,
		default: ''
	},
	facebookId: String,
});

const User = mongoose.model('User', UserSchema);
module.exports = User;