module.exports.untilSuccess = (arr, cbForEach) =>
  arr.reduce(
    (promise, itm) => promise.then(
      (val) => val,
      (err) => cbForEach(itm)
    ),
    new Promise((r, rej) => rej())
  )

module.exports.waterfall = (arr, cb) => {
  const results = []

  return arr.reduce((promise, itm) => promise.then(
    () => cb(itm).then((v) => results.push(v), (v) => results.push(v)),
    () => cb(itm).then((v) => results.push(v), (v) => results.push(v))
  ), Promise.resolve())
  .then(
    () => (results),
    () => (results)
  )
}
