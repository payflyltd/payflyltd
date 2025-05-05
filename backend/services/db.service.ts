import fs from "fs"
import path from "path"
import type { Job } from "@/types"

// In-memory store for production
let inMemoryJobs: Job[] = []
let isInitialized = false

// Path to our JSON "database" file
const dbPath = path.join(process.cwd(), "data", "jobs.json")

// Initial data
const initialData = [
  {
    id: 1,
    title: "UI UX Designer",
    department: "Design",
    location: "Lagos, Nigeria",
    type: "Full Time",
    experience: "Mid Level",
    openings: 12,
    applications: 135,
    posted: "2023-04-01",
    status: "active",
    description: "We are looking for a talented UI/UX Designer to create amazing user experiences.",
    requirements:
      "- 3+ years of UI/UX design experience\n- Proficiency in design tools like Figma\n- Portfolio showcasing your work",
    responsibilities: "- Create user-centered designs\n- Develop UI mockups and prototypes\n- Conduct user research",
  },
  {
    id: 2,
    title: "Full Stack Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full Time",
    experience: "Senior Level",
    openings: 8,
    applications: 100,
    posted: "2023-03-15",
    status: "inactive",
    description: "We're seeking an experienced Full Stack Developer to join our engineering team.",
    requirements:
      "- 5+ years of full stack development\n- Experience with React and Node.js\n- Strong problem-solving skills",
    responsibilities:
      "- Develop and maintain web applications\n- Collaborate with cross-functional teams\n- Write clean, maintainable code",
  },
  {
    id: 3,
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Lagos, Nigeria",
    type: "Internship",
    experience: "Entry Level",
    openings: 12,
    applications: 5,
    posted: "2023-04-10",
    status: "active",
    description: "Join our DevOps team and help us build robust infrastructure.",
    requirements: "- Basic knowledge of cloud platforms\n- Understanding of CI/CD pipelines\n- Eager to learn and grow",
    responsibilities:
      "- Assist in maintaining cloud infrastructure\n- Help automate deployment processes\n- Learn about monitoring and logging",
  },
  {
    id: 4,
    title: "Android Developer",
    department: "Engineering",
    location: "Abuja, Nigeria",
    type: "Full Time",
    experience: "Mid Level",
    openings: 4,
    applications: 45,
    posted: "2023-03-20",
    status: "active",
    description: "We're looking for an Android Developer to build innovative mobile applications.",
    requirements:
      "- 3+ years of Android development\n- Experience with Kotlin\n- Understanding of mobile UX principles",
    responsibilities:
      "- Develop and maintain Android applications\n- Collaborate with the design team\n- Optimize application performance",
  },
  {
    id: 5,
    title: "Product Manager",
    department: "Product",
    location: "Lagos, Nigeria",
    type: "Full Time",
    experience: "Senior Level",
    openings: 2,
    applications: 78,
    posted: "2023-02-28",
    status: "inactive",
    description: "We're seeking a Product Manager to lead our product development efforts.",
    requirements:
      "- 5+ years of product management experience\n- Strong analytical skills\n- Excellent communication abilities",
    responsibilities:
      "- Define product vision and strategy\n- Work with engineering and design teams\n- Analyze market trends and user feedback",
  },
]

// Determine if we're in production
const isProduction = process.env.NODE_ENV === "production"

// Initialize the database
const initializeDb = () => {
  if (isInitialized) return

  if (isProduction) {
    // In production, try to load from localStorage first
    if (typeof window !== "undefined") {
      try {
        const storedJobs = localStorage.getItem("hr-dashboard-jobs")
        if (storedJobs) {
          inMemoryJobs = JSON.parse(storedJobs)
          isInitialized = true
          return
        }
      } catch (error) {
        console.error("Failed to load jobs from localStorage:", error)
      }
    }

    // If localStorage failed or not available, use initial data
    if (inMemoryJobs.length === 0) {
      inMemoryJobs = [...initialData]

      // Try to save to localStorage
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("hr-dashboard-jobs", JSON.stringify(inMemoryJobs))
        } catch (error) {
          console.error("Failed to save jobs to localStorage:", error)
        }
      }
    }
  } else {
    // In development, use file storage
    const dir = path.dirname(dbPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, JSON.stringify({ jobs: initialData }, null, 2))
    }
  }

  isInitialized = true
}

// Read all jobs
export const getAllJobs = (): Job[] => {
  initializeDb()

  if (isProduction) {
    return [...inMemoryJobs]
  } else {
    const data = JSON.parse(fs.readFileSync(dbPath, "utf8"))
    return data.jobs
  }
}

// Get a single job by ID
export const getJobById = (id: number): Job | undefined => {
  const jobs = getAllJobs()
  return jobs.find((job) => job.id === id)
}

// Create a new job
export const createJob = (job: Omit<Job, "id" | "applications" | "posted">): Job => {
  const jobs = getAllJobs()

  // Generate a new ID
  const newId = jobs.length > 0 ? Math.max(...jobs.map((j) => j.id)) + 1 : 1

  const newJob: Job = {
    ...job,
    id: newId,
    applications: 0,
    posted: new Date().toISOString().split("T")[0], // YYYY-MM-DD format
  }

  if (isProduction) {
    // In production, update in-memory storage
    inMemoryJobs.push(newJob)

    // Save to localStorage if available
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("hr-dashboard-jobs", JSON.stringify(inMemoryJobs))
      } catch (error) {
        console.error("Failed to save jobs to localStorage:", error)
      }
    }
  } else {
    // In development, update file storage
    jobs.push(newJob)
    fs.writeFileSync(dbPath, JSON.stringify({ jobs }, null, 2))
  }

  return newJob
}

// Update an existing job
export const updateJob = (id: number, updates: Partial<Job>): Job | null => {
  if (isProduction) {
    // In production, update in-memory storage
    const index = inMemoryJobs.findIndex((job) => job.id === id)
    if (index === -1) return null

    inMemoryJobs[index] = { ...inMemoryJobs[index], ...updates }

    // Save to localStorage if available
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("hr-dashboard-jobs", JSON.stringify(inMemoryJobs))
      } catch (error) {
        console.error("Failed to save jobs to localStorage:", error)
      }
    }

    return inMemoryJobs[index]
  } else {
    // In development, update file storage
    const jobs = getAllJobs()
    const index = jobs.findIndex((job) => job.id === id)
    if (index === -1) return null

    jobs[index] = { ...jobs[index], ...updates }
    fs.writeFileSync(dbPath, JSON.stringify({ jobs }, null, 2))
    return jobs[index]
  }
}

// Delete a job
export const deleteJob = (id: number): boolean => {
  if (isProduction) {
    // In production, update in-memory storage
    const initialLength = inMemoryJobs.length
    inMemoryJobs = inMemoryJobs.filter((job) => job.id !== id)

    // Save to localStorage if available
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("hr-dashboard-jobs", JSON.stringify(inMemoryJobs))
      } catch (error) {
        console.error("Failed to save jobs to localStorage:", error)
      }
    }

    return inMemoryJobs.length < initialLength
  } else {
    // In development, update file storage
    const jobs = getAllJobs()
    const filteredJobs = jobs.filter((job) => job.id !== id)

    if (filteredJobs.length === jobs.length) return false

    fs.writeFileSync(dbPath, JSON.stringify({ jobs: filteredJobs }, null, 2))
    return true
  }
}
