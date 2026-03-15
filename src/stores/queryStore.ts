import { create } from "zustand";
import { API_BASE_URL } from "@/lib/api";

export interface Query {
  id: string;
  name: string;
  email: string;
  phone: string;
  school: string;
  queryType: string;
  message: string;
  date: string;
  read: boolean;
}

interface QueryInput {
  name: string;
  email: string;
  phone: string;
  school: string;
  queryType: string;
  message: string;
}

interface QueryStore {
  queries: Query[];
  isLoading: boolean;
  error: string | null;
  fetchQueries: () => Promise<void>;
  submitQuery: (q: QueryInput) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  deleteQuery: (id: string) => Promise<void>;
}

interface QueryApiItem {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  school?: string;
  queryType: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const toUiQuery = (item: QueryApiItem): Query => ({
  id: item._id,
  name: item.name,
  email: item.email || "",
  phone: item.phone,
  school: item.school || "",
  queryType: item.queryType,
  message: item.message,
  date: new Date(item.createdAt).toISOString().split("T")[0],
  read: item.read,
});

export const useQueryStore = create<QueryStore>((set) => ({
  queries: [],
  isLoading: false,
  error: null,
  fetchQueries: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/queries`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch queries");
      }

      const items: QueryApiItem[] = Array.isArray(data?.queries) ? data.queries : [];
      set({ queries: items.map(toUiQuery), isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to fetch queries",
      });
    }
  },
  submitQuery: async (q) => {
    set({ error: null });
    const response = await fetch(`${API_BASE_URL}/queries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(q),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || "Failed to submit query");
    }

    const created = data?.query as QueryApiItem | undefined;
    if (created?._id) {
      set((state) => ({ queries: [toUiQuery(created), ...state.queries] }));
      return;
    }

    await useQueryStore.getState().fetchQueries();
  },
  markAsRead: async (id) => {
    const response = await fetch(`${API_BASE_URL}/queries/${id}/read`, {
      method: "PATCH",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || "Failed to mark query as read");
    }

    set((state) => ({
      queries: state.queries.map((q) => (q.id === id ? { ...q, read: true } : q)),
    }));
  },
  deleteQuery: async (id) => {
    const response = await fetch(`${API_BASE_URL}/queries/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || "Failed to delete query");
    }

    set((state) => ({
      queries: state.queries.filter((q) => q.id !== id),
    }));
  },
}));
