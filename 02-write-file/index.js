const fs = require('fs');
const path = require('path');
const { stdout } = require('process');
const newWritableStream = fs.createWriteStream(
  path.join(__dirname, 'yourText.txt'),
  'utf-8',
);
const readline = require('readline');

const myCreatedRedline = readline.createInterface(
  process.stdin,
  process.stdout,
);

myCreatedRedline.setPrompt(`Hello! Please insert your text! \n`);
myCreatedRedline.prompt();
myCreatedRedline.on('line', (yourText) => {
  if (yourText.trim().toLowerCase() === 'exit') {
    finishProcess();
  } else {
    newWritableStream.write(`${yourText}\n`);
  }
});

myCreatedRedline.on('SIGINT', () => {
  finishProcess();
});

function finishProcess() {
  stdout.write('Thank you for your review!\n');
  myCreatedRedline.close();
}
