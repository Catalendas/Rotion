import { app, shell, BrowserWindow, ipcMain } from 'electron'
import path, { join } from 'node:path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/rotion.png?asset'

import { createFileRoute, createURLRoute } from 'electron-router-dom'

import './ipc.ts'
import './store.ts'
import { createTray } from './tray.ts'
import { createShortcut } from './shortcut'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1120,
    height: 800,
    show: false,
    backgroundColor: '#17141f',
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    icon: path.join(__dirname, '..', '../resources/rotion.png'),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: false
    },
  })

  createTray(mainWindow)
  createShortcut(mainWindow)

  if (process.platform === 'darwin') {
    app.dock.setIcon(path.resolve(__dirname, 'rotion.png'))
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  const devServerURL = createURLRoute(process.env.ELECTRON_RENDERER_URL, 'main')

  const fileRoute = createFileRoute(
    join(__dirname, '../renderer/index.html'),
    'main',
  )

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(devServerURL)
  } else {
    mainWindow.loadFile(...fileRoute)
  }
}

// Exemplo de como criar uma pagina customizada
function createNewWindow(): void {
  const newWin = new BrowserWindow({
    width: 400,
    height: 300,
    backgroundColor: '#17141f',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  })
  console.log(__dirname)

  const devServerURL = createURLRoute(process.env.ELECTRON_RENDERER_URL, 'test')

  const fileRoute = createFileRoute(
    join(__dirname, '../renderer/index.html'),
    'test',
  )

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    newWin.loadURL(devServerURL)
  } else {
    newWin.loadFile(...fileRoute)
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  ipcMain.on('open-new-window', (event, arg) => {
    createNewWindow()
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
