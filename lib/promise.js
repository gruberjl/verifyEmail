module.exports.untilSuccess = (arr, cbForEach) =>
  arr.reduce(
    (promise, itm) => promise.then(
      (val) => val,
      (err) => cbForEach(itm)
    ),
    new Promise((r, rej) => rej())
  )
