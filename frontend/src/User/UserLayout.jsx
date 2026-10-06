import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'

import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

export default function UserLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev)
  }

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#F7F0E7] text-[#3B2A20]">
      <Header onMenuClick={() => setMobileSidebarOpen(true)} />

      <Sidebar open={sidebarOpen} mobileOpen={mobileSidebarOpen} onToggle={toggleSidebar} onClose={closeMobileSidebar} />

      <main className={`min-h-screen pt-17 transition-all duration-300 ${sidebarOpen ? 'lg:pl-64' : 'lg:pl-20'}`}>
        <div className="min-h-[calc(100vh-68px)] px-3 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
