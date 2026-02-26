"use client"

import { useEffect, useMemo, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import Link from "next/link"
import { Stethoscope } from "lucide-react"
import api from "@/lib/axios"

type Doctor = {
  id: string
  name: string
  specialty: string
  experience: string
  rating?: number
  image?: string
  available?: boolean
}

export default function DoctorsPage() {
  const { user } = useAuth()
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [query, setQuery] = useState("")
  const [activeSpecialty, setActiveSpecialty] = useState<string>("All")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [bookingOpen, setBookingOpen] = useState<string | null>(null)
  const [bookingDate, setBookingDate] = useState("")
  const [bookingTime, setBookingTime] = useState("")
  const [bookingSubmitting, setBookingSubmitting] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const fetchDoctors = async () => {
      try {
        setLoading(true)
        const res = await api.get("/doctors")
        if (!mounted) return
        setDoctors(res.data ?? [])
      } catch (err) {
        setError("Failed to load doctors")
      } finally {
        setLoading(false)
      }
    }
    fetchDoctors()
    return () => { mounted = false }
  }, [])

  const specialties = useMemo(() => {
    const s = new Set<string>()
    doctors.forEach((d) => s.add(d.specialty))
    return ["All", ...Array.from(s)]
  }, [doctors])

  const filtered = useMemo(() => {
    return doctors.filter((d) => {
      const matchesQuery = (d.name + " " + d.specialty).toLowerCase().includes(query.toLowerCase())
      const matchesSpecialty = activeSpecialty === "All" ? true : d.specialty === activeSpecialty
      return matchesQuery && matchesSpecialty
    })
  }, [doctors, query, activeSpecialty])

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-rose-50/30 to-yellow-50/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-700 to-amber-600 bg-clip-text text-transparent">Doctors</h1>

        <div className="flex items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search doctor or specialty..."
            className="px-4 py-2 border border-white/50 bg-white/30 rounded-lg w-64 text-sm text-gray-900 placeholder-rose-700/50 focus:ring-2 focus:ring-rose-400/50 backdrop-blur"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6 overflow-x-auto">
        {specialties.map((s) => (
          <button
            key={s}
            onClick={() => setActiveSpecialty(s)}
            className={`whitespace-nowrap px-3 py-1 rounded-full text-sm font-medium transition-colors ${activeSpecialty === s ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white' : 'bg-white/30 text-rose-700 border border-white/40 hover:bg-white/40'}`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-rose-700/70">Loading doctors...</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((doc) => (
            <div key={doc.id} className="bg-white/40 backdrop-blur rounded-2xl shadow-sm border border-white/60 p-6 flex flex-col hover:shadow-md transition-all">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-rose-100/40 flex items-center justify-center text-rose-600">
                  <Stethoscope className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{doc.name}</h3>
                  <p className="text-sm text-rose-700/70 mt-1">{doc.specialty}</p>
                  <p className="text-sm text-rose-700/50">{doc.experience}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{doc.rating ?? '—'}</div>
                  <div className={`text-xs mt-1 inline-flex items-center px-2 py-0.5 rounded-full ${doc.available ? 'bg-green-100/60 text-green-700' : 'bg-rose-100/40 text-rose-700/60'}`}>
                    {doc.available ? 'Available' : 'Offline'}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <Link href={`/doctors/${doc.id}`} className="text-sm text-rose-600 font-medium hover:text-rose-700">
                  View profile
                </Link>
                <button
                  onClick={() => {
                    setBookingOpen((s) => (s === doc.id ? null : doc.id))
                    setBookingSuccess(null)
                    setBookingDate("")
                    setBookingTime("")
                  }}
                  className="px-3 py-1 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-md text-sm hover:from-rose-600 hover:to-amber-600 transition-all"
                >
                  Book
                </button>
              </div>
              {bookingOpen === doc.id && (
                <div className="mt-4 border-t border-white/40 pt-4">
                  <div className="flex items-center gap-2">
                    <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} className="px-3 py-2 border border-white/50 bg-white/30 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-rose-400/50 backdrop-blur" />
                    <input type="time" value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} className="px-3 py-2 border border-white/50 bg-white/30 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-rose-400/50 backdrop-blur" />
                    <button
                      disabled={bookingSubmitting}
                      onClick={async () => {
                        if (!user) { alert('Please log in to book'); return }
                        if (!bookingDate || !bookingTime) { alert('Select date and time'); return }
                        try {
                          setBookingSubmitting(true)
                          const payload = {
                            doctorId: doc.id,
                            doctorName: doc.name,
                            userId: user.id,
                            userName: user.name,
                            date: bookingDate,
                            time: bookingTime,
                            status: 'pending',
                            createdAt: new Date().toISOString()
                          }
                          await api.post('/appointments', payload)
                          setBookingSuccess('Requested')
                          setBookingOpen(null)
                        } catch (err) {
                          alert('Booking failed')
                        } finally {
                          setBookingSubmitting(false)
                        }
                      }}
                      className="px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-md text-sm hover:from-green-600 hover:to-emerald-600 disabled:opacity-50"
                    >
                      {bookingSubmitting ? 'Booking...' : 'Confirm'}
                    </button>
                    <button onClick={() => setBookingOpen(null)} className="px-3 py-2 border border-white/40 bg-white/20 rounded-md text-gray-900 hover:bg-white/30">Cancel</button>
                  </div>
                  {bookingSuccess && <div className="text-sm text-green-600 mt-2">{bookingSuccess}</div>}
                </div>
              )}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full text-center py-8 text-sm text-rose-700/60">No doctors found.</div>
          )}
        </div>
      )}
    </div>
  )
}