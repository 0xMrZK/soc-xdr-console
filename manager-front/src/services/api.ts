import type {
  AgentsResponse,
  IncidentsResponse,
  LifecycleResponse,
} from "@/types/dashboard";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Request failed for ${path}: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  getAgents: () => request<AgentsResponse>("/agents"),
  getIncidents: () => request<IncidentsResponse>("/incidents"),
  getLifecycle: () => request<LifecycleResponse>("/lifecycle"),
};