const {isEmail, getDomain, getMx} = require('./tasks.js')

describe('isEmail', () => {
  test('should validate', () => {expect(isEmail('me@gmail.com')).toBe(true)})
  test('should fail', () => {expect(isEmail('gruberjlgmail.com')).toBe(false)})
})

describe('getDomain', () => {
  test('should get domain', () => {expect(getDomain('me@gmail.com')).toBe("gmail.com")})
})

describe('getMx', () => {
  test('should get mx', () => getMx('gitbit.org').then((results) => {
    expect(results.length).toBe(1)
    expect(results).toContainEqual({"exchange": "gitbit-org.mail.protection.outlook.com", "priority": 10})
  }))

  test('should not have mx records', () => getMx('ugh.gitbit.org').then(null, (err) => {
    expect(err.topic).toBe("MX:Error retrieving MX records.")
    expect(err.domain).toBe('ugh.gitbit.org')
  }))
})
