const emailExistence = require('email-existence')

exports.handler = (event, context, callback) => {
    const emailAddress = event.emailAddresses[0]

    emailExistence.check('email@domain.com', function(err,res){
        callback(null, res);
    });
};
