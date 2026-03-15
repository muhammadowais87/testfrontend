import { create } from "zustand";
import { SchoolData, planAmounts } from "@/data/schoolData";
import { API_BASE_URL } from "@/lib/api";

interface SchoolStore {
  schools: SchoolData[];
  isLoading: boolean;
  fetchSchools: () => Promise<void>;
  deleteSchool: (id: number) => Promise<void>;
  addSchool: (school: Omit<SchoolData, "id" | "monthlyPayments"> & { email: string; password?: string }) => Promise<void>;
  updateSchool: (id: number, data: Partial<Omit<SchoolData, "id" | "monthlyPayments">> & { email?: string; password?: string }) => Promise<void>;
  updateSchoolPlan: (id: number, plan: string) => Promise<void>;
  updateSchoolStatus: (id: number, status: string) => Promise<void>;
  deletePayment: (schoolId: number, month: string) => Promise<void>;
}

export const useSchoolStore = create<SchoolStore>((set) => ({
  schools: [],
  isLoading: false,
  fetchSchools: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_BASE_URL}/schools`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch schools");
      }

      set({ schools: Array.isArray(data?.schools) ? data.schools : [], isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
  deleteSchool: async (id) => {
    const response = await fetch(`${API_BASE_URL}/schools/${id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || "Failed to delete school");
    }

    set((state) => ({ schools: state.schools.filter((s) => s.id !== id) }));
  },
  addSchool: async (school) => {
    const response = await fetch(`${API_BASE_URL}/schools`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(school),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || "Failed to add school");
    }

    if (data?.school) {
      set((state) => ({ schools: [data.school, ...state.schools] }));
      return;
    }

    await useSchoolStore.getState().fetchSchools();
  },
  updateSchool: async (id, payload) => {
    const response = await fetch(`${API_BASE_URL}/schools/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || "Failed to update school");
    }

    if (data?.school) {
      set((state) => ({
        schools: state.schools.map((s) => (s.id === id ? data.school : s)),
      }));
      return;
    }

    await useSchoolStore.getState().fetchSchools();
  },
  updateSchoolPlan: async (id, plan) => {
    const amount = planAmounts[plan] || 5000;
    const response = await fetch(`${API_BASE_URL}/schools/${id}/plan`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, amount }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || "Failed to update plan");
    }

    if (data?.school) {
      set((state) => ({
        schools: state.schools.map((s) => (s.id === id ? data.school : s)),
      }));
    }
  },
  updateSchoolStatus: async (id, status) => {
    const response = await fetch(`${API_BASE_URL}/schools/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || "Failed to update status");
    }

    if (data?.school) {
      set((state) => ({
        schools: state.schools.map((s) => (s.id === id ? data.school : s)),
      }));
    }
  },
  deletePayment: async (schoolId, month) => {
    const response = await fetch(`${API_BASE_URL}/schools/${schoolId}/payments/${encodeURIComponent(month)}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || "Failed to delete payment");
    }

    if (data?.school) {
      set((state) => ({
        schools: state.schools.map((s) => (s.id === schoolId ? data.school : s)),
      }));
    }
  },
}));
