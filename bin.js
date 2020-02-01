const request = require("request");
const ora = require("ora");

const getPcInfo = require("./src/getPcInfo");
const sections = require("./src/sections");

const isSo = require("./src/util/isSo");
const getSoCode = require("./src/util/getSoCode");
const readNextLine = require("./src/util/readNextLine");
const changePcName = require("./src/util/changePcName");
const getLastDigits = require("./src/util/getLastDigits");
const generateHostname = require("./src/util/generateHostname");

function sendData(data) {
  return new Promise((resolve, reject) => {
    request.post(
      "https://pc-info-api.now.sh/api/save",
      { json: data },
      (error, res, body) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(res);
      }
    );
  });
}

async function startScript() {
  console.clear();
  const spinner = ora("Buscando informações!").start();
  spinner.color = "blue";

  const info = await getPcInfo();

  spinner.stop();
  spinner.text = "Enviando dados!";
  spinner.color = "green";

  if (!info.net) {
    console.log("VERIFIQUE SUA CONEXÃO COM A INTERNET!");
    await timeout(5000);
    return;
  }

  console.log("PC INFO - GTI\n");

  const tombo = await readNextLine("INFORMO O TOMBO DA MÁQUINA");
  const type = await readNextLine(
    "\nTIPO DO EQUIPAMENTO \n1 - DESKTOP \n2 - NOTEBOOK"
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
  delete info.vlan;

  info.date = new Date().getTime();

  console.info("HOSTNAME: ", pcName);

  try {
    spinner.start();
    const result = await sendData(info);
  } catch (error) {
    console.log("Erro ao enviar dados:");
    console.log(error);
  } finally {
    spinner.stop();
  }

  console.table(info);

  await timeout(3000);
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

startScript();
