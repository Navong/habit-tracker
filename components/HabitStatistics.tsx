"use client"

import React from "react"
import { useHabitStore } from "@/store/useHabitStore"
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

const HabitStatistics = () => {
  const { habits, getHabitStats } = useHabitStore()

  const data = habits.map((habit) => {
    const stats = getHabitStats(habit.id)
    return {
      name: habit.name,
      completed: stats.completed,
      total: stats.total,
      percentage: stats.percentage,
      streak: stats.streak,
    }
  })

  const pieData = habits.map((habit) => ({
    name: habit.name,
    value: getHabitStats(habit.id).completed,
  }))

  const weeklyData = [
    { name: "Mon", completed: 5 },
    { name: "Tue", completed: 7 },
    { name: "Wed", completed: 6 },
    { name: "Thu", completed: 8 },
    { name: "Fri", completed: 4 },
    { name: "Sat", completed: 3 },
    { name: "Sun", completed: 5 },
  ]

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-6">Habit Statistics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Completion Rates</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="percentage" fill="#8884d8" name="Completion %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Longest Streaks</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="streak" fill="#82ca9d" name="Longest Streak (days)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Habit Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Weekly Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="completed" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Detailed Habit Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((item) => (
            <div key={item.name} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
              <p>
                Completed: {item.completed}/{item.total}
              </p>
              <p>Completion Rate: {item.percentage}%</p>
              <p>Longest Streak: {item.streak} days</p>
              <div className="mt-2 bg-blue-500 h-2 rounded-full" style={{ width: `${item.percentage}%` }}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HabitStatistics

