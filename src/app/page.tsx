"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Calendar, 
  CheckSquare, 
  Plus, 
  AlertCircle,
  Phone,
  Sparkles,
  RotateCcw,
  Stethoscope,
  ClipboardCheck
} from "lucide-react";
import { appointmentsStore, tasksStore, followupsStore } from "@/lib/store";
import { Appointment, Task, FollowUp } from "@/lib/types";

function AppointmentItem({ appointment }: { appointment: Appointment }) {
  const statusColors = {
    scheduled: "bg-primary-100 text-primary",
    confirmed: "bg-tertiary-100 text-tertiary",
    completed: "bg-neutral-100 text-neutral",
    cancelled: "bg-gray-100 text-gray-500",
    urgent: "bg-red-100 text-error",
    "no-show": "bg-orange-100 text-warning",
  };

  const visitTypeConfig = {
    "first-visit": { label: "First Visit", icon: Sparkles, color: "bg-blue-100 text-blue-600" },
    "check-up": { label: "Check-up", icon: ClipboardCheck, color: "bg-teal-100 text-teal-600" },
    "follow-up": { label: "Follow-up", icon: RotateCcw, color: "bg-indigo-100 text-indigo-600" },
    "procedure": { label: "Procedure", icon: Stethoscope, color: "bg-amber-100 text-amber-600" },
    "consultation": { label: "Consultation", icon: Phone, color: "bg-rose-100 text-rose-600" },
  };

  const visitType = visitTypeConfig[appointment.visitType] || visitTypeConfig["check-up"];

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-primary-50 transition-colors">
      <div className="text-center min-w-[60px]">
        <p className="text-lg font-bold text-foreground">{appointment.time}</p>
        <p className="text-xs text-neutral">{appointment.duration}min</p>
      </div>
      <div className="w-px h-10 bg-border" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground truncate">{appointment.patientName}</p>
        <p className="text-sm text-neutral truncate">{appointment.type}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${visitType.color}`}>
          <visitType.icon className="w-3 h-3" />
          {visitType.label}
        </span>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[appointment.status as keyof typeof statusColors] || statusColors.scheduled}`}>
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
        </span>
      </div>
    </div>
  );
}

function TaskItem({ task }: { task: Task }) {
  const priorityColors = {
    low: "text-neutral",
    medium: "text-warning",
    high: "text-error",
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary-50 transition-colors">
      <div className={`w-2 h-2 rounded-full ${
        task.priority === "high" ? "bg-error" : 
        task.priority === "medium" ? "bg-warning" : "bg-neutral"
      }`} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${task.status === "completed" ? "line-through text-neutral" : "text-foreground"}`}>
          {task.title}
        </p>
        <p className="text-xs text-neutral truncate">{task.assignedTo}</p>
      </div>
      <span className={`text-xs font-medium ${priorityColors[task.priority]}`}>
        {task.priority}
      </span>
    </div>
  );
}

export default function Dashboard() {
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);

  useEffect(() => {
    const appointments = appointmentsStore.getToday();
    const tasks = tasksStore.getAll();
    const followups = followupsStore.getAll();

    setTodayAppointments(appointments);
    setPendingTasks(tasks.filter((t) => t.status !== "completed").slice(0, 5));
    setFollowUps(followups.filter((f) => f.status === "pending").slice(0, 3));
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-neutral mt-1">{today}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-surface rounded-xl border border-border">
          <div className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
          <span className="text-sm font-medium text-foreground">Clinic Open</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Link
          href="/appointments"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          New Appointment
        </Link>
        <Link
          href="/patients"
          className="inline-flex items-center gap-2 px-6 py-3 bg-surface text-foreground rounded-xl font-medium border border-border hover:bg-primary-50 transition-colors"
        >
          Add Patient
        </Link>
        <Link
          href="/tasks"
          className="inline-flex items-center gap-2 px-6 py-3 bg-surface text-foreground rounded-xl font-medium border border-border hover:bg-primary-50 transition-colors"
        >
          Create Task
        </Link>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Appointments */}
        <div className="lg:col-span-2 bg-surface rounded-2xl border border-border overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">Today's Appointments</h2>
              <p className="text-sm text-neutral">{todayAppointments.length} appointments scheduled</p>
            </div>
            <Link href="/appointments" className="text-sm font-medium text-primary hover:text-primary-dark transition-colors">
              View All
            </Link>
          </div>
          <div className="p-4 space-y-2">
            {todayAppointments.length === 0 ? (
              <div className="text-center py-8 text-neutral">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No appointments today</p>
              </div>
            ) : (
              todayAppointments.map((appointment) => (
                <AppointmentItem key={appointment.id} appointment={appointment} />
              ))
            )}
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Tasks */}
          <div className="bg-surface rounded-2xl border border-border overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Pending Tasks</h2>
              <Link href="/tasks" className="text-sm font-medium text-primary hover:text-primary-dark transition-colors">
                View All
              </Link>
            </div>
            <div className="p-4 space-y-2">
              {pendingTasks.length === 0 ? (
                <div className="text-center py-6 text-neutral">
                  <CheckSquare className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No pending tasks</p>
                </div>
              ) : (
                pendingTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))
              )}
            </div>
          </div>

          {/* Follow-ups */}
          <div className="bg-surface rounded-2xl border border-border overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Follow-ups</h2>
              <Link href="/followups" className="text-sm font-medium text-primary hover:text-primary-dark transition-colors">
                View All
              </Link>
            </div>
            <div className="p-4 space-y-3">
              {followUps.length === 0 ? (
                <div className="text-center py-6 text-neutral">
                  <Phone className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No pending follow-ups</p>
                </div>
              ) : (
                followUps.map((followUp) => (
                  <div key={followUp.id} className="flex items-center gap-3 p-3 rounded-xl bg-primary-50">
                    <AlertCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{followUp.patientName}</p>
                      <p className="text-xs text-neutral">{followUp.reason}</p>
                    </div>
                    <span className="text-xs text-primary font-medium">{followUp.followUpDate}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
