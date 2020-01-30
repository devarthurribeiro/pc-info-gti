const readline = require("readline");

function readNextLine(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve, reject) => {
    rl.question(`${question}:`, answer => {
      resolve(answer);
      rl.close();
    });
  });
}

module.exports = readNextLine;
