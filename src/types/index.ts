// Shared types used by both frontend and backend
export interface Job {
  id: number
  title: string
  department: string
  location: string
  type: string
  experience: string
  salary?: string
  openings: number
  applications: number
  posted: string
  status: "active" | "inactive"
  description?: string
  requirements?: string
  responsibilities?: string
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  success: boolean
}

export interface DashboardStats {
  totalApplications: number
  totalJobs: number
  activeJobs: number
  inactiveJobs: number
  recentJobs: Array<{
    id: number
    title: string
    department: string
    type: string
    openings: number
    applications: number
    status: string
  }>
}
