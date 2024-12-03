import { create } from "zustand"
import { persist } from "zustand/middleware"
import axios, { type AxiosError } from "axios"

interface JournalEntry {
  id: string
  date: string
  content: string
  mood?: "great" | "good" | "neutral" | "bad" | "terrible"
  savedReflection?: string // New field for saved reflection
}

interface Habit {
  id: string
  name: string
  description: string
  goal: number
  frequency: "daily" | "weekly" | "monthly"
  color: string
  completedDates: string[]
  category: string
}

interface HabitStore {
  habits: Habit[]
  journalEntries: JournalEntry[]
  currentDate: Date
  fetchHabits: () => Promise<void>
  addHabit: (habit: Omit<Habit, "id" | "completedDates">) => Promise<void>
  toggleCompletion: (habitId: string, date: string) => Promise<void>
  deleteHabit: (habitId: string) => Promise<void>
  editHabit: (habitId: string, updatedHabit: Partial<Habit>) => Promise<void>
  fetchJournalEntries: () => Promise<void>
  addJournalEntry: (entry: Omit<JournalEntry, "id">) => Promise<void>
  editJournalEntry: (
    id: string,
    content: string,
    mood?: JournalEntry["mood"],
    savedReflection?: string,
  ) => Promise<void>
  deleteJournalEntry: (id: string) => Promise<void>
  getHabitStats: (habitId: string) => { completed: number; total: number; percentage: number; streak: number }
  setCurrentDate: (date: Date) => void
  getHabitsByCategory: () => Record<string, Habit[]>
  getJournalEntry: (date: string) => JournalEntry | undefined
  getAllJournalEntries: () => JournalEntry[]
  saveReflection: (id: string, reflection: string) => Promise<void> // New function
}

const API_URL = "http://localhost:9000/api"

const handleApiError = (error: unknown, context: string) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError
    console.error(`${context}:`, axiosError.message)
    if (axiosError.response) {
      console.error("Response data:", axiosError.response.data)
      console.error("Response status:", axiosError.response.status)
    } else if (axiosError.request) {
      console.error("No response received:", axiosError.request)
    } else {
      console.error("Error setting up request:", axiosError.message)
    }
  } else {
    console.error(`${context}:`, error)
  }
}

