import { BrowserWindow, Menu, Tray } from 'electron'
import path from 'node:path'

export function createTray(window: BrowserWindow) {
  const tray = new Tray(
    path.resolve(__dirname, '..', '..', './resources/rotionTemplate.png'),
  )

  const menu = Menu.buildFromTemplate([
    { label: 'Rotion', enabled: false },
    { type: 'separator' },
    {
      label: 'Criar novo documento',
      click: () => {
        window.webContents.send('new-document')
      },
    },
    { type: 'separator' },
    // { label: 'Documentos recentes', enabled: false },
    // { label: 'Discover', accelerator: 'CommandOrControl+1' },
    // { label: 'React', accelerator: 'CommandOrControl+2' },
    // { label: 'node.js', accelerator: 'CommandOrControl+3' },
    // { type: 'separator' },
    { label: 'Sair do Rotion', role: 'quit' },
  ])

  tray.setContextMenu(menu)
}
