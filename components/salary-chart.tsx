"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface SalaryData {
  date: string
  amount: number
}

interface SalaryChartProps {
  data: SalaryData[]
}

export default function SalaryChart({ data }: SalaryChartProps) {
  // Process data for the chart
  const chartData = data.map((item) => {
    // Convert DD/MM/YYYY to Month YYYY format for display
    const [day, month, year] = item.date.split("/")
    const date = new Date(`${year}-${month}-${day}`)
    const monthName = date.toLocaleDateString("en-US", { month: "short" })
    const yearNum = date.getFullYear()

    return {
      month: `${monthName} ${yearNum}`,
      amount: item.amount,
      fullDate: item.date,
      formattedAmount: formatCurrency(item.amount),
    }
  })

  // Format currency
  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-md shadow-md p-4">
          <p className="font-medium text-sm text-foreground mb-1">{label}</p>
          <p className="text-lg font-bold text-primary">{payload[0].payload.formattedAmount}</p>
          <p className="text-xs text-muted-foreground mt-1">Received on: {payload[0].payload.fullDate}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" tick={{ fontSize: 12 }} tickMargin={10} />
          <YAxis
            tickFormatter={(value) =>
              new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                notation: "compact",
                minimumFractionDigits: 0,
                maximumFractionDigits: 1,
              }).format(value)
            }
            tick={{ fontSize: 12 }}
            tickMargin={10}
          />
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="amount"
            name="Income"
            stroke="hsl(var(--primary))"
            fillOpacity={1}
            fill="url(#colorIncome)"
            activeDot={{ r: 6, strokeWidth: 2, stroke: "hsl(var(--background))" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

