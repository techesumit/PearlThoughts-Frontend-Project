"use client"

import { useAuth } from "@/context/AuthContext"
import { LogOut } from "lucide-react"

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white/30 backdrop-blur border-b border-white/40 px-6 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold bg-gradient-to-r from-rose-700 to-amber-600 bg-clip-text text-transparent">
          Dashboard
        </h2>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-rose-100/60 text-rose-700 rounded-full flex items-center justify-center font-bold text-sm">
            {user?.name?.charAt(0) || "U"}
          </div>
          <span className="text-sm font-medium text-gray-700 hidden sm:block">
            {user?.name}
          </span>
        </div>
        
        <button 
          onClick={logout}
          className="p-2 text-rose-600 hover:bg-rose-100/30 rounded-full transition-colors flex items-center gap-2"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
          <span className="sr-only text-sm font-medium block sm:hidden">Logout</span>
        </button>
      </div>
    </header>
  )
}
