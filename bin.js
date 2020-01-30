const request = require("request");

const getPcInfo = require("./src/getPcInfo");
const sections = require("./src/sections");


const isSo = require('./src/util/isSo');
const getSoCode = require('./src/util/getSoCode');
const readNextLine = require('./src/util/readNextLine');
const changePcName = require('./src/util/changePcName');
const getLastDigits = require('./src/util/getLastDigits');
const generateHostname = require('./src/util/generateHostname');

async function startScript() {
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

  const pcName = generateHostname(info);
  const soCode = getSoCode(info.so);

  info.soCode = soCode;
  info.pcName = pcName;
  info.vlanId = info.section.vlan_id;

  if (isSo(info.so, "WINDOW")) await changePcName(pcName);

  delete info.net;
  delete info.section;
  delete info.tomboCode;
  delete info.vlan

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

startScript();
