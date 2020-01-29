const os = require("os");
const si = require("systeminformation");

async function getPcInfo() {
  const data = {};

  const system = await si.system();
  const cpu = await si.cpu();
  const osInfo = await si.osInfo();
  const disk = await si.diskLayout();
  const nets = await si.networkInterfaces();

  data.brand = system.manufacturer;
  data.serial = system.serial.toUpperCase();
  data.model = system.model;
  data.uuid = system.uuid;
  data.pcName = os.hostname();
  data.cpuBrand = cpu.manufacturer.replace("™", "").replace("®", "");
  data.cpuModel = cpu.brand.replace("™", "").replace("®", "");

  data.ramSize = formatBytes(os.totalmem());
  data.so = osInfo.distro;
  data.diskSize = formatBytes(disk[0].size);

  //pegar o mac por meio do ip
  const netInfo = getIfaceByIp('10.77', nets)

  if (netInfo) {
    data.mac = netInfo.mac;
    data.netSpeed = netInfo.speed
  }

  data.net = getIfaceByIp('10.77', nets)
  return data;
}

function getIfaceByIp(ip, ifaces) {
  return ifaces.find( iface => iface.ip4.includes(ip))
} 

function formatBytes(bytes) {
  const marker = 1024;
  const decimal = 3;
  const gigaBytes = marker * marker * marker;
  return Math.floor((bytes / gigaBytes).toFixed(decimal)) + "gb";
}

module.exports = getPcInfo