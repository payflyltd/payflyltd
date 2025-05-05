import type { Job, DashboardStats } from "@/types"

// Base API service with common methods
class ApiService {
  async get<T>(url: string): Promise<T> {
    const response = await fetch(url)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "An error occurred")
    }

    return data.data
  }

  async post<T>(url: string, body: any): Promise<T> {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "An error occurred")
    }

    return data.data
  }

  async put<T>(url: string, body: any): Promise<T> {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "An error occurred")
    }

    return data.data
  }

  async delete(url: string): Promise<void> {
    const response = await fetch(url, {
      method: "DELETE",
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "An error occurred")
    }
  }
}

// Job-specific API service
export class JobService extends ApiService {
  async getAllJobs(): Promise<Job[]> {
    return this.get<Job[]>("/api/jobs")
  }

  async getJobById(id: number): Promise<Job> {
    return this.get<Job>(`/api/jobs/${id}`)
  }

  async createJob(job: Omit<Job, "id" | "applications" | "posted">): Promise<Job> {
    return this.post<Job>("/api/jobs", job)
  }

  async updateJob(id: number, updates: Partial<Job>): Promise<Job> {
    return this.put<Job>(`/api/jobs/${id}`, updates)
  }

  async deleteJob(id: number): Promise<void> {
    return this.delete(`/api/jobs/${id}`)
  }

  async getDashboardStats(): Promise<DashboardStats> {
    return this.get<DashboardStats>("/api/dashboard/stats")
  }
}

// Create and export a singleton instance
export const jobService = new JobService()
