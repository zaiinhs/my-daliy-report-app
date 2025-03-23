"use client"

import type React from "react"

import { useState } from "react"
import { CalendarIcon, PlusCircle } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AddSalaryFormProps {
  onAddSalary: (date: string, amount: number) => void
}

export default function AddSalaryForm({ onAddSalary }: AddSalaryFormProps) {
  const [date, setDate] = useState<Date>()
  const [amount, setAmount] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  // Handle amount input with formatting
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-numeric characters
    const value = e.target.value.replace(/[^0-9]/g, "")

    if (value === "") {
      setAmount("")
      return
    }

    // Format as currency
    const numericValue = Number.parseInt(value, 10)
    setAmount(numericValue.toLocaleString("id-ID"))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!date) {
      setError("Please select a date")
      return
    }

    // For amount, we need to check the raw numeric value
    const numericAmount = amount ? Number.parseInt(amount.replace(/\./g, ""), 10) : 0

    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid amount")
      return
    }

    // Format date as DD/MM/YYYY
    const formattedDate = format(date, "dd/MM/yyyy")

    // Call the parent function to add the salary
    onAddSalary(formattedDate, numericAmount)

    // Reset form
    setDate(undefined)
    setAmount("")
    setError(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Add New Salary Entry</CardTitle>
        <CardDescription>Enter the date and amount of your salary payment</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Payment Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (Rp)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">Rp</span>
              <Input id="amount" value={amount} onChange={handleAmountChange} className="pl-8" placeholder="0" />
            </div>
          </div>

          {error && <div className="text-sm font-medium text-destructive">{error}</div>}

          <Button type="submit" className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Salary Entry
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

