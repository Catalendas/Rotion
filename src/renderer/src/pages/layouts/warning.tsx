import { Outlet } from 'react-router-dom'

export function Warning() {
  return (
    <main className="h-screen w-screen bg-rotion-900 text-rotion-100 flex">
      <Outlet />
    </main>
  )
}
