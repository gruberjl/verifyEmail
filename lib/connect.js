const net = require('net')

const emailExists = (mx, email) => new Promise((res, rej) => {
  const log = []
  let idx = 0
  const commands = [ `helo ${mx}`, `mail from: <${email}>`, `rcpt to: <${email}>` ];

  const client = net.createConnection(25, mx, () => {
    log.push({action:'info', message:'connected'})
  })

  client.setEncoding('ascii');
  client.setTimeout(5000);

  const send = () => {
    if(idx < 3) {
      log.push({action:'sent', message:commands[idx]})
      client.write(commands[idx]);
      client.write('\r\n');
      idx++;
    } else {
      res({log})
      client.end();
      client.unref();
    }
  }

  const kill = (err) => {
    rej({log, message: err})
    client.write('quit\r\n')
    client.end()
    client.unref()
  }

  client.on('data', (data) => {
    const message = data.toString()
    log.push({action:'received', message})
    if(data.indexOf("220") === 0 || data.indexOf("250") === 0 || data.indexOf("\n220") !== -1 || data.indexOf("\n250") !== -1) {
      send()
    } else if(data.indexOf("\n550") != -1 || data.indexOf("550") == 0) {
      kill('550 error')
    } else {
      kill('received unknown response.')
    }
  })

  client.on('timeout', function () {
    rej({log, message: 'timeout'})
    client.end();
    client.unref();
	})


})

exports.handler = (event, context, callback) => {
  emailExists("gitbit-org.mail.protection.outlook.com", 'john.gruber@gitbit.org').then((data) => {
    callback(null, data)
  }, (err) => {
    callback(err)
  })
}
