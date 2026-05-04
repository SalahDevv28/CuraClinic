"use client";

import { useState, useEffect } from "react";
import { Users, Plus, Search, X, Phone, Mail, Calendar, MapPin, FileText, ChevronRight, Clock } from "lucide-react";
import { patientsStore } from "@/lib/store";
import { Patient, Visit } from "@/lib/types";

interface PatientFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  medicalHistory: string;
}

const initialFormData: PatientFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  address: "",
  medicalHistory: "",
};

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState<PatientFormData>(initialFormData);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setPatients(patientsStore.getAll());
  };

  const filteredPatients = patients.filter((patient) => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.includes(searchQuery);
    return matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingPatient) {
      patientsStore.update(editingPatient.id, formData);
    } else {
      patientsStore.create(formData);
    }

    setShowModal(false);
    setEditingPatient(null);
    setFormData(initialFormData);
    loadData();
  };

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setFormData({
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      phone: patient.phone,
      dateOfBirth: patient.dateOfBirth,
      address: patient.address,
      medicalHistory: patient.medicalHistory,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this patient?")) {
      patientsStore.delete(id);
      loadData();
    }
  };

  const handleViewDetails = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowDetails(true);
  };

  const handleAddVisit = (patientId: string) => {
    const date = prompt("Enter visit date (YYYY-MM-DD):");
    if (!date) return;

    const reason = prompt("Enter visit reason:");
    if (!reason) return;

    const notes = prompt("Enter visit notes:") || "";

    patientsStore.addVisit(patientId, {
      date,
      reason,
      notes,
      doctor: "Dr. Sarah Mitchell",
    });

    loadData();
    if (selectedPatient?.id === patientId) {
      setSelectedPatient(patientsStore.getById(patientId) || null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Patients</h1>
          <p className="text-neutral mt-1">Manage patient records and visit history</p>
        </div>
        <button
          onClick={() => {
            setEditingPatient(null);
            setFormData(initialFormData);
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          New Patient
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral" />
        <input
          type="text"
          placeholder="Search patients by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl text-foreground placeholder-neutral outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-surface rounded-2xl border border-border">
            <Users className="w-12 h-12 mx-auto mb-3 text-neutral opacity-50" />
            <p className="text-lg font-medium text-neutral">No patients found</p>
            <p className="text-sm text-neutral">Create a new patient to get started</p>
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className="bg-surface rounded-2xl border border-border p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
              onClick={() => handleViewDetails(patient)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-primary font-bold text-lg">
                  {patient.firstName[0]}{patient.lastName[0]}
                </div>
                <ChevronRight className="w-5 h-5 text-neutral opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <h3 className="text-lg font-bold text-foreground mb-1">
                {patient.firstName} {patient.lastName}
              </h3>

              <div className="space-y-2 mt-4">
                <div className="flex items-center gap-2 text-sm text-neutral">
                  <Phone className="w-4 h-4" />
                  {patient.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{patient.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral">
                  <Calendar className="w-4 h-4" />
                  {patient.dateOfBirth}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs text-neutral">
                  {patient.visitHistory.length} visits
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(patient);
                    }}
                    className="text-xs font-medium text-primary hover:text-primary-dark transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(patient.id);
                    }}
                    className="text-xs font-medium text-error hover:text-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Patient Details Modal */}
      {showDetails && selectedPatient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center text-primary font-bold text-xl">
                  {selectedPatient.firstName[0]}{selectedPatient.lastName[0]}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {selectedPatient.firstName} {selectedPatient.lastName}
                  </h2>
                  <p className="text-sm text-neutral">Patient ID: {selectedPatient.id.slice(0, 8)}</p>
                </div>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 hover:bg-primary-50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-neutral" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-neutral">Phone</p>
                    <p className="text-sm font-medium text-foreground">{selectedPatient.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-neutral">Email</p>
                    <p className="text-sm font-medium text-foreground">{selectedPatient.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-neutral">Date of Birth</p>
                    <p className="text-sm font-medium text-foreground">{selectedPatient.dateOfBirth}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-neutral">Address</p>
                    <p className="text-sm font-medium text-foreground">{selectedPatient.address}</p>
                  </div>
                </div>
              </div>

              {/* Medical History */}
              <div className="bg-primary-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Medical History</h3>
                </div>
                <p className="text-sm text-neutral">{selectedPatient.medicalHistory || "No medical history recorded"}</p>
              </div>

              {/* Visit History */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Visit History</h3>
                  <button
                    onClick={() => handleAddVisit(selectedPatient.id)}
                    className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                  >
                    + Add Visit
                  </button>
                </div>

                <div className="space-y-3">
                  {selectedPatient.visitHistory.length === 0 ? (
                    <p className="text-sm text-neutral text-center py-4">No visits recorded</p>
                  ) : (
                    selectedPatient.visitHistory.map((visit) => (
                      <div key={visit.id} className="bg-surface border border-border rounded-xl p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-primary" />
                            <div>
                              <p className="font-medium text-foreground">{visit.reason}</p>
                              <p className="text-xs text-neutral">{visit.date} • {visit.doctor}</p>
                            </div>
                          </div>
                        </div>
                        {visit.notes && (
                          <p className="text-sm text-neutral mt-2 ml-8">{visit.notes}</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New/Edit Patient Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">
                {editingPatient ? "Edit Patient" : "New Patient"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingPatient(null);
                }}
                className="p-2 hover:bg-primary-50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-neutral" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Medical History</label>
                <textarea
                  value={formData.medicalHistory}
                  onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-neutral outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingPatient(null);
                  }}
                  className="flex-1 px-6 py-3 bg-background text-foreground rounded-xl font-medium border border-border hover:bg-primary-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
                >
                  {editingPatient ? "Update" : "Create"} Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
