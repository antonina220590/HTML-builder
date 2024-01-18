const fs = require('fs');
const path = require('path');
const { stdout } = require('process');
const myResult = fs.createReadStream(
  path.join(__dirname, 'text.txt'),
  'utf8',
  (err) => {
    if (err) throw err;
  },
);
myResult.on('data', (chunk) => stdout.write(chunk));