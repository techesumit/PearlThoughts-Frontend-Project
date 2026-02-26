"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import api from "@/lib/axios"
import { Stethoscope } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

type Doctor = {
  id: string
  name: string
  specialty: string
  experience?: string
  degree?: string
  about?: string
  rating?: number
  image?: string
  available?: boolean
}

export default function DoctorProfileClient() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const fetchDoctor = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/doctors/${id}`)
        if (!mounted) return
        setDoctor(res.data)
      } catch (err) {
        setError("Doctor not found")
      } finally {
        setLoading(false)
      }
    }
    fetchDoctor()
    return () => { mounted = false }
  }, [id])

  const handleBook = async () => {
    if (!user) {
      alert("Please log in to book an appointment")
      return
    }
    if (!date || !time) {
      alert("Please select date and time")
      return
    }

    try {
      setSubmitting(true)
      const payload = {
        doctorId: doctor?.id,
        doctorName: doctor?.name,
        userId: user.id,
        userName: user.name,
        date,
        time,
        status: "pending",
        createdAt: new Date().toISOString()
      }
      await api.post('/appointments', payload)
      setSuccess('Appointment requested successfully')
    } catch (err) {
      alert('Failed to book appointment')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-rose-50/30 to-yellow-50/50 p-6 flex items-center justify-center"><p className="text-rose-700/70">Loading doctor...</p></div>
  if (error || !doctor) return <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-rose-50/30 to-yellow-50/50 p-6 flex items-center justify-center"><p className="text-red-600">{error ?? 'Doctor not found'}</p></div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-rose-50/30 to-yellow-50/50 p-6">
      <div className="bg-white/40 backdrop-blur rounded-2xl shadow-sm border border-white/60 p-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-start gap-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-rose-100/40 flex items-center justify-center text-rose-600 flex-shrink-0">
            <Stethoscope className="w-10 h-10" />
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-700 to-amber-600 bg-clip-text text-transparent">{doctor.name}</h1>
            <p className="text-lg text-rose-600 font-semibold mt-1">{doctor.specialty}</p>
            <p className="text-sm text-rose-700/70 mt-1">{doctor.degree}</p>
            <div className="flex items-center gap-4 mt-3">
              <div className="text-lg font-semibold text-gray-900">{doctor.rating ?? '—'} ⭐</div>
              <div className={`text-sm px-3 py-1 rounded-full ${doctor.available ? 'bg-green-100/60 text-green-700' : 'bg-rose-100/40 text-rose-700/60'}`}>
                {doctor.available ? '🟢 Available' : '🔴 Offline'}
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="mb-8 pb-8 border-b border-white/40">
          <h2 className="text-xl font-bold bg-gradient-to-r from-rose-700 to-amber-600 bg-clip-text text-transparent mb-3">About</h2>
          <p className="text-gray-700 leading-relaxed">{doctor.about}</p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white/30 backdrop-blur border border-white/40 p-4 rounded-lg">
            <p className="text-sm text-rose-700/70 font-medium">Experience</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">{doctor.experience}</p>
          </div>
          <div className="bg-white/30 backdrop-blur border border-white/40 p-4 rounded-lg">
            <p className="text-sm text-rose-700/70 font-medium">Specialty</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">{doctor.specialty}</p>
          </div>
        </div>

        {/* Booking Section */}
        <div className="border-t border-white/40 pt-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-rose-700 to-amber-600 bg-clip-text text-transparent mb-4">Book Appointment</h2>
          <div className="flex items-center gap-3">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="px-3 py-2 border border-white/50 bg-white/30 rounded-md text-gray-900 focus:ring-2 focus:ring-rose-400/50 backdrop-blur" />
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="px-3 py-2 border border-white/50 bg-white/30 rounded-md text-gray-900 focus:ring-2 focus:ring-rose-400/50 backdrop-blur" />
            <button onClick={handleBook} disabled={submitting} className="px-4 py-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-md disabled:opacity-60 font-medium hover:from-rose-600 hover:to-amber-600 transition-all">{submitting ? 'Booking...' : 'Book Appointment'}</button>
          </div>
          {success && <div className="mt-3 text-sm text-green-600 font-medium">{success}</div>}
        </div>

        {/* Back Button */}
        <div className="mt-6">
          <button onClick={() => router.back()} className="px-4 py-2 border border-white/40 bg-white/20 rounded-md text-gray-900 hover:bg-white/30">← Back</button>
        </div>
      </div>
    </div>
  )
}
