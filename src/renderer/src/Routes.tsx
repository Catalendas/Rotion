import { Router, Route } from 'electron-router-dom'
import { Blank } from './pages/blank'
import { Test } from './pages/test'
import { Document } from './pages/document'
import { Default } from './pages/layouts/default'
import { Warning } from './pages/layouts/warning'

export function Routes() {
  return (
    <Router
      main={
        <Route path="/" element={<Default />}>
          <Route path="/" element={<Blank />} />
          <Route path="/documents/:id" element={<Document />} />
        </Route>
      }
      test={
        <Route path="/" element={<Warning />}>
          <Route path="/" element={<Test />} />
        </Route>
      }
    />
  )
}
