"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SalaryTable from "./salary-table"
import SalaryChart from "./salary-chart"
import AddSalaryForm from "./add-salary-form"

// Sample data based on the provided information
const initialSalaryData = [
  { date: "25/11/2024", amount: 10500000 },
  { date: "25/12/2024", amount: 10500000 },
  { date: "25/01/2025", amount: 6100000 },
  { date: "25/02/2025", amount: 6100000 },
  { date: "25/03/2025", amount: 18600000 },
]

export default function SalaryDashboard() {
  const [salaryData, setSalaryData] = useState(initialSalaryData)

  // Calculate total income
  const totalIncome = salaryData.reduce((sum, item) => sum + item.amount, 0)

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  // Handle adding new salary entry
  const handleAddSalary = (date: string, amount: number) => {
    // Create new entry
    const newEntry = { date, amount }

    // Add to existing data and sort by date
    const updatedData = [...salaryData, newEntry].sort((a, b) => {
      // Convert DD/MM/YYYY to Date objects for comparison
      const [dayA, monthA, yearA] = a.date.split("/")
      const [dayB, monthB, yearB] = b.date.split("/")

      const dateA = new Date(`${yearA}-${monthA}-${dayA}`)
      const dateB = new Date(`${yearB}-${monthB}-${dayB}`)

      return dateA.getTime() - dateB.getTime()
    })

    // Update state
    setSalaryData(updatedData)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Salary Documentation | @zaiinhs</h1>
        <p className="text-muted-foreground">Track and visualize your income over time</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalIncome)}</div>
            <p className="text-xs text-muted-foreground">For the period Nov 2024 - Mar 2025</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Monthly Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalIncome / salaryData.length)}</div>
            <p className="text-xs text-muted-foreground">Based on {salaryData.length} months of data</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highest Monthly Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(Math.max(...salaryData.map((item) => item.amount)))}
            </div>
            <p className="text-xs text-muted-foreground">
              {salaryData.length > 0 &&
                (() => {
                  const maxAmount = Math.max(...salaryData.map((item) => item.amount))
                  const maxEntry = salaryData.find((item) => item.amount === maxAmount)
                  if (maxEntry) {
                    const [day, month, year] = maxEntry.date.split("/")
                    const date = new Date(`${year}-${month}-${day}`)
                    return `Recorded in ${date.toLocaleDateString("en-US", { month: "short", year: "numeric" })}`
                  }
                  return ""
                })()}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs defaultValue="chart" className="space-y-4">
            <TabsList>
              <TabsTrigger value="chart">Chart View</TabsTrigger>
              <TabsTrigger value="table">Table View</TabsTrigger>
            </TabsList>
            <TabsContent value="chart" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Income Trend</CardTitle>
                  <CardDescription>Visualization of your monthly income over time</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <SalaryChart data={salaryData} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="table" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Income Records</CardTitle>
                  <CardDescription>Detailed view of your monthly income</CardDescription>
                </CardHeader>
                <CardContent>
                  <SalaryTable data={salaryData} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div>
          <AddSalaryForm onAddSalary={handleAddSalary} />
        </div>
      </div>
    </div>
  )
}

