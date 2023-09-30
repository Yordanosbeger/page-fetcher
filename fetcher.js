const request = require('request');
const fs = require('fs');
const readline = require('readline');

const url = process.argv[2];
const localFilePath = process.argv[3];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

request(url, (error, response, body) => {
  if (error) {
    console.error('Error:', error);
    process.exit(1);
  }

  if (response.statusCode !== 200) {
    console.error('HTTP request failed with status code:', response.statusCode);
    process.exit(1);
  }

  fs.access(localFilePath, fs.constants.F_OK, (err) => {
    if (!err) {
      rl.question('The local file already exists. Do you want to overwrite it? (Y/N): ', (answer) => {
        if (answer.toLowerCase() === 'y') {
          saveToFile(body);
        } else {
          console.log('Operation cancelled. File not overwritten.');
          rl.close();
        }
      });
    } else {
      saveToFile(body);
    }
  });
});

function saveToFile(data) {
  fs.writeFile(localFilePath, data, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log(`Downloaded and saved ${data.length} bytes to ${localFilePath}`);
    }
    rl.close();
  });
}
