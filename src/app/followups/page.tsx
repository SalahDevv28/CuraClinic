"use client";

import { useState, useEffect } from "react";
import { Phone, Plus, Search, X, Calendar, User, CheckCircle, AlertTriangle, Mail, MessageCircle } from "lucide-react";
import { followupsStore, patientsStore } from "@/lib/store";
import { FollowUp, Patient } from "@/lib/types";

interface FollowUpFormData {
  patientId: string;
  patientName: string;
  visitDate: string;
  followUpDate: string;
  reason: string;
  status: FollowUp["status"];
  notes: string;
  contactMethod: FollowUp["contactMethod"];
}

const initialFormData: FollowUpFormData = {
  patientId: "",
  patientName: "",
  visitDate: new Date().toISOString().split("T")[0],
  followUpDate: new Date().toISOString().split("T")[0],
  reason: "",
  status: "pending",
  notes: "",
  contactMethod: "phone",
};

export default function FollowUpsPage() {
  const [followups, setFollowups] = useState<FollowUp[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [editingFollowUp, setEditingFollowUp] = useState<FollowUp | null>(null);
  const [formData, setFormData] = useState<FollowUpFormData>(initialFormData);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setFollowups(followupsStore.getAll());
    setPatients(patientsStore.getAll());
  };

  const filteredFollowUps = followups.filter((followup) => {
    const matchesSearch =
      followup.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      followup.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || followup.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingFollowUp) {
      followupsStore.update(editingFollowUp.id, formData);
    } else {
      followupsStore.create(formData);
    }

    setShowModal(false);
    setEditingFollowUp(null);
    setFormData(initialFormData);
    loadData();
  };

  const handleEdit = (followup: FollowUp) => {
    setEditingFollowUp(followup);
    setFormData({
      patientId: followup.patientId,
      patientName: followup.patientName,
      visitDate: followup.visitDate,
      followUpDate: followup.followUpDate,
      reason: followup.reason,
      status: followup.status,
      notes: followup.notes,
      contactMethod: followup.contactMethod,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this follow-up?")) {
      followupsStore.delete(id);
      loadData();
    }
  };

  const handleStatusChange = (id: string, status: FollowUp["status"]) => {
    followupsStore.update(id, { status });
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-tertiary-100 text-tertiary";
      case "overdue":
        return "bg-red-100 text-error";
      default:
        return "bg-primary-100 text-primary";
    }
  };

  const getContactIcon = (method: string) => {
    switch (method) {
      case "email":
        return <Mail className="w-4 h-4" />;
      case "whatsapp":
        return <MessageCircle className="w-4 h-4" />;
      default:
        return <Phone className="w-4 h-4" />;
    }
  };

  const isOverdue = (date: string) => {
    return new Date(date) < new Date() && new Date(date).toDateString() !== new Date().toDateString();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Follow-ups</h1>
          <p className="text-neutral mt-1">Track patient follow-ups after visits</p>
        </div>
        <button
          onClick={() => {
            setEditingFollowUp(null);
            setFormData(initialFormData);
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          New Follow-up
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className="text-2xl font-bold text-primary">{followups.filter((f) => f.status === "pending").length}</p>
          <p className="text-sm text-neutral">Pending</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className="text-2xl font-bold text-error">
            {followups.filter((f) => f.status === "pending" && isOverdue(f.followUpDate)).length}
          </p>
          <p className="text-sm text-neutral">Overdue</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className="text-2xl font-bold text-tertiary">{followups.filter((f) => f.status === "completed").length}</p>
          <p className="text-sm text-neutral">Completed</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral" />
          <input
            type="text"
            placeholder="Search follow-ups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl text-foreground placeholder-neutral outline-none focus:border-primary transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-surface border border-border rounded-xl text-foreground outline-none focus:border-primary transition-colors"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {/* Follow-ups List */}
      <div className="space-y-4">
        {filteredFollowUps.length === 0 ? (
          <div className="bg-surface rounded-2xl border border-border p-12 text-center">
            <Phone className="w-12 h-12 mx-auto mb-3 text-neutral opacity-50" />
            <p className="text-lg font-medium text-neutral">No follow-ups found</p>
            <p className="text-sm text-neutral">Create a new follow-up to get started</p>
          </div>
        ) : (
          filteredFollowUps.map((followup) => (
            <div
              key={followup.id}
              className={`bg-surface rounded-2xl border border-border p-6 hover:shadow-lg transition-all duration-200 ${
                isOverdue(followup.followUpDate) && followup.status === "pending" ? "border-error/30 bg-red-50/30" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{followup.patientName}</h3>
                    <p className="text-sm text-neutral">{followup.reason}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-2 text-sm text-neutral">
                        <Calendar className="w-4 h-4" />
                        Visit: {followup.visitDate}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral">
                        <Phone className="w-4 h-4" />
                        Follow-up: {followup.followUpDate}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary text-sm">
                    {getContactIcon(followup.contactMethod)}
                    <span className="capitalize">{followup.contactMethod}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(followup.status)}`}>
                    {followup.status}
                  </span>
                </div>
              </div>

              {followup.notes && (
                <p className="text-sm text-neutral mt-4 ml-16 bg-primary-50 rounded-xl p-3">
                  {followup.notes}
                </p>
              )}

              {isOverdue(followup.followUpDate) && followup.status === "pending" && (
                <div className="mt-4 ml-16 flex items-center gap-2 text-error">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">This follow-up is overdue</span>
                </div>
              )}

              <div className="mt-4 ml-16 flex items-center gap-3">
                {followup.status === "pending" && (
                  <button
                    onClick={() => handleStatusChange(followup.id, "completed")}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-tertiary text-white rounded-xl text-sm font-medium hover:bg-tertiary-dark transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark Complete
                  </button>
                )}
                <button
                  onClick={() => handleEdit(followup)}
                  className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(followup.id)}
                  className="text-sm font-medium text-error hover:text-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">
                {editingFollowUp ? "Edit Follow-up" : "New Follow-up"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingFollowUp(null);
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
                  <label className="block text-sm font-medium text-foreground mb-2">Visit Date</label>
                  <input
                    type="date"
                    value={formData.visitDate}
                    onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Follow-up Date</label>
                  <input
                    type="date"
                    value={formData.followUpDate}
                    onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Reason</label>
                <input
                  type="text"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="e.g., Blood pressure check, Test results"
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-neutral outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Contact Method</label>
                <div className="grid grid-cols-3 gap-3">
                  {(["phone", "email", "whatsapp"] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setFormData({ ...formData, contactMethod: method })}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                        formData.contactMethod === method
                          ? "bg-primary text-white border-primary"
                          : "bg-background text-foreground border-border hover:bg-primary-50"
                      }`}
                    >
                      {getContactIcon(method)}
                      <span className="capitalize">{method}</span>
                    </button>
                  ))}
                </div>
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
                    setEditingFollowUp(null);
                  }}
                  className="flex-1 px-6 py-3 bg-background text-foreground rounded-xl font-medium border border-border hover:bg-primary-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
                >
                  {editingFollowUp ? "Update" : "Create"} Follow-up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
