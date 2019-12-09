const { app, BrowserWindow } = require("electron");
const os = require("os");
const si = require("systeminformation");

let mainWindow;

async function createWindow(data) {
  mainWindow = new BrowserWindow({ width: 400, height: 600 });
  //mainWindow.webContents.openDevTools();

  mainWindow.loadURL("https://gtiforms.now.sh/");
  mainWindow.setMenu(null);

  mainWindow.webContents.on("did-finish-load", async () => {
    mainWindow.webContents.executeJavaScript(`
        window.setInitData(${JSON.stringify(data)})
    `);
  });
}

app.on("ready", async () => {
    const data = await getData();
    createWindow(data)
});

app.on("window-all-closed", function() {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function() {
  if (mainWindow === null) {
    createWindow();
  }
});

async function getData() {
  const data = {};

  const system = await si.system();
  const cpu = await si.cpu();
  const osInfo = await si.osInfo();
  const disk = await si.diskLayout();
  const nets = await si.networkInterfaces();

  data.brand = system.manufacturer;
  data.serial = system.serial;
  data.model = system.model;
  data.uuid = system.uuid;
  data.pcName = os.hostname();
  data.cpuBrand = cpu.manufacturer.replace("™", "").replace("®", "");
  data.cpuModel = cpu.brand.replace("™", "").replace("®", "");

  data.ramSize = formatBytes(os.totalmem());
  data.so = osInfo.distro;
  data.diskSize = formatBytes(disk[0].size);

  const netInfo = nets.find( e => {
    if(e.iface.toLocaleLowerCase().includes('ethernet')) {
      return e
    }
  }) 

  if(netInfo) {
    data.ethernetMac = netInfo.mac
    if(netInfo.speed === 1000) {
      data.velocityEthernet == '1gb'
    } else {
      data.velocityEthernet == '100mb'
    }
  }

  console.log(data);
  return data;
}

function formatBytes(bytes) {
  const marker = 1024;
  const decimal = 3;
  const gigaBytes = marker * marker * marker;
  return Math.floor((bytes / gigaBytes).toFixed(decimal)) + "gb";
}
