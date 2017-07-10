const {run} = require('./workflow.js')

describe('workflow', () => {
  test('should validate emails', () => run(['john.gruber@gitbit.org']).then((results) => {
    expect(results).toEqual([ [ { email: 'john.gruber@gitbit.org', domain: 'gitbit.org', message: '250 2.1.0 Sender OK\r\n', statusCode: 200 } ] ])
  }))
})
