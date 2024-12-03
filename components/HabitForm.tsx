"use client"

import React from "react"
import { X, Plus } from "lucide-react"
import { useHabitStore } from "@/store/useHabitStore"

type Habit = {
  id: string
  name: string
  description: string
  goal: number
  frequency: "daily" | "weekly" | "monthly"
  color: string
  category: string
  completedDates: string[]
}

type HabitFormProps = {
  isOpen: boolean
  onClose: () => void
  habitToEdit?: Habit
}

const HabitForm = ({ isOpen, onClose, habitToEdit }: HabitFormProps) => {
  const [formData, setFormData] = React.useState<Habit>({
    id: "",
    name: "",
    description: "",
    goal: 1,
    frequency: "daily",
    color: "#3B82F6",
    category: "", // Updated initial state
    completedDates: [],
  })

  React.useEffect(() => {
    if (habitToEdit) {
      setFormData({
        ...habitToEdit,
        goal: habitToEdit.goal || 1,
        frequency: habitToEdit.frequency || "daily",
        color: habitToEdit.color || "#3B82F6",
      })
    } else {
      setFormData({
        id: "",
        name: "",
        description: "",
        goal: 1,
        frequency: "daily",
        color: "#3B82F6",
        category: "", // Updated initial state
        completedDates: [],
      })
    }
  }, [habitToEdit])

  const addHabit = useHabitStore((state) => state.addHabit)
  const editHabit = useHabitStore((state) => state.editHabit)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (habitToEdit) {
      editHabit(habitToEdit.id, formData)
    } else {
      addHabit(formData)
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-4 md:p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-4">{habitToEdit ? "Edit Habit" : "Create New Habit"}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="habit-name" className="block text-sm font-medium mb-1">
              Habit Name
            </label>
            <input
              id="habit-name"
              type="text"
              required
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder="e.g., Reading"
            />
          </div>

          <div>
            <label htmlFor="habit-description" className="block text-sm font-medium mb-1">
              Description (Optional)
            </label>
            <textarea
              id="habit-description"
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder="Add some details about your habit..."
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="habit-goal" className="block text-sm font-medium mb-1">
              Daily Goal
            </label>
            <input
              id="habit-goal"
              type="number"
              min="1"
              required
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: Number(e.target.value) })}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label htmlFor="habit-frequency" className="block text-sm font-medium mb-1">
              Frequency
            </label>
            <select
              id="habit-frequency"
              value={formData.frequency}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  frequency: e.target.value as "daily" | "weekly" | "monthly",
                })
              }
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label htmlFor="habit-color" className="block text-sm font-medium mb-1">
              Color
            </label>
            <div className="flex items-center">
              <input
                id="habit-color"
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-12 h-12 p-1 border rounded-lg mr-2"
              />
              <span className="text-sm">{formData.color}</span>
            </div>
          </div>

          <div>
            <label htmlFor="habit-category" className="block text-sm font-medium mb-1">
              Category
            </label>
            <select
              id="habit-category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Select a category</option>
              <option value="Health">Health</option>
              <option value="Productivity">Productivity</option>
              <option value="Personal Development">Personal Development</option>
              <option value="Fitness">Fitness</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            {habitToEdit ? "Update Habit" : "Create Habit"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default HabitForm

