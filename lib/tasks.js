const dns = require('dns')
const request = require('request-promise');

exports.isEmail = (email) =>
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)

exports.getDomain = (email) => email.split('@')[1]

exports.getMx = (domain) => new Promise((res, rej) => {
  dns.resolveMx(domain, (err, addresses) => {
    if (err) {
      rej({topic: 'MX:Error retrieving MX records.', message:err, domain})
    } else if (addresses.length === 0) {
      rej({topic: 'MX:no mx records', message: "there are no mx records for this domain.", domain})
    } else {
      res(addresses.sort(function (a,b) {
  			return a.priority - b.priority
  		}))
    }
  })
})

exports.emailExists = (mx, email) => {
  request({
      method: 'GET',
      uri: 'https://n9l9x7onql.execute-api.us-east-2.amazonaws.com/prod/verifyEmail', //`https://verifyEmail.gitbit.org/prod/verifyEmail`,
      body: {
          "properties": [
              {
                  "name": "mx",
                  "value": mx
              },
              {
                "name": 'email',
                'value': email
              }
          ]
      },
      json: true
  })
}
