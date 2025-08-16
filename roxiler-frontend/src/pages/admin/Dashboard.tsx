import { useEffect, useState } from "react"
import api from "@/api/axios"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface DashboardStats {
  totalUsers: number
  totalStores: number
  totalRatings: number
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/api/admin/dashboard")
        setStats(res.data.data)
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return <p className="p-6">Loading...</p>
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard title="Total Users" value={stats?.totalUsers ?? 0} />
        <StatCard title="Total Stores" value={stats?.totalStores ?? 0} />
        <StatCard title="Total Ratings" value={stats?.totalRatings ?? 0} />
      </div>
    </div>
  )
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  )
}

export default Dashboard
