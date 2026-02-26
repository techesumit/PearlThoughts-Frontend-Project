"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/axios"
import Link from "next/link"

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    try {
      await api.post("/users", form)
      router.push("/login")
    } catch (err: any) {
      console.error("Signup error:", err)
      if (err.code === "ERR_NETWORK") {
        setError("Cannot connect to server. Did you run 'npm run server' in a separate terminal?")
      } else {
        setError(err.response?.data?.message || err.message || "Something went wrong. Please try again.")
      }
    } finally {
      setIsLoading(false)
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
              Create Account
            </h1>
            <p className="text-sm text-rose-700/70">
              Join us to manage your schedule effortlessly.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 text-sm text-rose-700 bg-rose-100/80 backdrop-blur border border-rose-200 rounded-xl text-center">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-rose-700 uppercase tracking-wider ml-1">
                Full Name
              </label>
              <input
                className="w-full bg-white/30 border border-white/50 text-rose-900 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-rose-400/50 focus:border-rose-300 transition-all placeholder:text-rose-400/60"
                placeholder="John Doe"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-rose-700 uppercase tracking-wider ml-1">
                Email Address
              </label>
              <input
                className="w-full bg-white/30 border border-white/50 text-rose-900 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-rose-400/50 focus:border-rose-300 transition-all placeholder:text-rose-400/60"
                type="email"
                placeholder="you@example.com"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-rose-700 uppercase tracking-wider ml-1">
                Password
              </label>
              <input
                className="w-full bg-white/30 border border-white/50 text-rose-900 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-rose-400/50 focus:border-rose-300 transition-all placeholder:text-rose-400/60"
                type="password"
                placeholder="••••••••"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-rose-700 uppercase tracking-wider ml-1">
                I am a
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none bg-white/30 border border-white/50 text-rose-900 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-rose-400/50 focus:border-rose-300 transition-all cursor-pointer"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-rose-600">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full flex tracking-wide items-center justify-center bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transform active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-rose-700/70">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-rose-600 hover:text-rose-700 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}