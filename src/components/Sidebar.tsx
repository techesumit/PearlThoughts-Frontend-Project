"use client"

import { useAuth } from "@/context/AuthContext"
import Link from "next/link"
import { Calendar } from "lucide-react"

export default function Sidebar() {
  const { user } = useAuth()

  return (
    <div className="w-64 bg-gradient-to-b from-white/50 via-rose-50/30 to-amber-50/20 backdrop-blur border-r border-white/40 min-h-screen p-4 flex flex-col">
      <div className="mb-8 px-4">
        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-rose-700 to-amber-600 bg-clip-text text-transparent">Schedula</h1>
      </div>
      
      <nav className="flex-1 space-y-1">
        <Link 
          href="/dashboard" 
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 rounded-lg transition-all"
        >
          Dashboard
        </Link>
        <Link 
          href="/doctors" 
          className="flex items-center px-4 py-2 text-sm font-medium text-rose-700 hover:text-rose-800 hover:bg-white/40 rounded-lg transition-colors"
        >
          Doctors
        </Link>
        <Link 
          href="/appointments" 
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-rose-700 hover:text-rose-800 hover:bg-white/40 rounded-lg transition-colors"
        >
          <Calendar className="w-4 h-4" />
          Appointments
        </Link>
      </nav>
    </div>
  )
}
