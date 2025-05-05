import type { Job, DashboardStats } from "@/types"

// Base API URL - replace with your actual API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api"

// Base API service with common methods
class ApiService {
  async get<T>(url: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Request failed with status ${response.status}`)
      }

      const data = await response.json()
      return data.data || data
    } catch (error) {
      console.error(`Error fetching from ${url}:`, error)
      throw error
    }
  }

  async post<T>(url: string, body: any): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Request failed with status ${response.status}`)
      }

      const data = await response.json()
      return data.data || data
    } catch (error) {
      console.error(`Error posting to ${url}:`, error)
      throw error
    }
  }

  async put<T>(url: string, body: any): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Request failed with status ${response.status}`)
      }

      const data = await response.json()
      return data.data || data
    } catch (error) {
      console.error(`Error updating ${url}:`, error)
      throw error
    }
  }

  async delete(url: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Request failed with status ${response.status}`)
      }
    } catch (error) {
      console.error(`Error deleting ${url}:`, error)
      throw error
    }
  }
}

// Job-specific API service
class JobService extends ApiService {
  async getAllJobs(): Promise<Job[]> {
    return this.get<Job[]>("/jobs")
  }

  async getJobById(id: number): Promise<Job> {
    return this.get<Job>(`/jobs/${id}`)
  }

  async createJob(job: Omit<Job, "id" | "applications" | "posted">): Promise<Job> {
    return this.post<Job>("/jobs", job)
  }

  async updateJob(id: number, updates: Partial<Job>): Promise<Job> {
    return this.put<Job>(`/jobs/${id}`, updates)
  }

  async deleteJob(id: number): Promise<void> {
    return this.delete(`/jobs/${id}`)
  }

  async getDashboardStats(): Promise<DashboardStats> {
    return this.get<DashboardStats>("/dashboard/stats")
  }
}

// Create and export a singleton instance
export const jobService = new JobService()
