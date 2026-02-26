"use client"

import { useEffect, useState, useMemo } from "react"
import { useAuth } from "@/context/AuthContext"
import api from "@/lib/axios"
import { Calendar, Clock, User, CheckCircle, XCircle, Clock6 } from "lucide-react"

type Appointment = {
  id: number
  doctorId: string
  doctorName: string
  userId: number
  userName: string
  date: string
  time: string
  status: "pending" | "completed" | "cancelled"
  createdAt: string
}

type TabType = "upcoming" | "completed" | "cancelled"

export default function AppointmentsPage() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>("upcoming")

  useEffect(() => {
    if (!user) return

    let mounted = true
    const fetchAppointments = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/appointments?userId=${user.id}`)
        if (!mounted) return
        setAppointments(res.data ?? [])
      } catch (err) {
        console.error("Error fetching appointments:", err)
        setError("Failed to load appointments")
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
    return () => { mounted = false }
  }, [user])

  const filtered = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return appointments.filter((apt) => {
      const aptDate = new Date(apt.date)
      aptDate.setHours(0, 0, 0, 0)

      if (activeTab === "upcoming") {
        return apt.status === "pending" && aptDate >= today
      } else if (activeTab === "completed") {
        return apt.status === "completed"
      } else if (activeTab === "cancelled") {
        return apt.status === "cancelled"
      }
      return false
    })
  }, [appointments, activeTab])

  if (!user) {
    return <div className="p-6 text-center text-gray-600">Please log in to view appointments</div>
  }

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading appointments...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-rose-50/30 to-yellow-50/50 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-700 to-amber-600 bg-clip-text text-transparent mb-2">My Appointments</h1>
        <p className="text-rose-700/70">Manage and review your appointments</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-white/40">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === "upcoming"
              ? "border-rose-500 text-rose-600"
              : "border-transparent text-rose-700/60 hover:text-rose-700"
          }`}
        >
          <div className="flex items-center gap-2">
            <Clock6 className="w-4 h-4" />
            Upcoming
          </div>
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === "completed"
              ? "border-green-500 text-green-600"
              : "border-transparent text-rose-700/60 hover:text-rose-700"
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Completed
          </div>
        </button>
        <button
          onClick={() => setActiveTab("cancelled")}
          className={`px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === "cancelled"
              ? "border-red-500 text-red-600"
              : "border-transparent text-rose-700/60 hover:text-rose-700"
          }`}
        >
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            Cancelled
          </div>
        </button>
      </div>

      {error && (
        <div className="p-4 mb-6 text-red-700 bg-red-100/40 border border-red-200/40 rounded-lg backdrop-blur">
          {error}
        </div>
      )}

      {/* Appointments List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-rose-700/60 mb-2">
              {activeTab === "upcoming" && "No upcoming appointments"}
              {activeTab === "completed" && "No completed appointments"}
              {activeTab === "cancelled" && "No cancelled appointments"}
            </div>
          </div>
        ) : (
          filtered.map((apt) => (
            <div key={apt.id} className="bg-white/40 backdrop-blur border border-white/60 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Dr. {apt.doctorName}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-rose-700/70">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(apt.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {apt.time}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      activeTab === "upcoming"
                        ? "bg-yellow-100/60 text-yellow-700"
                        : activeTab === "completed"
                        ? "bg-green-100/60 text-green-700"
                        : "bg-red-100/60 text-red-700"
                    }`}
                  >
                    {apt.status === "pending" ? "Pending" : apt.status === "completed" ? "Completed" : "Cancelled"}
                  </span>
                </div>
              </div>

              <div className="border-t border-white/40 pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-rose-700/60">Booked on</p>
                    <p className="text-gray-900 font-medium">
                      {new Date(apt.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-rose-700/60">Status</p>
                    <p className="text-gray-900 font-medium capitalize">{apt.status}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/40">
                <button className="px-4 py-2 text-sm font-medium text-rose-600 border border-rose-200/60 rounded-lg hover:bg-rose-100/30 transition-colors backdrop-blur">
                  View Details
                </button>
                {activeTab === "upcoming" && (
                  <button className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200/60 rounded-lg hover:bg-red-100/30 transition-colors backdrop-blur">
                    Cancel Appointment
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
