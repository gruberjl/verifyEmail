const dns = require('dns')

exports.isEmail = (email) =>
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)

exports.getDomain = (email) => email.split('@')[1].toLowerCase()

exports.getMx = (domain) => new Promise((res, rej) => {
  dns.resolveMx(domain, (err, addresses) => {
    if (err) {
      rej({statusCode: 501, message:`MX:Error retrieving MX records.\n${err}`, domain})
    } else if (addresses.length === 0) {
      rej({statusCode: 503, message: `MX:No mx records for this domain.`, domain})
    } else {
      res(addresses.sort(function (a,b) {
  			return a.priority - b.priority
  		}))
    }
  })
})

exports.convert = (emails) => emails.map((email) => ({email}))

exports.getDomains = (objs) => objs.forEach((obj) => {obj.domain = exports.getDomain(obj.email)})

exports.sortByDomain = (objs) => objs.sort((a, b) => {
  if (a.domain < b.domain) return -1
  if (a.domain > b.domain) return 1
  return 0
});

exports.hasError = (obj) => Boolean(obj.statusCode) && obj.statusCode >= 300

exports.groupByDomain = (objs) => objs.reduce(function(arr, obj) {
  if (arr.length === 0) {
    arr.push([obj])
  } else if (arr[arr.length-1][0].domain == obj.domain && arr[arr.length-1].length < 100) {
    arr[arr.length-1].push(obj)
  } else {
    arr.push([obj])
  }

  return arr
}, [])
