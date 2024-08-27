import { QueryClientProvider } from '@tanstack/react-query'
import { Routes } from './Routes'
import './styles/globals.css'
import { queryClient } from './lib/react-query'

export function App() {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  return (
    <QueryClientProvider client={queryClient}>
      <Routes />
    </QueryClientProvider>
  )
}
