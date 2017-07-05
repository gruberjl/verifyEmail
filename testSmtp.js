const net = require('net')

let idx = 0
const log = []
const commands = [`mail from: <noreply@gitbit.org>`, `rcpt to: <john.gruber@gitbit.org>` ];

const client = net.createConnection(25, 'gitbit-org.mail.protection.outlook.com', () => {
  log.push({action:'info', message:'connected'})
  send('helo gitbit-org.mail.protection.outlook.com')
})

client.setEncoding('ascii');
client.setTimeout(5000);

const isResponseOk = (message) => message.indexOf("220") === 0 || message.indexOf("250") === 0 || message.indexOf("\n220") !== -1 || message.indexOf("\n250") !== -1

const onHeloResponse = (data) => {
  const message = data.toString()
  log.push({action:'received', message})

  if (isResponseOk(message)) {
    client.removeListener('data', onHeloResponse)
    client.on('data', onRcptResponse)
    send('rcpt to: <john.gruber@gitbit.org>')
  } else {
    kill()
  }
}

const onRcptResponse = (data) => {
  const message = data.toString()
  log.push({action:'received', message})

  if (isResponseOk(message)) {
    client.removeListener('data', onRcptResponse)
    kill()
  } else {
    kill()
  }
}

const send = (message) => {
    log.push({action:'sending', message})
    client.write(message);
    client.write('\r\n');
}

const kill = () => {
  console.log(log)
  console.log(client.removeListener)
  client.write('quit\r\n')
  client.end()
  client.unref()
}

client.on('data', onHeloResponse)

client.on('timeout', function () {
  log.push({action:'timeout', message:'timeout occurred'})
  kill()
})
