const getSoCode = require('./getSoCode');

const CODE_UND = "1122";

function generateHostname(pcInfo) {
  let name = `
      ${CODE_UND}-${pcInfo.section.name}-${
    pcInfo.tomboCode.length === 4 ? pcInfo.tomboCode : "PPPP"
  }${pcInfo.type}${getSoCode(pcInfo.so)}
    `.trim();
  return name;
}

module.exports = generateHostname;
