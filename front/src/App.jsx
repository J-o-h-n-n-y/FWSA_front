import { useState } from 'react'
import './App.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Switch from './pages/Switch'
import DiagramEditor from './components/DiagramEditor/DiagramEditor'
import TabComponet from './components/TabComponent'
import ApiTester from './pages/ApiTest'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='' element={<Dashboard/>}/>
          <Route path='test' element={<ApiTester/>}/>
          <Route path='switch' element={<Switch/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
