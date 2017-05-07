var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');      // npm encryption module

var userSchema = mongoose.Schema({
  fullname: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String},
  role: {type: String, default: ''},
  company: {
    name: {type: String, default: ''},    // this is position of user: admin, normal user, developer, etc
    image: {type: String, default: ''}
  },
  passwordResetToken: {type: String, default: ''},
  passwordResetExpires: {type: Date, default: Date.now}
});

userSchema.methods.encryptPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null); // pasword will be encrypted before it is entered into the db
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);
