const execShellCommand = require('./execShellCommand');

function changePcName(newName) {
  return execShellCommand(
    "WMIC COMPUTERSYSTEM WHERE CAPTION='%computername%' RENAME '" +
      newName.trim() +
      "'"
  );
}

module.exports = changePcName;
