"use client";

import { useState, useEffect } from "react";
import { Calendar, Plus, Search, Filter, MoreVertical, Clock, User, Phone, Mail, X, ChevronLeft, ChevronRight } from "lucide-react";
import { appointmentsStore, patientsStore } from "@/lib/store";
import { Appointment, Patient } from "@/lib/types";

interface AppointmentFormData {
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  duration: number;
  type: string;
  status: Appointment["status"];
  notes: string;
}

const initialFormData: AppointmentFormData = {
  patientId: "",
  patientName: "",
  date: new Date().toISOString().split("T")[0],
  time: "09:00",
  duration: 30,
  type: "",
  status: "scheduled",
  notes: "",
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState<AppointmentFormData>(initialFormData);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setAppointments(appointmentsStore.getAll());
    setPatients(patientsStore.getAll());
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch = 
      appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter;
    const matchesDate = appointment.date === selectedDate;
    return matchesSearch && matchesStatus && matchesDate;
  }).sort((a, b) => a.time.localeCompare(b.time));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAppointment) {
      appointmentsStore.update(editingAppointment.id, formData);
    } else {
      appointmentsStore.create(formData);
    }
    
    setShowModal(false);
    setEditingAppointment(null);
    setFormData(initialFormData);
    loadData();
  };

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setFormData({
      patientId: appointment.patientId,
      patientName: appointment.patientName,
      date: appointment.date,
      time: appointment.time,
      duration: appointment.duration,
      type: appointment.type,
      status: appointment.status,
      notes: appointment.notes,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      appointmentsStore.delete(id);
      loadData();
    }
  };

  const handleStatusChange = (id: string, status: Appointment["status"]) => {
    appointmentsStore.update(id, { status });
    loadData();
  };

  const handlePatientSelect = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    if (patient) {
      setFormData({
        ...formData,
        patientId,
        patientName: `${patient.firstName} ${patient.lastName}`,
      });
    }
  };

  const navigateDate = (days: number) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    setSelectedDate(date.toISOString().split("T")[0]);
  };

  const statusColors = {
    scheduled: "bg-primary-100 text-primary",
    confirmed: "bg-tertiary-100 text-tertiary",
    completed: "bg-neutral-100 text-neutral",
    cancelled: "bg-gray-100 text-gray-500",
    urgent: "bg-red-100 text-error",
    "no-show": "bg-orange-100 text-warning",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Appointments</h1>
          <p className="text-neutral mt-1">Manage patient appointments and scheduling</p>
        </div>
        <button
          onClick={() => {
            setEditingAppointment(null);
            setFormData(initialFormData);
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          New Appointment
        </button>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center gap-4 bg-surface rounded-xl border border-border p-4">
        <button
          onClick={() => navigateDate(-1)}
          className="p-2 hover:bg-primary-50 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-neutral" />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <Calendar className="w-5 h-5 text-primary" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="flex-1 bg-transparent font-semibold text-foreground outline-none"
          />
        </div>
        <button
          onClick={() => navigateDate(1)}
          className="p-2 hover:bg-primary-50 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-neutral" />
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral" />
          <input
            type="text"
            placeholder="Search appointments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl text-foreground placeholder-neutral outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-neutral" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-surface border border-border rounded-xl text-foreground outline-none focus:border-primary transition-colors"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="confirmed">Confirmed</option>
            <option value="urgent">Urgent</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no-show">No-show</option>
          </select>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary-50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Time</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Patient</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Duration</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-lg font-medium">No appointments found</p>
                    <p className="text-sm">Create a new appointment to get started</p>
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-primary-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-neutral" />
                        <span className="font-medium text-foreground">{appointment.time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium text-foreground">{appointment.patientName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral">{appointment.type}</td>
                    <td className="px-6 py-4 text-sm text-neutral">{appointment.duration} min</td>
                    <td className="px-6 py-4">
                      <select
                        value={appointment.status}
                        onChange={(e) => handleStatusChange(appointment.id, e.target.value as Appointment["status"])}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border-0 outline-none cursor-pointer ${statusColors[appointment.status as keyof typeof statusColors] || statusColors.scheduled}`}
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="urgent">Urgent</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="no-show">No-show</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(appointment)}
                          className="p-2 hover:bg-primary-100 rounded-lg transition-colors text-neutral hover:text-primary"
                          title="Edit"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(appointment.id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors text-neutral hover:text-error"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">
                {editingAppointment ? "Edit Appointment" : "New Appointment"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingAppointment(null);
                }}
                className="p-2 hover:bg-primary-50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-neutral" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Patient</label>
                <select
                  value={formData.patientId}
                  onChange={(e) => handlePatientSelect(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground outline-none focus:border-primary transition-colors"
                >
                  <option value="">Select a patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Time</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Duration (minutes)</label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground outline-none focus:border-primary transition-colors"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Appointment["status"] })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground outline-none focus:border-primary transition-colors"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Appointment Type</label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  placeholder="e.g., Annual Physical, Follow-up"
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-neutral outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-neutral outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingAppointment(null);
                  }}
                  className="flex-1 px-6 py-3 bg-background text-foreground rounded-xl font-medium border border-border hover:bg-primary-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
                >
                  {editingAppointment ? "Update" : "Create"} Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
