"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: number
  name: string
  email: string
  role: string
}

type AuthType = {
  user: User | null
  login: (data: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const login = (data: User) => {
    localStorage.setItem("user", JSON.stringify(data))
    setUser(data)
    router.push("/dashboard")
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("Must be inside AuthProvider")
  return context
}