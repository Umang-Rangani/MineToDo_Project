import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Header from './components/Header'
import Todo from './components/Todo'
import Login from './pages/Login'
import Register from './pages/Register'

export default function App() {
  return (
    <BrowserRouter>
      <div className="max-w-7xl mx-auto">
        <Header />

        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/todo" element={<Todo />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}