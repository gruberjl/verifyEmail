const {isEmail} = require('./lib/tasks.js')
const timeout = 5000

exports.handler = (event, context, callback) => {
    const emailAddress = event.emailAddresses[0]

    emailExistence.check('email@domain.com', function(err,res){
        callback(null, res);
    });
};

const request = require('request-promise');
request({
    method: 'GET',
    uri: 'https://n9l9x7onql.execute-api.us-east-2.amazonaws.com/prod/verifyEmail', //`https://verifyEmail.gitbit.org/prod/verifyEmail`,
    headers: {
      'content-type': 'application/json'
    },
    body: {
      "mx": "gitbit-org.mail.protection.outlook.com",
      "email": "john.gruber@gitbit.org"
    },
    json: true
}).then((response) => {
  console.log(response)
}, (err) => {
  console.log('err')
  console.log(err)
})
