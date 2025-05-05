import type { Job } from "@/types"

// Initial dummy data
const initialData: Job[] = [
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

// Function to initialize data in localStorage
export function initializeData(): void {
  if (typeof window === "undefined") return // Skip during SSR

  try {
    // Check if data already exists
    const existingData = localStorage.getItem("hr-dashboard-jobs")

    // Only initialize if no data exists
    if (!existingData) {
      console.log("Initializing dummy data in localStorage")
      localStorage.setItem("hr-dashboard-jobs", JSON.stringify(initialData))
    }
  } catch (error) {
    console.error("Failed to initialize data in localStorage:", error)
  }
}

// Function to get jobs from localStorage
export function getJobsFromLocalStorage(): Job[] {
  if (typeof window === "undefined") return [] // Return empty array during SSR

  try {
    const storedJobs = localStorage.getItem("hr-dashboard-jobs")
    return storedJobs ? JSON.parse(storedJobs) : []
  } catch (error) {
    console.error("Failed to get jobs from localStorage:", error)
    return []
  }
}

// Function to calculate dashboard stats from localStorage
export function getDashboardStatsFromLocalStorage() {
  const jobs = getJobsFromLocalStorage()

  const activeJobs = jobs.filter((job) => job.status === "active").length
  const inactiveJobs = jobs.filter((job) => job.status === "inactive").length
  const totalApplications = jobs.reduce((sum, job) => sum + job.applications, 0)

  // Get recent jobs (sorted by posted date)
  const sortedJobs = [...jobs].sort((a, b) => new Date(b.posted).getTime() - new Date(a.posted).getTime())

  const recentJobs = sortedJobs.slice(0, 4).map((job) => ({
    id: job.id,
    title: job.title,
    department: job.department,
    type: job.type,
    openings: job.openings,
    applications: job.applications,
    status: job.status,
  }))

  return {
    totalApplications,
    totalJobs: jobs.length,
    activeJobs,
    inactiveJobs,
    recentJobs,
  }
}