export const useHabitStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      habits: [],
      journalEntries: [],
      currentDate: new Date(),

      fetchHabits: async () => {
        const maxRetries = 3
        let retries = 0
        while (retries < maxRetries) {
          try {
            const response = await axios.get(`${API_URL}/habits`)
            set({ habits: response.data })
            return
          } catch (error) {
            retries++
            if (retries === maxRetries) {
              if (axios.isAxiosError(error)) {
                if (error.code === "ECONNABORTED") {
                  throw new Error("Request timed out. Please check your internet connection.")
                } else if (error.response) {
                  throw new Error(`Server responded with ${error.response.status}: ${error.response.data}`)
                } else if (error.request) {
                  throw new Error("No response received from the server. Please try again later.")
                } else {
                  throw new Error("An unexpected error occurred. Please try again.")
                }
              } else {
                throw error
              }
            }
            // Wait for 1 second before retrying
            await new Promise((resolve) => setTimeout(resolve, 1000))
          }
        }
      },

      addHabit: async (habit) => {
        try {
          const response = await axios.post(`${API_URL}/habits`, habit)
          set((state) => ({ habits: [...state.habits, response.data] }))
        } catch (error) {
          handleApiError(error, "Error adding habit")
        }
      },

      toggleCompletion: async (habitId, date) => {
        try {
          await axios.put(`${API_URL}/habits/${habitId}/toggle`, { date })
          set((state) => ({
            habits: state.habits.map((habit) =>
              habit.id === habitId
                ? {
                    ...habit,
                    completedDates: habit.completedDates.includes(date)
                      ? habit.completedDates.filter((d) => d !== date)
                      : [...habit.completedDates, date],
                  }
                : habit,
            ),
          }))
        } catch (error) {
          handleApiError(error, "Error toggling completion")
        }
      },

      deleteHabit: async (habitId) => {
        try {
          await axios.delete(`${API_URL}/habits/${habitId}`)
          set((state) => ({
            habits: state.habits.filter((habit) => habit.id !== habitId),
          }))
        } catch (error) {
          handleApiError(error, "Error deleting habit")
        }
      },

      editHabit: async (habitId, updatedHabit) => {
        try {
          const response = await axios.put(`${API_URL}/habits/${habitId}`, updatedHabit)
          set((state) => ({
            habits: state.habits.map((habit) => (habit.id === habitId ? { ...habit, ...response.data } : habit)),
          }))
        } catch (error) {
          handleApiError(error, "Error updating habit")
          throw error // Re-throw the error so the component can handle it if needed
        }
      },

      fetchJournalEntries: async () => {
        try {
          const response = await axios.get(`${API_URL}/journals`)
          set({ journalEntries: response.data })
        } catch (error) {
          handleApiError(error, "Error fetching journal entries")
          throw error // Re-throw the error so it can be caught in the component
        }
      },

      addJournalEntry: async (entry) => {
        try {
          const response = await axios.post(`${API_URL}/journals`, entry)
          set((state) => ({ journalEntries: [...state.journalEntries, response.data] }))
        } catch (error) {
          handleApiError(error, "Error adding journal entry")
        }
      },

      editJournalEntry: async (id, content, mood, savedReflection) => {
        try {
          const response = await axios.put(`${API_URL}/journals/${id}`, { content, mood, savedReflection })
          set((state) => ({
            journalEntries: state.journalEntries.map((entry) =>
              entry.id === id ? { ...entry, ...response.data } : entry,
            ),
          }))
        } catch (error) {
          handleApiError(error, "Error updating journal entry")
        }
      },

      deleteJournalEntry: async (id) => {
        try {
          await axios.delete(`${API_URL}/journals/${id}`)
          set((state) => ({
            journalEntries: state.journalEntries.filter((entry) => entry.id !== id),
          }))
        } catch (error) {
          handleApiError(error, "Error deleting journal entry")
        }
      },

      getHabitStats: (habitId) => {
        const habit = get().habits.find((h) => h.id === habitId)
        if (!habit) return { completed: 0, total: 0, percentage: 0, streak: 0 }

        const currentDate = new Date(get().currentDate)
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

        const completed = habit.completedDates.filter((date) => {
          const completedDate = new Date(date)
          return completedDate >= startOfMonth && completedDate <= endOfMonth
        }).length

        const total = habit.frequency === "daily" ? endOfMonth.getDate() : habit.frequency === "weekly" ? 4 : 1
        const percentage = Math.round((completed / total) * 100)

        // Calculate streak
        const sortedDates = habit.completedDates.map((date) => new Date(date)).sort((a, b) => b.getTime() - a.getTime())

        let streak = 0
        let currentStreak = 0
        let previousDate: Date | null = null

        for (const date of sortedDates) {
          if (!previousDate || (previousDate.getTime() - date.getTime()) / (1000 * 3600 * 24) === 1) {
            currentStreak++
          } else {
            if (currentStreak > streak) {
              streak = currentStreak
            }
            currentStreak = 1
          }
          previousDate = date
        }

        if (currentStreak > streak) {
          streak = currentStreak
        }

        return { completed, total, percentage, streak }
      },

      setCurrentDate: (date: Date) => set({ currentDate: new Date(date) }),

      getHabitsByCategory: () => {
        const habits = get().habits
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
      },

      getJournalEntry: (date) => {
        const entries = get().journalEntries
        return entries.find((entry) => entry.date === date)
      },

      getAllJournalEntries: () => {
        return get().journalEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      },
      saveReflection: async (id, reflection) => {
        try {
          const response = await axios.put(`${API_URL}/journals/${id}/reflection`, { savedReflection: reflection })
          set((state) => ({
            journalEntries: state.journalEntries.map((entry) =>
              entry.id === id ? { ...entry, savedReflection: response.data.savedReflection } : entry,
            ),
          }))
        } catch (error) {
          handleApiError(error, "Error saving reflection")
        }
      },
    }),
    {
      name: "habit-journal-store",
    },
  ),
)

