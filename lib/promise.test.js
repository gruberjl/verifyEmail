const p = require('./promise.js')

describe('untilSuccess', () => {
  test('should pass', () => p.untilSuccess([9,8,7,6,5,4,3,2,1], (num) => new Promise((res, rej) => {
    setTimeout(() => {
      if (num < 5) res(num)
      else rej(num)
    }, (Math.random() * 1.5 | 0))
  })).then((result) => {
    expect(result).toEqual(4)
  }))
})

describe('waterfall', () => {
  test('should pass', () => p.waterfall([{v:1}, {v:2}], (num) => new Promise((res, rej) => {
    setTimeout(() => {
      if (num.v < 2) {
        num.valid = true
        res(num)
      }
      else {
        num.valid = false
        rej(num)
      }
    }, (Math.random() * 1.5 | 0))
  })).then((result) => {
    expect(result).toEqual([{v:1, valid:true}, {v:2, valid:false}])
  }))
})
