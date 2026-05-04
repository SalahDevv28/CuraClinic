"use client";

import { useState, useEffect } from "react";
import { Bell, Plus, Send, X, Mail, MessageCircle, Phone, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { remindersStore, appointmentsStore } from "@/lib/store";
import { Reminder, Appointment } from "@/lib/types";

interface ReminderFormData {
  appointmentId: string;
  patientName: string;
  type: "email" | "whatsapp" | "sms";
  scheduledTime: string;
  message: string;
}

const initialFormData: ReminderFormData = {
  appointmentId: "",
  patientName: "",
  type: "email",
  scheduledTime: "",
  message: "",
};

const reminderTemplates = {
  email: `Dear {patientName},

This is a friendly reminder of your upcoming appointment at CuraClinic.

Date: {date}
Time: {time}
Type: {type}

Please arrive 10 minutes before your scheduled time.

Best regards,
CuraClinic Team`,
  whatsapp: `Hi {patientName}! 👋\n\nReminder: You have an appointment at CuraClinic on {date} at {time}.\n\nType: {type}\n\nSee you soon!`,
  sms: `CuraClinic: Hi {patientName}, reminder for your appointment on {date} at {time}. Type: {type}. Reply CONFIRM to confirm.`,
};

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<ReminderFormData>(initialFormData);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setReminders(remindersStore.getAll());
    // Get upcoming appointments (today and future)
    const allAppointments = appointmentsStore.getAll();
    const today = new Date().toISOString().split("T")[0];
    setAppointments(allAppointments.filter((a) => a.date >= today && a.status !== "cancelled"));
  };

  const handleAppointmentSelect = (appointmentId: string) => {
    const appointment = appointments.find((a) => a.id === appointmentId);
    if (appointment) {
      setSelectedAppointment(appointment);
      setFormData({
        ...formData,
        appointmentId,
        patientName: appointment.patientName,
        message: generateMessage(appointment, formData.type),
      });
    }
  };

  const handleTypeChange = (type: "email" | "whatsapp" | "sms") => {
    setFormData({
      ...formData,
      type,
      message: selectedAppointment ? generateMessage(selectedAppointment, type) : "",
    });
  };

  const generateMessage = (appointment: Appointment, type: "email" | "whatsapp" | "sms") => {
    return reminderTemplates[type]
      .replace("{patientName}", appointment.patientName)
      .replace("{date}", appointment.date)
      .replace("{time}", appointment.time)
      .replace("{type}", appointment.type);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    remindersStore.create({
      ...formData,
      status: "pending",
    });

    // Mark appointment reminder as sent
    if (selectedAppointment) {
      appointmentsStore.update(selectedAppointment.id, { reminderSent: true });
    }

    setShowModal(false);
    setFormData(initialFormData);
    setSelectedAppointment(null);
    loadData();
  };

  const handleSendReminder = (id: string) => {
    remindersStore.update(id, { status: "sent" });
    loadData();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="w-5 h-5" />;
      case "whatsapp":
        return <MessageCircle className="w-5 h-5" />;
      case "sms":
        return <Phone className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "email":
        return "bg-blue-100 text-blue-600";
      case "whatsapp":
        return "bg-green-100 text-green-600";
      case "sms":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-primary-100 text-primary";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-tertiary-100 text-tertiary";
      case "failed":
        return "bg-red-100 text-error";
      default:
        return "bg-primary-100 text-primary";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reminders</h1>
          <p className="text-neutral mt-1">Schedule and send appointment reminders</p>
        </div>
        <button
          onClick={() => {
            setFormData(initialFormData);
            setSelectedAppointment(null);
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          Schedule Reminder
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className="text-2xl font-bold text-primary">{reminders.filter((r) => r.status === "pending").length}</p>
          <p className="text-sm text-neutral">Pending</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className="text-2xl font-bold text-tertiary">{reminders.filter((r) => r.status === "sent").length}</p>
          <p className="text-sm text-neutral">Sent</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className="text-2xl font-bold text-error">{reminders.filter((r) => r.status === "failed").length}</p>
          <p className="text-sm text-neutral">Failed</p>
        </div>
      </div>

      {/* Reminders List */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary-50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Patient</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Scheduled</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reminders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral">
                    <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-lg font-medium">No reminders scheduled</p>
                    <p className="text-sm">Create a reminder to notify patients about their appointments</p>
                  </td>
                </tr>
              ) : (
                reminders.map((reminder) => (
                  <tr key={reminder.id} className="hover:bg-primary-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(reminder.type)}`}>
                        {getTypeIcon(reminder.type)}
                        <span className="capitalize">{reminder.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{reminder.patientName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-neutral" />
                        <span className="text-sm text-neutral">{reminder.scheduledTime}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(reminder.status)}`}>
                        {reminder.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {reminder.status === "pending" && (
                          <button
                            onClick={() => handleSendReminder(reminder.id)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors"
                          >
                            <Send className="w-4 h-4" />
                            Send Now
                          </button>
                        )}
                        {reminder.status === "sent" && (
                          <div className="flex items-center gap-1 text-tertiary">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm">Sent</span>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Appointments Needing Reminders */}
      <div className="bg-surface rounded-2xl border border-border p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Upcoming Appointments</h2>
        <div className="space-y-3">
          {appointments.filter((a) => !a.reminderSent).length === 0 ? (
            <p className="text-sm text-neutral text-center py-4">All appointments have reminders sent</p>
          ) : (
            appointments
              .filter((a) => !a.reminderSent)
              .slice(0, 5)
              .map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 bg-primary-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">{appointment.patientName}</p>
                      <p className="text-sm text-neutral">{appointment.date} at {appointment.time} • {appointment.type}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setFormData(initialFormData);
                      setSelectedAppointment(null);
                      setShowModal(true);
                      // Pre-select this appointment
                      setTimeout(() => handleAppointmentSelect(appointment.id), 0);
                    }}
                    className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors"
                  >
                    Send Reminder
                  </button>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Schedule Reminder</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedAppointment(null);
                }}
                className="p-2 hover:bg-primary-50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-neutral" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Appointment</label>
                <select
                  value={formData.appointmentId}
                  onChange={(e) => handleAppointmentSelect(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground outline-none focus:border-primary transition-colors"
                >
                  <option value="">Select an appointment</option>
                  {appointments.map((appointment) => (
                    <option key={appointment.id} value={appointment.id}>
                      {appointment.patientName} - {appointment.date} {appointment.time}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Reminder Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {(["email", "whatsapp", "sms"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleTypeChange(type)}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                        formData.type === type
                          ? "bg-primary text-white border-primary"
                          : "bg-background text-foreground border-border hover:bg-primary-50"
                      }`}
                    >
                      {getTypeIcon(type)}
                      <span className="capitalize">{type}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Schedule Time</label>
                <input
                  type="datetime-local"
                  value={formData.scheduledTime}
                  onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-neutral outline-none focus:border-primary transition-colors resize-none font-mono text-sm"
                />
                <p className="text-xs text-neutral mt-2">
                  Use {"{patientName}"}, {"{date}"}, {"{time}"}, {"{type}"} as placeholders
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedAppointment(null);
                  }}
                  className="flex-1 px-6 py-3 bg-background text-foreground rounded-xl font-medium border border-border hover:bg-primary-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
                >
                  Schedule Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
