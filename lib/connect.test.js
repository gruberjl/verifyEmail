const {newConnection, killConnection, connect} = require('./connect.js')

describe('newConnection', () => {
  test('should connect', () => newConnection('gitbit-org.mail.protection.outlook.com').then((connection) => {
    expect(connection.isConnected).toBe(true)
    return killConnection(connection)
  }))

  test('should not connect', () => newConnection('BAD-MX.gitbit.org').then(null, (connection) => {
    expect(connection.isConnected).toBe(false)
  }))
})

describe('killConnection', () => {
  test('should kill connection', () => newConnection('gitbit-org.mail.protection.outlook.com')
    .then(killConnection)
    .then((connection) => {
      expect(connection.isConnected).toBe(false)
    }))
})

describe('connect', () => {
  test('should connect to first', () => connect([{exchange:'gitbit-org.mail.protection.outlook.com'}]).then((connection) => {
    console.log('success')
    expect(connection.mx).toEqual('gitbit-org.mail.protection.outlook.com')
  }, (err) => {
    console.log('err')
    console.log(err)
  }))
})
