import { Patient, Appointment, Task, FollowUp, Reminder, Visit } from "./types";

const STORAGE_KEYS = {
  patients: "curaclinic_patients",
  appointments: "curaclinic_appointments",
  tasks: "curaclinic_tasks",
  followups: "curaclinic_followups",
  reminders: "curaclinic_reminders",
};

// Generic CRUD operations
function getItems<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  const items = localStorage.getItem(key);
  return items ? JSON.parse(items) : [];
}

function setItems<T>(key: string, items: T[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(items));
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Initialize with sample data
export function initializeStore(): void {
  if (typeof window === "undefined") return;
  
  if (!localStorage.getItem(STORAGE_KEYS.patients)) {
    const samplePatients: Patient[] = [
      {
        id: generateId(),
        firstName: "John",
        lastName: "Davis",
        email: "john.davis@email.com",
        phone: "+1 555-0123",
        dateOfBirth: "1985-03-15",
        address: "123 Main St, Cityville",
        medicalHistory: "Hypertension, Allergic to penicillin",
        visitHistory: [
          {
            id: generateId(),
            date: "2024-01-15",
            reason: "Annual Physical",
            notes: "Blood pressure slightly elevated. Recommended lifestyle changes.",
            doctor: "Dr. Sarah Mitchell",
          },
        ],
        createdAt: "2024-01-10",
      },
      {
        id: generateId(),
        firstName: "Emma",
        lastName: "Wilson",
        email: "emma.wilson@email.com",
        phone: "+1 555-0124",
        dateOfBirth: "1990-07-22",
        address: "456 Oak Ave, Townsburg",
        medicalHistory: "Asthma",
        visitHistory: [
          {
            id: generateId(),
            date: "2024-02-20",
            reason: "Follow-up",
            notes: "Asthma well controlled. Continue current medication.",
            doctor: "Dr. Sarah Mitchell",
          },
        ],
        createdAt: "2024-02-15",
      },
      {
        id: generateId(),
        firstName: "Robert",
        lastName: "Thompson",
        email: "robert.t@email.com",
        phone: "+1 555-0125",
        dateOfBirth: "1978-11-08",
        address: "789 Pine Rd, Villageton",
        medicalHistory: "Type 2 Diabetes",
        visitHistory: [
          {
            id: generateId(),
            date: "2024-03-05",
            reason: "Diabetes Check",
            notes: "HbA1c levels improved. Continue metformin.",
            doctor: "Dr. Sarah Mitchell",
          },
        ],
        createdAt: "2024-03-01",
      },
      {
        id: generateId(),
        firstName: "Amy",
        lastName: "Liu",
        email: "amy.liu@email.com",
        phone: "+1 555-0126",
        dateOfBirth: "1995-01-30",
        address: "321 Elm St, Hamletville",
        medicalHistory: "None",
        visitHistory: [
          {
            id: generateId(),
            date: "2024-03-10",
            reason: "Blood Test Results",
            notes: "All results within normal range.",
            doctor: "Dr. Sarah Mitchell",
          },
        ],
        createdAt: "2024-03-08",
      },
    ];
    setItems(STORAGE_KEYS.patients, samplePatients);
  }

  if (!localStorage.getItem(STORAGE_KEYS.appointments)) {
    const today = new Date().toISOString().split("T")[0];
    const sampleAppointments: Appointment[] = [
      {
        id: generateId(),
        patientId: "",
        patientName: "John Davis",
        date: today,
        time: "09:00",
        duration: 30,
        type: "Annual Physical Examination",
        status: "confirmed",
        notes: "Regular checkup",
        reminderSent: true,
      },
      {
        id: generateId(),
        patientId: "",
        patientName: "Emma Wilson",
        date: today,
        time: "09:30",
        duration: 30,
        type: "Follow-up Consultation",
        status: "confirmed",
        notes: "Asthma follow-up",
        reminderSent: true,
      },
      {
        id: generateId(),
        patientId: "",
        patientName: "Robert Thompson",
        date: today,
        time: "10:15",
        duration: 45,
        type: "Chest Pain Evaluation",
        status: "urgent",
        notes: "Patient reported chest pain",
        reminderSent: false,
      },
      {
        id: generateId(),
        patientId: "",
        patientName: "Amy Liu",
        date: today,
        time: "11:00",
        duration: 30,
        type: "Blood Test Results",
        status: "scheduled",
        notes: "Review blood work",
        reminderSent: false,
      },
    ];
    setItems(STORAGE_KEYS.appointments, sampleAppointments);
  }

  if (!localStorage.getItem(STORAGE_KEYS.tasks)) {
    const today = new Date().toISOString().split("T")[0];
    const sampleTasks: Task[] = [
      {
        id: generateId(),
        title: "Follow up with lab results",
        description: "Call patients with blood test results from last week",
        assignedTo: "Dr. Sarah Mitchell",
        priority: "high",
        status: "pending",
        dueDate: today,
        category: "Follow-up",
        createdAt: "2024-03-15",
      },
      {
        id: generateId(),
        title: "Update patient records",
        description: "Complete documentation for yesterday's appointments",
        assignedTo: "Nurse Johnson",
        priority: "medium",
        status: "in-progress",
        dueDate: today,
        category: "Admin",
        createdAt: "2024-03-15",
      },
      {
        id: generateId(),
        title: "Order medical supplies",
        description: "Restock examination room supplies",
        assignedTo: "Admin Staff",
        priority: "low",
        status: "pending",
        dueDate: "2024-03-20",
        category: "Inventory",
        createdAt: "2024-03-14",
      },
    ];
    setItems(STORAGE_KEYS.tasks, sampleTasks);
  }

  if (!localStorage.getItem(STORAGE_KEYS.followups)) {
    const sampleFollowUps: FollowUp[] = [
      {
        id: generateId(),
        patientId: "",
        patientName: "John Davis",
        visitDate: "2024-03-01",
        followUpDate: "2024-03-15",
        reason: "Blood pressure check",
        status: "pending",
        notes: "Schedule follow-up for BP monitoring",
        contactMethod: "phone",
      },
      {
        id: generateId(),
        patientId: "",
        patientName: "Emma Wilson",
        visitDate: "2024-03-05",
        followUpDate: "2024-03-12",
        reason: "Asthma control assessment",
        status: "completed",
        notes: "Patient doing well, no changes needed",
        contactMethod: "email",
      },
    ];
    setItems(STORAGE_KEYS.followups, sampleFollowUps);
  }
}

// Patients
export const patientsStore = {
  getAll: (): Patient[] => getItems<Patient>(STORAGE_KEYS.patients),
  getById: (id: string): Patient | undefined => {
    const patients = getItems<Patient>(STORAGE_KEYS.patients);
    return patients.find((p) => p.id === id);
  },
  create: (patient: Omit<Patient, "id" | "createdAt" | "visitHistory">): Patient => {
    const patients = getItems<Patient>(STORAGE_KEYS.patients);
    const newPatient: Patient = {
      ...patient,
      id: generateId(),
      visitHistory: [],
      createdAt: new Date().toISOString().split("T")[0],
    };
    setItems(STORAGE_KEYS.patients, [...patients, newPatient]);
    return newPatient;
  },
  update: (id: string, updates: Partial<Patient>): void => {
    const patients = getItems<Patient>(STORAGE_KEYS.patients);
    const index = patients.findIndex((p) => p.id === id);
    if (index !== -1) {
      patients[index] = { ...patients[index], ...updates };
      setItems(STORAGE_KEYS.patients, patients);
    }
  },
  delete: (id: string): void => {
    const patients = getItems<Patient>(STORAGE_KEYS.patients);
    setItems(STORAGE_KEYS.patients, patients.filter((p) => p.id !== id));
  },
  addVisit: (patientId: string, visit: Omit<Visit, "id">): void => {
    const patients = getItems<Patient>(STORAGE_KEYS.patients);
    const patient = patients.find((p) => p.id === patientId);
    if (patient) {
      patient.visitHistory.push({ ...visit, id: generateId() });
      setItems(STORAGE_KEYS.patients, patients);
    }
  },
};

// Appointments
export const appointmentsStore = {
  getAll: (): Appointment[] => getItems<Appointment>(STORAGE_KEYS.appointments),
  getById: (id: string): Appointment | undefined => {
    const appointments = getItems<Appointment>(STORAGE_KEYS.appointments);
    return appointments.find((a) => a.id === id);
  },
  getByDate: (date: string): Appointment[] => {
    const appointments = getItems<Appointment>(STORAGE_KEYS.appointments);
    return appointments.filter((a) => a.date === date).sort((a, b) => a.time.localeCompare(b.time));
  },
  getToday: (): Appointment[] => {
    const today = new Date().toISOString().split("T")[0];
    return appointmentsStore.getByDate(today);
  },
  create: (appointment: Omit<Appointment, "id" | "reminderSent">): Appointment => {
    const appointments = getItems<Appointment>(STORAGE_KEYS.appointments);
    const newAppointment: Appointment = {
      ...appointment,
      id: generateId(),
      reminderSent: false,
    };
    setItems(STORAGE_KEYS.appointments, [...appointments, newAppointment]);
    return newAppointment;
  },
  update: (id: string, updates: Partial<Appointment>): void => {
    const appointments = getItems<Appointment>(STORAGE_KEYS.appointments);
    const index = appointments.findIndex((a) => a.id === id);
    if (index !== -1) {
      appointments[index] = { ...appointments[index], ...updates };
      setItems(STORAGE_KEYS.appointments, appointments);
    }
  },
  delete: (id: string): void => {
    const appointments = getItems<Appointment>(STORAGE_KEYS.appointments);
    setItems(STORAGE_KEYS.appointments, appointments.filter((a) => a.id !== id));
  },
};

// Tasks
export const tasksStore = {
  getAll: (): Task[] => getItems<Task>(STORAGE_KEYS.tasks),
  getById: (id: string): Task | undefined => {
    const tasks = getItems<Task>(STORAGE_KEYS.tasks);
    return tasks.find((t) => t.id === id);
  },
  create: (task: Omit<Task, "id" | "createdAt">): Task => {
    const tasks = getItems<Task>(STORAGE_KEYS.tasks);
    const newTask: Task = {
      ...task,
      id: generateId(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    setItems(STORAGE_KEYS.tasks, [...tasks, newTask]);
    return newTask;
  },
  update: (id: string, updates: Partial<Task>): void => {
    const tasks = getItems<Task>(STORAGE_KEYS.tasks);
    const index = tasks.findIndex((t) => t.id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates };
      setItems(STORAGE_KEYS.tasks, tasks);
    }
  },
  delete: (id: string): void => {
    const tasks = getItems<Task>(STORAGE_KEYS.tasks);
    setItems(STORAGE_KEYS.tasks, tasks.filter((t) => t.id !== id));
  },
};

// Follow-ups
export const followupsStore = {
  getAll: (): FollowUp[] => getItems<FollowUp>(STORAGE_KEYS.followups),
  getById: (id: string): FollowUp | undefined => {
    const followups = getItems<FollowUp>(STORAGE_KEYS.followups);
    return followups.find((f) => f.id === id);
  },
  create: (followup: Omit<FollowUp, "id">): FollowUp => {
    const followups = getItems<FollowUp>(STORAGE_KEYS.followups);
    const newFollowup: FollowUp = {
      ...followup,
      id: generateId(),
    };
    setItems(STORAGE_KEYS.followups, [...followups, newFollowup]);
    return newFollowup;
  },
  update: (id: string, updates: Partial<FollowUp>): void => {
    const followups = getItems<FollowUp>(STORAGE_KEYS.followups);
    const index = followups.findIndex((f) => f.id === id);
    if (index !== -1) {
      followups[index] = { ...followups[index], ...updates };
      setItems(STORAGE_KEYS.followups, followups);
    }
  },
  delete: (id: string): void => {
    const followups = getItems<FollowUp>(STORAGE_KEYS.followups);
    setItems(STORAGE_KEYS.followups, followups.filter((f) => f.id !== id));
  },
};

// Reminders
export const remindersStore = {
  getAll: (): Reminder[] => getItems<Reminder>(STORAGE_KEYS.reminders),
  create: (reminder: Omit<Reminder, "id">): Reminder => {
    const reminders = getItems<Reminder>(STORAGE_KEYS.reminders);
    const newReminder: Reminder = {
      ...reminder,
      id: generateId(),
    };
    setItems(STORAGE_KEYS.reminders, [...reminders, newReminder]);
    return newReminder;
  },
  update: (id: string, updates: Partial<Reminder>): void => {
    const reminders = getItems<Reminder>(STORAGE_KEYS.reminders);
    const index = reminders.findIndex((r) => r.id === id);
    if (index !== -1) {
      reminders[index] = { ...reminders[index], ...updates };
      setItems(STORAGE_KEYS.reminders, reminders);
    }
  },
  delete: (id: string): void => {
    const reminders = getItems<Reminder>(STORAGE_KEYS.reminders);
    setItems(STORAGE_KEYS.reminders, reminders.filter((r) => r.id !== id));
  },
};
