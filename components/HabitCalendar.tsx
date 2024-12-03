"use client"

import React, { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Plus, Book, BookOpen, BarChart, RefreshCw, Calendar } from "lucide-react"
import Link from "next/link"
import { useHabitStore } from "@/store/useHabitStore"
import HabitForm from "./HabitForm"
import { ModeToggle } from "./ModeToggle"
import JournalModal from "./JournalModal"
import AllJournalsModal from "./AllJournalsModal"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const AnimatedRefreshIcon = ({ className }: { className?: string }) => (
  <RefreshCw className={`w-5 h-5 ${className} ${className?.includes("rotate-animation") ? "animate-spin" : ""}`} />
)

const HabitCalendar = () => {
  const {
    habits,
    currentDate,
    toggleCompletion,
    deleteHabit,
    editHabit,
    getHabitStats,
    setCurrentDate,
    getHabitsByCategory,
    getJournalEntry,
    fetchHabits,
    fetchJournalEntries,
  } = useHabitStore()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<string | null>(null)
  const [journalDate, setJournalDate] = useState<string | null>(null)
  const [isAllJournalsOpen, setIsAllJournalsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        await fetchHabits()
        await fetchJournalEntries()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [fetchHabits, fetchJournalEntries])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await fetchHabits()
      await fetchJournalEntries()
      toast.success("Data refreshed successfully")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsRefreshing(false)
    }
  }

  const getDays = () => {
    const curr = new Date(currentDate)
    const days = []
    const daysToShow = isMobile ? 5 : 20

    for (let i = 0; i < daysToShow; i++) {
      const day = new Date(curr)
      days.push(day)
      curr.setDate(curr.getDate() + 1)
    }

    return days
  }

  const days = getDays()

  const handleToggleCompletion = async (habitId: string, date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    try {
      await toggleCompletion(habitId, dateStr)
      toast.success("Habit completion toggled")
    } catch (err) {
      toast.error("Failed to toggle habit completion")
    }
  }

  const handleDeleteHabit = async (habitId: string) => {
    if (window.confirm("Are you sure you want to delete this habit?")) {
      try {
        await deleteHabit(habitId)
        toast.success("Habit deleted successfully")
      } catch (err) {
        toast.error("Failed to delete habit")
      }
    }
  }

  const handleEditHabit = (habitId: string) => {
    setEditingHabit(habitId)
    setIsFormOpen(true)
  }

  const handlePrevPeriod = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() - (isMobile ? 5 : 20))
    setCurrentDate(newDate)
  }

  const handleNextPeriod = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + (isMobile ? 5 : 20))
    setCurrentDate(newDate)
  }

  const handleOpenJournal = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    setJournalDate(dateStr)
  }

  const handleTodayClick = () => {
    setCurrentDate(new Date())
  }

  const habitsByCategory = React.useMemo(() => {
    return habits.reduce(
      (acc, habit) => {
        if (!acc[habit.category]) {
          acc[habit.category] = []
        }
        acc[habit.category].push(habit)
        return acc
      },
      {} as Record<string, Habit[]>,
    )
  }, [habits])

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={handleRefresh}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Habit Tracker</h1>
            <ModeToggle />
          </div>
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <Button onClick={handlePrevPeriod} variant="outline" size="icon">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium">
                {`${days[0].toLocaleDateString("default", { month: "short", day: "numeric" })} - ${days[days.length - 1].toLocaleDateString("default", { month: "short", day: "numeric" })}`}
              </span>
              <Button onClick={handleNextPeriod} variant="outline" size="icon">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleTodayClick} size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Today
              </Button>
              <Button onClick={() => setIsAllJournalsOpen(true)} size="sm">
                <Book className="w-4 h-4 mr-2" />
                Journals
              </Button>
              <Link href="/statistics" passHref>
                <Button as="a" size="sm">
                  <BarChart className="w-4 h-4 mr-2" />
                  Stats
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        {isMobile ? (
          <div className="space-y-4">
            {Object.entries(habitsByCategory).map(([category, categoryHabits]) => (
              <div key={category} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold mb-2">{category || "Uncategorized"}</h3>
                {categoryHabits.map((habit) => (
                  <div key={habit.id} className="mb-4 last:mb-0">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{habit.name}</span>
                      <div className="space-x-2">
                        <Button onClick={() => handleEditHabit(habit.id)} variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button onClick={() => handleDeleteHabit(habit.id)} variant="destructive" size="sm">
                          Delete
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      {days.map((day, index) => {
                        const dateStr = day.toISOString().split("T")[0]
                        const isCompleted = habit.completedDates.includes(dateStr)
                        const todayHighlight = isToday(day) ? "ring-2 ring-blue-500 dark:ring-blue-400" : ""
                        return (
                          <Button
                            key={index}
                            onClick={() => handleToggleCompletion(habit.id, day)}
                            variant={isCompleted ? "default" : "outline"}
                            size="sm"
                            className={`w-8 h-8 p-0 ${
                              isCompleted
                                ? "bg-green-500 dark:bg-green-700 text-white"
                                : "bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500"
                            } ${todayHighlight}`}
                          >
                            {isCompleted ? "✓" : day.getDate()}
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-sm text-gray-600 dark:text-gray-300">
                  <th className="p-2 text-left min-w-[120px]">Habits</th>
                  {days.map((day, index) => (
                    <th
                      key={index}
                      className={`p-2 text-center w-16 ${isToday(day) ? "bg-blue-100 dark:bg-blue-900" : ""}`}
                    >
                      <div className="flex flex-col items-center">
                        <span>{day.toLocaleDateString("default", { weekday: "short" })}</span>
                        <span className={`${isToday(day) ? "font-bold text-blue-600 dark:text-blue-400" : ""}`}>
                          {day.getDate()}
                        </span>
                      </div>
                    </th>
                  ))}
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(habitsByCategory).map(([category, categoryHabits]) => (
                  <React.Fragment key={category}>
                    <tr>
                      <td
                        colSpan={days.length + 2}
                        className="py-2 px-4 font-semibold bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      >
                        {category || "Uncategorized"}
                      </td>
                    </tr>
                    {categoryHabits.map((habit) => (
                      <tr
                        key={habit.id}
                        className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
                      >
                        <td className="p-2 text-left font-medium text-gray-700 dark:text-gray-300">{habit.name}</td>
                        {days.map((day, index) => {
                          const dateStr = day.toISOString().split("T")[0]
                          const isCompleted = habit.completedDates.includes(dateStr)
                          const todayHighlight = isToday(day) ? "ring-2 ring-blue-500 dark:ring-blue-400" : ""
                          return (
                            <td key={index} className="p-2 text-center">
                              <Button
                                onClick={() => handleToggleCompletion(habit.id, day)}
                                variant={isCompleted ? "default" : "outline"}
                                size="sm"
                                className={`w-6 h-6 p-0 ${
                                  isCompleted
                                    ? "bg-green-500 dark:bg-green-700 text-white"
                                    : "bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500"
                                } ${todayHighlight}`}
                              >
                                {isCompleted && "✓"}
                              </Button>
                            </td>
                          )
                        })}
                        <td className="p-2 text-center">
                          <Button
                            onClick={() => handleEditHabit(habit.id)}
                            variant="outline"
                            size="sm"
                            className="mr-2"
                          >
                            Edit
                          </Button>
                          <Button onClick={() => handleDeleteHabit(habit.id)} variant="destructive" size="sm">
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add New Habit Button */}
        <Button onClick={() => setIsFormOpen(true)} className="mt-4 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Habit
        </Button>
      </div>

      <HabitForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingHabit(null)
        }}
        habitToEdit={editingHabit ? habits.find((h) => h.id === editingHabit) : undefined}
      />

      {journalDate && <JournalModal isOpen={true} onClose={() => setJournalDate(null)} date={journalDate} />}

      <AllJournalsModal isOpen={isAllJournalsOpen} onClose={() => setIsAllJournalsOpen(false)} />
    </div>
  )
}

export default HabitCalendar

