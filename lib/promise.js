module.exports.untilSuccess = (arr, cbForEach) =>
  arr.reduce(
    (promise, itm) => promise.then(
      (val) => val,
      (err) => cbForEach(itm)
    ),
    new Promise((r, rej) => rej())
  )

module.exports.waterfall = (arr, cb) => {
  const passed = []
  const failed = []

  return arr.reduce((promise, itm) => promise.then(
    () => cb(itm).then((v) => passed.push(v), (v) => failed.push(v)),
    () => cb(itm).then((v) => passed.push(v), (v) => failed.push(v))
  ), Promise.resolve())
  .then(
    () => ({passed, failed}),
    () => ({passed, failed})
  )
}
