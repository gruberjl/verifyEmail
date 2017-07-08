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
