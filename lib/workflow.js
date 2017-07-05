const {isEmail, getDomain, getMx, convert, getDomains, sortByDomain, groupByDomain, hasError} = require('./tasks.js')
const {verifyEmail} = require('./connect.js')

exports.run = (emails) => new Promise((res, rej) => {
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
  const promise = new Promise((res) => res())

  groups.forEach((group) => {
    if (group[0].domain !== '') {
      promise.then((res, rej) => {
        getMx(group[0].domain)
          .then(null, (err) => {
            group.forEach((obj) => {
              obj.statusCode = err.statusCode
              obj.message = err.message
            })
          })
          .then((mxRecords) => verifyEmail(mxRecords, group))
      })
    }
  })

  promise.then(() => {
    res(groups)
  })
})
