const {newConnection, killConnection, connect, isEmailValid, verifyEmails} = require('./connect.js')

describe('newConnection', () => {
  test('should connect', () => newConnection('gitbit-org.mail.protection.outlook.com').then((connection) => {
    expect(connection.isConnected).toBe(true)
    return killConnection(connection)
  }, ()=>{expect('Port 25 probably closed.').toBeNull()}))

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
    expect(connection.mxRecord).toEqual('gitbit-org.mail.protection.outlook.com')
    return killConnection(connection)
  }, (err) => {
    expect('Port 25 probably closed.').toBeNull();
  }))
})

describe('isEmailValid', () => {
  test('should be valid', () => connect([{exchange:'gitbit-org.mail.protection.outlook.com'}])
    .then((connection) => {
      return isEmailValid(connection, {email: 'john.gruber@gitbit.org'}).then((obj) => {
        expect(obj.statusCode).toBe(200)
        return killConnection(connection)
      })
    })
    .catch((err) => {
      expect('Port 25 probably closed.').toBeNull()
      return killConnection(err.connection)
    }))
})

describe('verifyEmails', () => {
  test('should be valid', () => verifyEmails([{exchange:'gitbit-org.mail.protection.outlook.com'}], [{email:'john.gruber@gitbit.org'}])
    .then((results) => {
      expect(results).toEqual([{email: 'john.gruber@gitbit.org', message: '250 2.1.0 Sender OK\r\n', statusCode: 200}])
    })
    .catch((err) => {
      expect('Port 25 probably closed.').toBeNull()
      return killConnection(err.connection)
    }))
})
