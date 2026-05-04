"use client";

import { useState, useEffect } from "react";
import { CheckSquare, Plus, Search, X, Clock, User, AlertCircle, CheckCircle, Circle, Play } from "lucide-react";
import { tasksStore } from "@/lib/store";
import { Task } from "@/lib/types";

interface TaskFormData {
  title: string;
  description: string;
  assignedTo: string;
  priority: Task["priority"];
  status: Task["status"];
  dueDate: string;
  category: string;
}

const initialFormData: TaskFormData = {
  title: "",
  description: "",
  assignedTo: "",
  priority: "medium",
  status: "pending",
  dueDate: new Date().toISOString().split("T")[0],
  category: "General",
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<TaskFormData>(initialFormData);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setTasks(tasksStore.getAll());
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingTask) {
      tasksStore.update(editingTask.id, formData);
    } else {
      tasksStore.create(formData);
    }

    setShowModal(false);
    setEditingTask(null);
    setFormData(initialFormData);
    loadData();
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
      category: task.category,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      tasksStore.delete(id);
      loadData();
    }
  };

  const handleStatusChange = (id: string, status: Task["status"]) => {
    tasksStore.update(id, { status });
    loadData();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-error";
      case "medium":
        return "bg-orange-100 text-warning";
      case "low":
        return "bg-neutral-100 text-neutral";
      default:
        return "bg-neutral-100 text-neutral";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-tertiary" />;
      case "in-progress":
        return <Play className="w-5 h-5 text-primary" />;
      default:
        return <Circle className="w-5 h-5 text-neutral" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
          <p className="text-neutral mt-1">Manage staff tasks and follow-ups</p>
        </div>
        <button
          onClick={() => {
            setEditingTask(null);
            setFormData(initialFormData);
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          New Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral" />
          <input
            type="text"
            placeholder="Search tasks..."
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
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-4 py-3 bg-surface border border-border rounded-xl text-foreground outline-none focus:border-primary transition-colors"
        >
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className="text-2xl font-bold text-foreground">{tasks.filter((t) => t.status === "pending").length}</p>
          <p className="text-sm text-neutral">Pending</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className="text-2xl font-bold text-primary">{tasks.filter((t) => t.status === "in-progress").length}</p>
          <p className="text-sm text-neutral">In Progress</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className="text-2xl font-bold text-tertiary">{tasks.filter((t) => t.status === "completed").length}</p>
          <p className="text-sm text-neutral">Completed</p>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary-50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Task</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Assigned To</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Priority</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Due Date</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral">
                    <CheckSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-lg font-medium">No tasks found</p>
                    <p className="text-sm">Create a new task to get started</p>
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-primary-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          const newStatus = task.status === "completed" ? "pending" : "completed";
                          handleStatusChange(task.id, newStatus);
                        }}
                        className="p-2 hover:bg-primary-100 rounded-lg transition-colors"
                      >
                        {getStatusIcon(task.status)}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className={`font-medium ${task.status === "completed" ? "line-through text-neutral" : "text-foreground"}`}>
                          {task.title}
                        </p>
                        <p className="text-sm text-neutral">{task.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-neutral" />
                        <span className="text-sm text-neutral">{task.assignedTo}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-neutral" />
                        <span className="text-sm text-neutral">{task.dueDate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(task)}
                          className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="text-sm font-medium text-error hover:text-red-700 transition-colors"
                        >
                          Delete
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
                {editingTask ? "Edit Task" : "New Task"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingTask(null);
                }}
                className="p-2 hover:bg-primary-50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-neutral" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Assigned To</label>
                <input
                  type="text"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  required
                  placeholder="e.g., Dr. Sarah Mitchell, Nurse Johnson"
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-neutral outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task["priority"] })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground outline-none focus:border-primary transition-colors"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground outline-none focus:border-primary transition-colors"
                  >
                    <option value="General">General</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Admin">Admin</option>
                    <option value="Inventory">Inventory</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingTask(null);
                  }}
                  className="flex-1 px-6 py-3 bg-background text-foreground rounded-xl font-medium border border-border hover:bg-primary-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
                >
                  {editingTask ? "Update" : "Create"} Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
