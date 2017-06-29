const dns = require('dns')

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
