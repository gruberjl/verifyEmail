const {newConnection, killConnection, connect, isEmailValid} = require('./connect.js')

describe('newConnection', () => {
  test('should connect', () => newConnection('gitbit-org.mail.protection.outlook.com').then((connection) => {
    expect(connection.isConnected).toBe(true)
    return killConnection(connection)
  }), ()=>{expect('Port 25 probably closed.').toBeNull()})

  test('should not connect', () => newConnection('BAD-MX.gitbit.org').then(null, (connection) => {
    expect(connection.isConnected).toBe(false)
  }))
})

describe('killConnection', () => {
  test('should kill connection', () => newConnection('gitbit-org.mail.protection.outlook.com')
    .then(killConnection, () => {expect('Port 25 probably closed.').toBeNull()})
    .then((connection) => {
      expect(connection.isConnected).toBe(false)
    })
    .catch(() => {expect('Port 25 probably closed.').toBeNull()})
  )
})

describe('connect', () => {
  test('should connect to first', () => connect([{exchange:'gitbit-org.mail.protection.outlook.com'}]).then((connection) => {
    expect(connection.mx).toEqual('gitbit-org.mail.protection.outlook.com')
  }, (err) => {
    expect('Port 25 probably closed.').toBeNull();
  }))
})

describe('isEmailValid', () => {
  test('should be valid', () => connect([{exchange:'gitbit-org.mail.protection.outlook.com'}])
    .then((connection) => isEmailValid(connection, 'john.gruber@gitbit.org'))
    .then((response) => {
      expect(response.isValid).toBe(true)
      return killConnection(response.connection)
    })
    .catch((err) => {
      expect('Port 25 probably closed.').toBeNull()
      killConnection(err.connection)
    }))
})
