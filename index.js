const {isEmail} = require('./lib/tasks.js')
const timeout = 5000

exports.handler = (event, context, callback) => {
    const emailAddress = event.emailAddresses[0]

    emailExistence.check('email@domain.com', function(err,res){
        callback(null, res);
    });
};
