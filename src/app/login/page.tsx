"use client"

import { useState } from "react"
import api from "@/lib/axios"
import { useAuth } from "@/context/AuthContext"
import Link from "next/link"
import { Mail, Lock } from "lucide-react"

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await api.get(
        `/users?email=${email}&password=${password}`
      )

      if (res.data.length > 0) {
        login(res.data[0])
      } else {
        setError("Invalid email or password.")
      }
    } catch (err: any) {
      console.error("Login Error:", err)
      if (err.code === "ERR_NETWORK") {
        setError("Cannot connect to server. Did you run 'npm run server' in a separate terminal?")
      } else {
        setError("An error occurred. Please try again later.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 via-rose-50 to-yellow-50 relative overflow-hidden">
      {/* Decorative background blur blobs - Gold/Rose theme */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-rose-300/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-amber-300/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-yellow-300/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md px-6 py-12">
        <div className="bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(120,65,65,0.1)] p-10 rounded-3xl transition-all duration-500 hover:shadow-[0_8px_40px_rgba(120,65,65,0.15)]">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent tracking-tight mb-2">
              PearlThoughts
            </h1>
            <p className="text-sm text-rose-700/70">
              Sign in to manage your appointments.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-rose-700 bg-rose-100/80 backdrop-blur border border-rose-200 rounded-xl text-center">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-rose-700 uppercase tracking-wider ml-1 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <input
                className="w-full bg-white/30 border border-white/50 text-rose-900 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-rose-400/50 focus:border-rose-300 transition-all placeholder:text-rose-400/60"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-rose-700 uppercase tracking-wider ml-1 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <input
                className="w-full bg-white/30 border border-white/50 text-rose-900 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-rose-400/50 focus:border-rose-300 transition-all placeholder:text-rose-400/60"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                disabled={loading}
                className="w-full flex tracking-wide items-center justify-center bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transform active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-rose-700/70">
            Don't have an account?{" "}
            <Link href="/signup" className="font-semibold text-rose-600 hover:text-rose-700 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}