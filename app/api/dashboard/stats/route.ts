import { getDashboardStats } from "@/backend/controllers/job.controller"

// GET /api/dashboard/stats - Get dashboard statistics
export async function GET() {
  return getDashboardStats()
}
