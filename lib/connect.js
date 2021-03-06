// const net = require('net')
// const {getMx} = require('./tasks.js')
//
// const emailExists = (mx, email) => new Promise((res, rej) => {
//   const log = []
//   let idx = 0
//   const commands = [ `helo ${mx}`, `mail from: <noreply@gitbit.org>`, `rcpt to: <${email}>` ];
//
//   const client = net.createConnection(25, mx, () => {
//     log.push({action:'info', message:'connected'})
//   })
//
//   client.setEncoding('ascii');
//   client.setTimeout(5000);
//
  // const send = () => {
  //   if(idx < 3) {
  //     log.push({action:'sent', message:commands[idx]})
  //     client.write(commands[idx]);
  //     client.write('\r\n');
  //     idx++;
  //   } else {
  //     res({log, success: true})
  //     client.end();
  //     client.unref();
  //   }
  // }
//
//   const kill = (err) => {
//     rej({log, message: err, success: false})
//     client.write('quit\r\n')
//     client.end()
//     client.unref()
//   }
//
//   client.on('data', (data) => {
//     const message = data.toString()
//     log.push({action:'received', message})
//     if(data.indexOf("220") === 0 || data.indexOf("250") === 0 || data.indexOf("\n220") !== -1 || data.indexOf("\n250") !== -1) {
//       send()
//     } else if(data.indexOf("\n550") != -1 || data.indexOf("550") == 0) {
//       kill('550 error')
//     } else {
//       kill('received unknown response.')
//     }
//   })
//
//   client.on('timeout', function () {
//     rej({log, message: 'timeout'})
//     client.end();
//     client.unref();
// 	})
// })
//
// exports.handler = (event, context, callback) => {
//   emailExists(event.mx, event.email).then((data) => {
//     callback(null, data)
//   }, (err) => {
//     callback(err)
//   })
// }

const net = require('net')
const p = require('./promise.js')

const isResponseOk = (message) => message.indexOf("220") === 0 || message.indexOf("250") === 0 || message.indexOf("\n220") !== -1 || message.indexOf("\n250") !== -1

exports.isEmailValid = (connection, obj) => new Promise((res, rej) => {
  const command = `rcpt to: <${obj.email}>`
  connection.log.push({action:'sent', message:command})

  const onResponse = (data) => {
    const message = data.toString()
    connection.log.push({action:'received', message})
    connection.client.removeListener('data', onResponse)
    connection.client.removeListener('error', onError)

    obj.message = message

    if (isResponseOk(message)) {
      obj.statusCode = 200
      res(obj)
    } else {
      obj.statusCode = 500
      res(obj)
    }
  }

  const onError = (data) => {
    connection.log.push({action:'error', message:data.error, details:data})
    obj.statusCode = 400
    obj.message = data.error
    obj.details = data
    connection.client.removeListener('data', onResponse)
    connection.client.removeListener('error', onError)
    rej({connection, obj})
  }

  connection.client.on('data', onResponse)
  connection.client.on('error', onError)

  connection.client.write(command);
  connection.client.write('\r\n');
})

exports.newConnection = (mxRecord) => new Promise((res, rej) => {
  const connection = {
    log: [],
    isConnected: false,
    mxRecord,
    client: net.createConnection(25, mxRecord, () => {
      connection.log.push({action:'info', message:'connected'})
      send(`helo ${mxRecord}`)
    })
  }

  connection.client.setEncoding('ascii');
  connection.client.setTimeout(5000);

  const send = (message) => {
    connection.log.push({action:'sent', message})
    connection.client.write(message);
    connection.client.write('\r\n');
  }

  const onHeloResponse = (data) => {
    const message = data.toString()
    connection.log.push({action:'received', message})
    connection.client.removeListener('data', onHeloResponse)

    if (isResponseOk(message)) {
      connection.client.on('data', onRcptResponse)
      send('MAIL FROM: <john.gruber@gitbit.org>')
    } else {
      exports.killConnection(connection.client)
      rej(connection)
    }
  }

  const onRcptResponse = (data) => {
    const message = data.toString()
    connection.log.push({action:'received', message})
    connection.client.removeListener('data', onRcptResponse)
    connection.client.removeListener('error', onError)

    if (isResponseOk(message)) {
      connection.isConnected = true
      res(connection)
    } else {
      exports.killConnection(connection.client)
      rej(connection)
    }
  }

  const onError = (data) => {
    connection.log.push({action:'error', message:data.error, details:data})
    connection.client.removeListener('error', onError)
    exports.killConnection(connection).then(() => rej(connection))
  }

  connection.client.on('data', onHeloResponse)

  connection.client.on('error', onError)
})

exports.killConnection = (connection) => new Promise((res, rej) => {
  connection.log.push({action:'info', message:'killing connection'})

  if (!connection.client.destroyed)
    connection.client.write('quit\r\n')

  connection.client.end()
  connection.client.unref()
  connection.isConnected = false
  res(connection)
})

exports.connect = (mxRecords) => p.untilSuccess(mxRecords, (mxRecord) => exports.newConnection(mxRecord.exchange))

exports.verifyEmails = (mxRecords, group) => exports.connect(mxRecords)
  .then((connection) => {
    return p.waterfall(group, (obj) => {
      return exports.isEmailValid(connection, obj)
    }).then((results) => {
      return exports.killConnection(connection).then(() => results)
    })
  })
