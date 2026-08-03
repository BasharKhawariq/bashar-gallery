require('dotenv').config();
const { URL } = require('url');
const dns = require('dns');
const net = require('net');

const urlStr = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!urlStr) {
  console.error('NO DB URL in env');
  process.exit(4);
}

let u;
try {
  u = new URL(urlStr);
} catch (e) {
  console.error('PARSE URL ERROR', e.message);
  process.exit(5);
}

const host = u.hostname;
const port = parseInt(u.port || '5432', 10);
console.log('Using DB host:', host, 'port:', port);

dns.lookup(host, { all: true }, (err, addrs) => {
  if (err) console.error('DNS lookup error', err.message || err);
  else console.log('DNS addresses:', JSON.stringify(addrs));

  const socket = net.createConnection({ host, port }, () => {
    console.log('TCP: connected');
    socket.end();
    process.exit(0);
  });

  socket.on('error', (e) => {
    console.error('TCP error', e.code || e.message);
    process.exit(2);
  });

  setTimeout(() => {
    console.error('TCP: timeout');
    socket.destroy();
    process.exit(3);
  }, 5000);
});
