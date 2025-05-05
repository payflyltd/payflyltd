import type { NextRequest } from "next/server"
import { getJob, updateExistingJob, deleteExistingJob } from "@/backend/controllers/job.controller"

// GET /api/jobs/[id] - Get a specific job
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  return getJob(Number.parseInt(params.id))
}

// PUT /api/jobs/[id] - Update a job
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  return updateExistingJob(request, Number.parseInt(params.id))
}

// DELETE /api/jobs/[id] - Delete a job
export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  return deleteExistingJob(Number.parseInt(params.id))
}
