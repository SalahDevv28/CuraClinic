export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  medicalHistory: string;
  visitHistory: Visit[];
  createdAt: string;
}

export interface Visit {
  id: string;
  date: string;
  reason: string;
  notes: string;
  doctor: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  duration: number;
  type: string;
  visitType: "first-visit" | "check-up" | "follow-up" | "procedure" | "consultation";
  status: "scheduled" | "confirmed" | "completed" | "cancelled" | "no-show" | "urgent";
  notes: string;
  reminderSent: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
  dueDate: string;
  category: string;
  createdAt: string;
}

export interface FollowUp {
  id: string;
  patientId: string;
  patientName: string;
  visitDate: string;
  followUpDate: string;
  reason: string;
  status: "pending" | "completed" | "overdue";
  notes: string;
  contactMethod: "email" | "phone" | "whatsapp";
}

export interface Reminder {
  id: string;
  appointmentId: string;
  patientName: string;
  type: "email" | "whatsapp" | "sms";
  scheduledTime: string;
  status: "pending" | "sent" | "failed";
  message: string;
}
