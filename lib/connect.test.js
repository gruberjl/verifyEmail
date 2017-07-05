const {newConnection, killConnection} = require('./connect.js')

describe('newConnection', () => {
  // test('should connect', () => newConnection('gitbit-org.mail.protection.outlook.com').then((connection) => {
  //   expect(connection.isConnected).toBe(true)
  //   return killConnection(connection)
  // }))

  test('should not connect', () => newConnection('BAD-MX.gitbit.org').then(null, (connection) => {
    expect(connection.isConnected).toBe(false)
  }))
})
