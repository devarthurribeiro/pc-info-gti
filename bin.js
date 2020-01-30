const readline = require("readline");
const { exec } = require("child_process");
const request = require("request");

const getPcInfo = require("./src/util/getPcInfo");
const sections = require("./src/sections");

const CODE_UND = "1122";

function readNextLine(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve, reject) => {
    rl.question(`${question}:`, answer => {
      console.log(`resposta: ${answer}`);
      resolve(answer);
      rl.close();
    });
  });
}

function execShellCommand(cmd) {
  console.log(cmd);
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
      }
      resolve(stdout ? stdout : stderr);
    });
  });
}

function changePcName(newName) {
  return execShellCommand(
    "WMIC COMPUTERSYSTEM WHERE CAPTION='%computername%' RENAME '" +
      newName.trim() +
      "'"
  );
}

function isSo(so, comp) {
  return so.toUpperCase().includes(comp);
}

function getSoCode(so) {
  let code = "N";

  if (isSo(so, "LINUX")) code = "L";
  else if (isSo(so, "WINDOW")) code = "W";
  else if (isSo(so, "MAC")) code = "M";

  return code;
}

function getSectionCode(ip) {}

function generateName(pcInfo) {
  let name = `
      ${CODE_UND}-${pcInfo.section.name}-${
    pcInfo.tomboCode.length === 4 ? pcInfo.tomboCode : "PPPP"
  }${pcInfo.type}${getSoCode(pcInfo.so)}
    `.trim();
  return name;
}

function getLastDigits(text, n) {
  return text.slice(text.length - n, text.length);
}

async function startApp() {
  const info = await getPcInfo();
  const tombo = await readNextLine("INFORMO O TOMBO DA MAQUINA");
  const type = await readNextLine(
    "TIPO DO EQUIPAMENTO: \n 1 - DESKTOP \n 2 - NOTEBOOK \n"
  );

  info.tombo = tombo;
  info.type = type === "2" || "" ? "N" : "D";

  info.tomboCode = getLastDigits(tombo, 4);
  info.vlan = info.net.ip4.split(".")[2];
  info.section = sections.find(s => info.vlan >= s.init && info.vlan <= s.end);

  const pcName = generateName(info);
  const soCode = getSoCode(info.so);

  info.soCode = soCode;
  info.pcName = pcName;
  info.vlanId = info.section.vlan_id;

  if (isSo(info.so, "WINDOW")) await changePcName(pcName);

  delete info.net;
  delete info.section;
  delete info.tomboCode;

  info.date = new Date().getTime()

  console.log(pcName);
  console.log(info);

  request.post(
    "https://pc-info-api.now.sh/api/save",
    { json: info },
    (error, res, body) => {
      if (error) {
        console.error(error);
        return;
      }
      console.log(`statusCode: ${res.statusCode}`);
      console.log(body);
    }
  );

  await timeout(3000);
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

startApp();
