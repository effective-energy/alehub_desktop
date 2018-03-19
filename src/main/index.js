import { app, Menu, BrowserWindow } from 'electron'
import express from 'express'
import { exec } from 'child_process'
import { join as joinPath, dirname } from 'path'
import appRootDir from 'app-root-dir'
import getPlatform from './get-platform'

const execPath = (process.env.NODE_ENV !== 'development') ?
  joinPath(dirname(appRootDir.get()), 'bin'):
  joinPath(appRootDir.get(), 'resources', getPlatform());

const cmd = `${joinPath('cd '+execPath+ '; chmod 777 ./run.sh; ./run.sh')}`

let expressApp = express();

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`;

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    useContentSize: true,
    minWidth: 1200,
    minHeight: 800
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.webContents.openDevTools()

  const template = [
    {
      label: 'Edit',
      submenu: [
        {
          role: 'copy'
        },
        {
          role: 'paste'
        }
      ]
    }
  ];
  
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  // expressApp.use((req, res, next) => {
  //   res.header('Access-Control-Allow-Origin', '*');
  //   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  //   if(res.method === 'OPTIONS') {
  //     res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
  //     return res.status(200).json({

  //     })
  //   }
  //   next();
  // });

  // expressApp.get('/', function (req, res) {
  //   res.send('Hello World!');
  // });

  // expressApp.listen(3000, function () {
  //   console.log('Example app listening on port 3000!');
  // // });
  // child_process.execFile('cd static/wallet; ./ale-wallet --config wallet-config.yaml 12348', (error, stdout, stderr) => {
  //   if (error) {
  //       console.warn(`exec error: ${error}`);
  //   }
  //   console.log(`stduot: ${stdout}`)
  //   console.log(`stderr: ${stderr}`)
  // })
  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.warn(`exec error: ${err}`);
    }
    console.log(`stduot: ${stdout}`)
    console.log(`stderr: ${stderr}`)
  });
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

