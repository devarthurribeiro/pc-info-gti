const { app, BrowserWindow } = require("electron");
const getPcInfo = require("./src/util/getPcInfo")

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
    const data = await getPcInfo();
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
