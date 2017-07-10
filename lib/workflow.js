const {isEmail, getDomain, getMx, convert, getDomains, sortByDomain, groupByDomain, hasError} = require('./tasks.js')
const {verifyEmails} = require('./connect.js')
const {waterfall} = require('./promise.js')

exports.run = (emails) => {
  const objs = convert(emails)

  objs.forEach((obj) => {
    if (!isEmail(obj.email)) {
      obj.statusCode = 400
      obj.message = "Doesn't appear to be an email address."
      objs.domain = ''
    }

    obj.domain = getDomain(obj.email)
  })

  sortByDomain(objs)
  const groups = groupByDomain(objs)

  return waterfall(groups, (group) => {
    if (group[0].domain === '')
      return Promise.resolve(group)

    return getMx(group[0].domain).then((mxRecords) => {
      return verifyEmails(mxRecords, group)
    }, (err) => {
      group.forEach((obj) => {
        obj.statusCode = err.statusCode
        obj.message = err.message
      })

      return group
    })
  })
}
