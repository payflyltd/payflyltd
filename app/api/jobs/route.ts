import type { NextRequest } from "next/server"
import { getJobs, createNewJob } from "@/backend/controllers/job.controller"

// GET /api/jobs - Get all jobs
export async function GET() {
  return getJobs()
}

// POST /api/jobs - Create a new job
export async function POST(request: NextRequest) {
  return createNewJob(request)
}
