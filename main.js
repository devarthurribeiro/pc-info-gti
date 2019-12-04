const { app, BrowserWindow } = require('electron')
const os = require('os')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({width: 400, height: 600})

  mainWindow.loadURL("https://gtiforms.now.sh/")
  mainWindow.setMenu(null)
  
  mainWindow.on('close', () => {
    mainWindow = null
  })

  const pcData = {}

  pcData.pcName = os.hostname()
  pcData.networkData = os.networkInterfaces()
  pcData.cpu = os.cpus()
  console.log(JSON.stringify(pcData))
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
