import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'

function DashboardLayout() {
  const [showSidebar, setShowSidebar] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

      {/* Layout below Navbar */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className={`w-[250px] ${showSidebar ? 'block' : 'hidden'} lg:block`}>
          <Sidebar setShowSidebar={setShowSidebar} />
        </div>

        {/* Main Content */}
        <div className={`flex-1 p-4 bg-[#FBFBFB] overflow-auto ${showSidebar ? 'hidden lg:block' : 'block'}`}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout