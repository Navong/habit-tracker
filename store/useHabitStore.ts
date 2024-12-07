import { create } from "zustand"
import { persist } from "zustand/middleware"
import { toast } from "sonner"

interface JournalEntry {
  id: string
  date: string
  content: string
  mood?: "great" | "good" | "neutral" | "bad" | "terrible"
  savedReflection?: string
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

interface Mood {
  date: string
  mood: "great" | "good" | "neutral" | "bad" | "terrible"
}

interface HabitStore {
  habits: Habit[]
  journalEntries: JournalEntry[]
  moods: Mood[]
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
  saveReflection: (id: string, reflection: string) => Promise<void>
  setMood: (date: string, mood: Mood["mood"]) => void
  getMood: (date: string) => Mood["mood"] | undefined
}

const API_URL = "/api"

export const useHabitStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      habits: [],
      journalEntries: [],
      moods: [],
      currentDate: new Date(),

      fetchHabits: async () => {
        try {
          const response = await fetch(`${API_URL}/habits`)
          if (!response.ok) {
            throw new Error("Error fetching habits")
          }
          const data = await response.json()
          set({ habits: data })
        } catch (error) {
          console.error("Error fetching habits:", error)
          throw error
        }
      },

      addHabit: async (habit) => {
        const newHabit = { ...habit, id: Date.now().toString(), completedDates: [] }
        set((state) => ({ habits: [...state.habits, newHabit] }))

        const toastId = toast.loading("Adding habit...")

        try {
          const response = await fetch(`${API_URL}/habits`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(habit),
          })
          if (!response.ok) {
            throw new Error("Error adding habit")
          }
          const savedHabit = await response.json()
          set((state) => ({
            habits: state.habits.map((h) => (h.id === newHabit.id ? savedHabit : h)),
          }))
          toast.success("Habit added successfully", { id: toastId })
        } catch (error) {
          console.error("Error adding habit:", error)
          set((state) => ({
            habits: state.habits.filter((h) => h.id !== newHabit.id),
          }))
          toast.error("Failed to add habit", { id: toastId })
          throw error
        }
      },

      toggleCompletion: async (habitId, date) => {
        const originalHabits = get().habits
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

        const toastId = toast.loading("Updating habit...")

        try {
          const response = await fetch(`${API_URL}/habits/${habitId}/toggle`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ date }),
          })
          if (!response.ok) {
            throw new Error("Error toggling habit completion")
          }
          toast.success("Habit updated successfully", { id: toastId })
        } catch (error) {
          console.error("Error toggling completion:", error)
          set({ habits: originalHabits })
          toast.error("Failed to update habit", { id: toastId })
          throw error
        }
      },

      deleteHabit: async (habitId) => {
        const originalHabits = get().habits
        set((state) => ({
          habits: state.habits.filter((habit) => habit.id !== habitId),
        }))

        const toastId = toast.loading("Deleting habit...")

        try {
          const response = await fetch(`${API_URL}/habits/${habitId}`, {
            method: "DELETE",
          })
          if (!response.ok) {
            throw new Error("Error deleting habit")
          }
          toast.success("Habit deleted successfully", { id: toastId })
        } catch (error) {
          console.error("Error deleting habit:", error)
          set({ habits: originalHabits })
          toast.error("Failed to delete habit", { id: toastId })
          throw error
        }
      },

      editHabit: async (habitId, updatedHabit) => {
        const originalHabits = get().habits
        set((state) => ({
          habits: state.habits.map((habit) => (habit.id === habitId ? { ...habit, ...updatedHabit } : habit)),
        }))

        const toastId = toast.loading("Updating habit...")

        try {
          const response = await fetch(`${API_URL}/habits/${habitId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedHabit),
          })
          if (!response.ok) {
            throw new Error("Error updating habit")
          }
          const data = await response.json()
          set((state) => ({
            habits: state.habits.map((habit) => (habit.id === habitId ? { ...habit, ...data } : habit)),
          }))
          toast.success("Habit updated successfully", { id: toastId })
        } catch (error) {
          console.error("Error updating habit:", error)
          set({ habits: originalHabits })
          toast.error("Failed to update habit", { id: toastId })
          throw error
        }
      },

      fetchJournalEntries: async () => {
        try {
          const response = await fetch(`${API_URL}/journals`)
          if (!response.ok) {
            throw new Error("Error fetching journal entries")
          }
          const data = await response.json()
          set({ journalEntries: data })
        } catch (error) {
          console.error("Error fetching journal entries:", error)
          throw error
        }
      },

      addJournalEntry: async (entry) => {
        const newEntry = { ...entry, id: Date.now().toString() }
        set((state) => ({ journalEntries: [...state.journalEntries, newEntry] }))

        const toastId = toast.loading("Adding journal entry...")

        try {
          const response = await fetch(`${API_URL}/journals`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(entry),
          })
          if (!response.ok) {
            throw new Error("Error adding journal entry")
          }
          const savedEntry = await response.json()
          set((state) => ({
            journalEntries: state.journalEntries.map((e) => (e.id === newEntry.id ? savedEntry : e)),
          }))
          toast.success("Journal entry added successfully", { id: toastId })
        } catch (error) {
          console.error("Error adding journal entry:", error)
          set((state) => ({
            journalEntries: state.journalEntries.filter((e) => e.id !== newEntry.id),
          }))
          toast.error("Failed to add journal entry", { id: toastId })
          throw error
        }
      },

      editJournalEntry: async (id, content, mood, savedReflection) => {
        const originalEntries = get().journalEntries
        set((state) => ({
          journalEntries: state.journalEntries.map((entry) =>
            entry.id === id ? { ...entry, content, mood, savedReflection } : entry,
          ),
        }))

        const toastId = toast.loading("Updating journal entry...")

        try {
          const response = await fetch(`${API_URL}/journals/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content, mood, savedReflection }),
          })
          if (!response.ok) {
            throw new Error("Error updating journal entry")
          }
          const updatedEntry = await response.json()
          set((state) => ({
            journalEntries: state.journalEntries.map((entry) =>
              entry.id === id ? { ...entry, ...updatedEntry } : entry,
            ),
          }))
          toast.success("Journal entry updated successfully", { id: toastId })
        } catch (error) {
          console.error("Error updating journal entry:", error)
          set({ journalEntries: originalEntries })
          toast.error("Failed to update journal entry", { id: toastId })
          throw error
        }
      },

      deleteJournalEntry: async (id) => {
        const originalEntries = get().journalEntries
        set((state) => ({
          journalEntries: state.journalEntries.filter((entry) => entry.id !== id),
        }))

        const toastId = toast.loading("Deleting journal entry...")

        try {
          const response = await fetch(`${API_URL}/journals/${id}`, {
            method: "DELETE",
          })
          if (!response.ok) {
            throw new Error("Error deleting journal entry")
          }
          toast.success("Journal entry deleted successfully", { id: toastId })
        } catch (error) {
          console.error("Error deleting journal entry:", error)
          set({ journalEntries: originalEntries })
          toast.error("Failed to delete journal entry", { id: toastId })
          throw error
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
        const originalEntries = get().journalEntries
        set((state) => ({
          journalEntries: state.journalEntries.map((entry) =>
            entry.id === id ? { ...entry, savedReflection: reflection } : entry,
          ),
        }))

        const toastId = toast.loading("Saving reflection...")

        try {
          const response = await fetch(`${API_URL}/journals/${id}/reflection`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ savedReflection: reflection }),
          })
          if (!response.ok) {
            throw new Error("Error saving reflection")
          }
          const data = await response.json()
          set((state) => ({
            journalEntries: state.journalEntries.map((entry) =>
              entry.id === id ? { ...entry, savedReflection: data.savedReflection } : entry,
            ),
          }))
          toast.success("Reflection saved successfully", { id: toastId })
        } catch (error) {
          console.error("Error saving reflection:", error)
          set({ journalEntries: originalEntries })
          toast.error("Failed to save reflection", { id: toastId })
          throw error
        }
      },

      setMood: (date, mood) => {
        set((state) => {
          const existingMoodIndex = state.moods.findIndex((m) => m.date === date)
          if (existingMoodIndex !== -1) {
            const newMoods = [...state.moods]
            newMoods[existingMoodIndex] = { date, mood }
            return { moods: newMoods }
          } else {
            return { moods: [...state.moods, { date, mood }] }
          }
        })
      },

      getMood: (date) => {
        const mood = get().moods.find((m) => m.date === date)
        return mood ? mood.mood : undefined
      },
    }),
    {
      name: "habit-store",
    },
  ),
)

