"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, InfoIcon } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { jobService } from "@/frontend/services/api.service"
import type { DashboardStats } from "@/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/frontend/contexts/auth.context"

export default function Dashboard() {
  const { session } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalApplications: 0,
    totalJobs: 0,
    activeJobs: 0,
    inactiveJobs: 0,
    recentJobs: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStat, setSelectedStat] = useState<"active" | "inactive" | "total">("total")

  // Initialize data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const dashboardStats = await jobService.getDashboardStats()
        setStats(dashboardStats)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-[#FF0084] border-gray-200 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  // Calculate percentages for the pie chart
  const activePercentage = stats.totalJobs > 0 ? Math.round((stats.activeJobs / stats.totalJobs) * 100) : 0
  const inactivePercentage = stats.totalJobs > 0 ? Math.round((stats.inactiveJobs / stats.totalJobs) * 100) : 0

  // Calculate the stroke dasharray values for the pie chart
  const circumference = 2 * Math.PI * 40
  const activeOffset = circumference * (1 - activePercentage / 100)
  const inactiveOffset = circumference * (1 - inactivePercentage / 100)

  return (
    <div className="space-y-6">
      <Toaster />

      <Alert className="mb-4">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Mock Authentication Active</AlertTitle>
        <AlertDescription>
          You are logged in as {session?.user.name} ({session?.user.email}) using the mock authentication system.
        </AlertDescription>
      </Alert>

      <div className="mb-4">
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight mb-1">Dashboard Overview</h2>
        <p className="text-sm text-gray-500 md:text-base">Monitor your recruitment metrics and job postings</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          className={`bg-white cursor-pointer transition-all ${selectedStat === "total" ? "ring-2 ring-[#FF0084]" : ""}`}
          onClick={() => setSelectedStat("total")}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-medium">Total Jobs</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <span className="text-3xl md:text-4xl font-semibold text-gray-700">{stats.totalJobs}</span>
            <div className="w-24 h-12">
              <svg viewBox="0 0 100 30" className="w-full h-full">
                <path
                  d="M0,15 L10,12 L20,18 L30,10 L40,15 L50,5 L60,12 L70,8 L80,15 L90,10 L100,15"
                  fill="none"
                  stroke="#4ADE80"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`bg-white cursor-pointer transition-all ${selectedStat === "active" ? "ring-2 ring-[#FF0084]" : ""}`}
          onClick={() => setSelectedStat("active")}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-medium">Active Jobs</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <span className="text-3xl md:text-4xl font-semibold text-gray-700">{stats.activeJobs}</span>
            <div className="w-24 h-12">
              <svg viewBox="0 0 100 30" className="w-full h-full">
                <path
                  d="M0,15 L10,12 L20,18 L30,10 L40,15 L50,5 L60,12 L70,8 L80,15 L90,10 L100,15"
                  fill="none"
                  stroke="#4ADE80"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`bg-white cursor-pointer transition-all ${selectedStat === "inactive" ? "ring-2 ring-[#FF0084]" : ""}`}
          onClick={() => setSelectedStat("inactive")}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-medium">Inactive Jobs</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <span className="text-3xl md:text-4xl font-semibold text-gray-700">{stats.inactiveJobs}</span>
            <div className="w-24 h-12">
              <svg viewBox="0 0 100 30" className="w-full h-full">
                <path
                  d="M0,15 L10,12 L20,18 L30,10 L40,15 L50,5 L60,12 L70,8 L80,15 L90,10 L100,15"
                  fill="none"
                  stroke="#4ADE80"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-medium">Average Openings</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <div className="flex items-baseline">
              <span className="text-3xl md:text-4xl font-semibold text-gray-700">
                {stats.totalJobs > 0
                  ? Math.round(stats.recentJobs.reduce((sum, job) => sum + job.openings, 0) / stats.recentJobs.length)
                  : 0}
              </span>
              <span className="ml-1 text-sm text-gray-500">per job</span>
            </div>
            <div className="w-24 h-12">
              <svg viewBox="0 0 100 30" className="w-full h-full">
                <path
                  d="M0,15 L10,13 L20,16 L30,12 L40,14 L50,10 L60,8 L70,6 L80,9 L90,5 L100,7"
                  fill="none"
                  stroke="#4ADE80"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg md:text-xl font-semibold">Job Statistics</CardTitle>
            <button className="flex items-center text-[#FF0084] text-sm font-medium">
              <Download className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Download Report</span>
              <span className="sm:hidden">Report</span>
            </button>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="relative w-40 h-40 md:w-48 md:h-48">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Background circle */}
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f0f0f0" strokeWidth="20" />

                  {/* Active jobs segment */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#4ADE80"
                    strokeWidth="20"
                    strokeDasharray={circumference}
                    strokeDashoffset={activeOffset}
                    transform="rotate(-90 50 50)"
                    className={`transition-all duration-500 ${selectedStat === "active" ? "opacity-100" : "opacity-70"}`}
                  />

                  {/* Inactive jobs segment */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#F97316"
                    strokeWidth="20"
                    strokeDasharray={circumference}
                    strokeDashoffset={inactiveOffset}
                    transform={`rotate(${-90 + activePercentage * 3.6} 50 50)`}
                    className={`transition-all duration-500 ${selectedStat === "inactive" ? "opacity-100" : "opacity-70"}`}
                  />

                  {/* Center text */}
                  <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="bold">
                    {selectedStat === "total"
                      ? stats.totalJobs
                      : selectedStat === "active"
                        ? stats.activeJobs
                        : stats.inactiveJobs}
                  </text>
                  <text x="50" y="62" textAnchor="middle" dominantBaseline="middle" fontSize="8">
                    {selectedStat === "total"
                      ? "Total Jobs"
                      : selectedStat === "active"
                        ? "Active Jobs"
                        : "Inactive Jobs"}
                  </text>
                </svg>
              </div>

              <div className="grid grid-cols-1 gap-4 text-center md:text-left">
                <div
                  className={`flex flex-col md:flex-row items-center gap-2 p-3 rounded-md cursor-pointer transition-all ${
                    selectedStat === "total" ? "bg-gray-100" : ""
                  }`}
                  onClick={() => setSelectedStat("total")}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF0084]"></div>
                    <span className="text-sm text-gray-600 font-medium">Total Jobs</span>
                  </div>
                  <p className="text-xl md:text-2xl font-semibold md:ml-auto">{stats.totalJobs}</p>
                </div>

                <div
                  className={`flex flex-col md:flex-row items-center gap-2 p-3 rounded-md cursor-pointer transition-all ${
                    selectedStat === "active" ? "bg-gray-100" : ""
                  }`}
                  onClick={() => setSelectedStat("active")}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#4ADE80]"></div>
                    <span className="text-sm text-gray-600 font-medium">Active Jobs</span>
                  </div>
                  <p className="text-xl md:text-2xl font-semibold md:ml-auto">{stats.activeJobs}</p>
                </div>

                <div
                  className={`flex flex-col md:flex-row items-center gap-2 p-3 rounded-md cursor-pointer transition-all ${
                    selectedStat === "inactive" ? "bg-gray-100" : ""
                  }`}
                  onClick={() => setSelectedStat("inactive")}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#F97316]"></div>
                    <span className="text-sm text-gray-600 font-medium">Inactive Jobs</span>
                  </div>
                  <p className="text-xl md:text-2xl font-semibold md:ml-auto">{stats.inactiveJobs}</p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-2 p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    <span className="text-sm text-gray-600 font-medium">Job Fill Rate</span>
                  </div>
                  <p className="text-xl md:text-2xl font-semibold md:ml-auto">
                    {stats.totalJobs > 0 ? `${Math.round((stats.activeJobs / stats.totalJobs) * 100)}%` : "0%"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg md:text-xl font-semibold">Recent Job Posts</CardTitle>
            <Tabs defaultValue="today">
              <TabsList>
                <TabsTrigger value="monthly" className="text-xs md:text-sm">
                  Monthly
                </TabsTrigger>
                <TabsTrigger value="weekly" className="text-xs md:text-sm">
                  Weekly
                </TabsTrigger>
                <TabsTrigger value="today" className="text-xs md:text-sm">
                  Today
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 text-xs md:text-sm font-medium text-gray-500">Job Title</th>
                      <th className="text-left py-3 px-2 text-xs md:text-sm font-medium text-gray-500">Category</th>
                      <th className="text-left py-3 px-2 text-xs md:text-sm font-medium text-gray-500">Openings</th>
                      <th className="text-left py-3 px-2 text-xs md:text-sm font-medium text-gray-500">Applications</th>
                      <th className="text-left py-3 px-2 text-xs md:text-sm font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentJobs.map((job) => (
                      <tr key={job.id} className="border-b">
                        <td className="py-4 px-2 text-sm md:text-base font-medium">{job.title}</td>
                        <td className="py-4 px-2 text-sm">{job.type}</td>
                        <td className="py-4 px-2 text-sm">{job.openings}</td>
                        <td className="py-4 px-2 text-sm">{job.applications}</td>
                        <td className="py-4 px-2">
                          <span
                            className={`px-3 py-1 text-white text-xs rounded-md font-medium ${
                              job.status === "active" ? "bg-green-500" : "bg-orange-500"
                            }`}
                          >
                            {job.status === "active" ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {stats.recentJobs.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-4 px-2 text-center text-gray-500">
                          No job postings found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
