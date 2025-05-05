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

export interface User {
  id: number
  email: string
  name: string
  password: string
  role: "admin" | "hr" | "manager"
  createdAt: string
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

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  email: string
  name: string
  password: string
}

export interface Session {
  user: {
    id: number
    email: string
    name: string
    role: string
  }
  expires: string
}
