const isSo = require('./isSo');

function getSoCode(so) {
  let code = "N";

  if (isSo(so, "LINUX")) code = "L";
  else if (isSo(so, "WINDOW")) code = "W";
  else if (isSo(so, "MAC")) code = "M";

  return code;
}

module.exports = getSoCode;
