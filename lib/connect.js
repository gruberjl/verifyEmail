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
//   const send = () => {
//     if(idx < 3) {
//       log.push({action:'sent', message:commands[idx]})
//       client.write(commands[idx]);
//       client.write('\r\n');
//       idx++;
//     } else {
//       res({log, success: true})
//       client.end();
//       client.unref();
//     }
//   }
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

exports.isEmailValid = (connection, email) => new Promise((res, rej) => {
  res()
})

exports.tryConnect = (mxRecord) => new Promise((res, rej) => {
  res()
})

exports.connect = async (mxRecords) => {
  let isConnected = false

  for (i = 0; i < mxRecords.length; i++) {
    if (!isConnected) {
      const connection = await exports.tryConnect(mxRecords[i])
      if (connection.statusCode)
        isConnected = false
    }
  }
}

exports.verifyEmail = (mxRecords, group) => new Promise((res, rej) => {
  exports.connect(mxRecords).then((connection) => {

  })
})
