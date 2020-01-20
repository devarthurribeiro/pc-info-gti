const readline = require('readline');
const { exec } = require('child_process');

const getPcInfo = require("./src/util/getPcInfo")
const sections = require('./src/sections')

const CODE_UND = '1122'

function readNextLine(question) {

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve, reject) => {
    rl.question(`${question}:`, (answer) => {
      console.log(`resposta: ${answer}`)
      resolve(answer)
      rl.close();
    });
  })
}

function changePcName(currentName, newName) {
  exec(`WMIC computersystem where caption='${currentName}' rename ${newName}`, (err, stdout, stderr) => {
    if (err) 
      return;
    console.log(`stdout: ${stdout}`)
    console.log(`stderr: ${stderr}`)
  })
}

function isSo(so, comp) {
  return so.toUpperCase().includes(comp)
}

function getSoCode(so) {
  let code = 'N'

  if(isSo(so, 'LINUX'))
    code = 'L'
  else if(isSo(so, 'WINDOW'))
    code = 'W'
  else if(isSo(so, 'MAC'))
    code = 'M'

  return code
}

function getSectionCode(ip) {

}

function generateName(pcInfo) {
  let name = `
      ${CODE_UND}-${pcInfo.sCode.name}-${ pcInfo.tomboCode.length === 4 ?  pcInfo.tomboCode : 'PPPP'}${pcInfo.type}${getSoCode(pcInfo.so)}
    `
  return name
}

function getLastDigits(text, n) {
  return text.slice(text.length - n, text.length)
}

async function startApp() {
  const info = await getPcInfo()
  const tombo = await readNextLine('INFORMO O TOMBO DA MAQUINA')
  const type = await readNextLine('TIPO DO EQUIPAMENTO: \n 1 - DESKTOP \n 2 - NOTEBOOK \n')


  info.tombo = tombo
  info.type = ((type === '1' || '') ? 'D' : 'N')

  info.tomboCode = getLastDigits(tombo, 4)
  info.vlan = info.net.ip4.split('.')[2]
  info.sCode = sections.find( s => (info.vlan >= s.init && info.vlan <= s.end))

  const pcName = generateName(info)

  changePcName(info.pcName, pcName)
  console.log('====================================');
  console.log(generateName(info));
  console.log('====================================');
}

startApp()