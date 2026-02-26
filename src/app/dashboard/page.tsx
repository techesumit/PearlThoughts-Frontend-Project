"use client";

import { useAuth } from "@/context/AuthContext";
import { Activity, Calendar, Clock, Users } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import api from "@/lib/axios";

type Appointment = {
  id: number;
  doctorId: string;
  doctorName: string;
  userId: number;
  userName: string;
  date: string;
  time: string;
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    let mounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [aptsRes, docsRes] = await Promise.all([
          api.get(`/appointments?userId=${user.id}`),
          api.get("/doctors"),
        ]);
        if (!mounted) return;
        setAppointments(aptsRes.data ?? []);
        setDoctors(docsRes.data ?? []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => { mounted = false };
  }, [user]);

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let upcoming = 0;
    let completed = 0;
    let pending = 0;

    appointments.forEach((apt) => {
      const aptDate = new Date(apt.date);
      aptDate.setHours(0, 0, 0, 0);

      if (apt.status === "completed") {
        completed++;
      } else if (apt.status === "pending" && aptDate >= today) {
        upcoming++;
      } else if (apt.status === "pending") {
        pending++;
      }
    });

    return { upcoming, completed, pending };
  }, [appointments]);

  const recentAppointments = useMemo(() => {
    return [...appointments]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [appointments]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-rose-50/30 to-yellow-50/50">
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-700 to-amber-600 bg-clip-text text-transparent mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-rose-700/70">
            Here is an overview of your schedule and activities.
          </p>
        </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/40 backdrop-blur border border-white/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div className="bg-rose-100/40 p-3 rounded-xl text-rose-600">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="mt-2">
            <p className="text-sm font-medium text-rose-700/70">Upcoming</p>
            <p className="text-2xl font-bold text-rose-900">{stats.upcoming}</p>
          </div>
        </div>
        
        <div className="bg-white/40 backdrop-blur border border-white/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div className="bg-amber-100/40 p-3 rounded-xl text-amber-600">
            <Activity className="w-6 h-6" />
          </div>
          <div className="mt-2">
            <p className="text-sm font-medium text-amber-700/70">Completed</p>
            <p className="text-2xl font-bold text-amber-900">{stats.completed}</p>
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur border border-white/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div className="bg-yellow-100/40 p-3 rounded-xl text-yellow-600">
            <Clock className="w-6 h-6" />
          </div>
          <div className="mt-2">
            <p className="text-sm font-medium text-yellow-700/70">Pending</p>
            <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur border border-white/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div className="bg-rose-100/40 p-3 rounded-xl text-rose-600">
            <Users className="w-6 h-6" />
          </div>
          <div className="mt-2">
            <p className="text-sm font-medium text-rose-700/70">Total Doctors</p>
            <p className="text-2xl font-bold text-rose-900">{doctors.length}</p>
          </div>
        </div>
      </div>

      {/* Appointment History */}
      <div className="bg-white/40 backdrop-blur border border-white/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-white/40 bg-gradient-to-r from-rose-500/10 to-amber-500/10">
          <h2 className="font-bold text-lg bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">Recent Appointments</h2>
        </div>
        <div className="divide-y divide-white/40">
          {loading ? (
            <div className="px-6 py-4 text-center text-rose-700/70">Loading appointments...</div>
          ) : recentAppointments.length === 0 ? (
            <div className="px-6 py-4 text-center text-rose-700/70">No appointments yet</div>
          ) : (
            recentAppointments.map((apt) => (
              <div key={apt.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-rose-100/40 flex items-center justify-center text-rose-700 font-bold">
                    {apt.doctorName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{apt.doctorName}</p>
                    <p className="text-sm text-rose-700/70">{apt.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{new Date(apt.date).toLocaleDateString()}</p>
                  <p className="text-sm text-rose-700/70">{apt.time}</p>
                </div>
                <div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      apt.status === "completed"
                        ? "bg-green-100/60 text-green-700"
                        : apt.status === "pending"
                        ? "bg-yellow-100/60 text-yellow-700"
                        : "bg-red-100/60 text-red-700"
                    }`}
                  >
                    {apt.status === "pending" ? "Upcoming" : apt.status === "completed" ? "Completed" : "Cancelled"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
