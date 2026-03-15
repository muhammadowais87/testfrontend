import { create } from "zustand";
import { IndividualTeacher } from "@/data/teacherData";
import { API_BASE_URL } from "@/lib/api";
import { planAmounts } from "@/data/schoolData";

interface TeacherStore {
  teachers: IndividualTeacher[];
  isLoading: boolean;
  fetchTeachers: () => Promise<void>;
  addTeacher: (t: Omit<IndividualTeacher, "id" | "monthlyPayments">) => Promise<void>;
  updateTeacher: (id: number, data: Partial<Omit<IndividualTeacher, "id" | "monthlyPayments">>) => Promise<void>;
  deleteTeacher: (id: number) => Promise<void>;
  updateTeacherPlan: (id: number, plan: string) => Promise<void>;
  updateTeacherStatus: (id: number, status: string) => Promise<void>;
  toggleTeacherActive: (id: number, isActive: boolean) => Promise<void>;
  assignTeacherSubjects: (id: number, subjects: string[]) => Promise<void>;
  deletePayment: (teacherId: number, month: string) => Promise<void>;
}

export const useTeacherStore = create<TeacherStore>((set) => ({
  teachers: [],
  isLoading: false,
  fetchTeachers: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_BASE_URL}/teachers`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch teachers");
      }

      set({ teachers: Array.isArray(data?.teachers) ? data.teachers : [], isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
  addTeacher: async (teacher) => {
    const response = await fetch(`${API_BASE_URL}/teachers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(teacher),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || "Failed to add teacher");
    }

    if (data?.teacher) {
      set((state) => ({ teachers: [data.teacher, ...state.teachers] }));
      return;
    }

    await useTeacherStore.getState().fetchTeachers();
  },
  updateTeacher: async (id, payload) => {
    const response = await fetch(`${API_BASE_URL}/teachers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || "Failed to update teacher");
    }

    if (data?.teacher) {
      set((state) => ({
        teachers: state.teachers.map((t) => (t.id === id ? data.teacher : t)),
      }));
      return;
    }

    await useTeacherStore.getState().fetchTeachers();
  },
  deleteTeacher: async (id) => {
    const response = await fetch(`${API_BASE_URL}/teachers/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || "Failed to delete teacher");
    }

    set((state) => ({ teachers: state.teachers.filter((t) => t.id !== id) }));
  },
  updateTeacherPlan: async (id, plan) => {
    const amount = planAmounts[plan] || 5000;
    const response = await fetch(`${API_BASE_URL}/teachers/${id}/plan`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, amount }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || "Failed to update plan");
    }

    if (data?.teacher) {
      set((state) => ({
        teachers: state.teachers.map((t) => (t.id === id ? data.teacher : t)),
      }));
    }
  },
  updateTeacherStatus: async (id, status) => {
    const response = await fetch(`${API_BASE_URL}/teachers/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || "Failed to update status");
    }

    if (data?.teacher) {
      set((state) => ({
        teachers: state.teachers.map((t) => (t.id === id ? data.teacher : t)),
      }));
    }
  },
  toggleTeacherActive: async (id, isActive) => {
    const response = await fetch(`${API_BASE_URL}/teachers/${id}/active`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || "Failed to update account status");
    }

    if (data?.teacher) {
      set((state) => ({
        teachers: state.teachers.map((t) => (t.id === id ? data.teacher : t)),
      }));
    }
  },
  assignTeacherSubjects: async (id, subjects) => {
    const response = await fetch(`${API_BASE_URL}/teachers/${id}/subjects`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subjects }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || "Failed to assign subjects");
    }

    if (data?.teacher) {
      set((state) => ({
        teachers: state.teachers.map((t) => (t.id === id ? data.teacher : t)),
      }));
    }
  },
  deletePayment: async (teacherId, month) => {
    const response = await fetch(`${API_BASE_URL}/teachers/${teacherId}/payments/${encodeURIComponent(month)}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || "Failed to delete payment");
    }

    if (data?.teacher) {
      set((state) => ({
        teachers: state.teachers.map((t) => (t.id === teacherId ? data.teacher : t)),
      }));
    }
  },
}));
