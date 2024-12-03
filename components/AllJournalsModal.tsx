"use client"

import React, { useState } from "react"
import { X, Edit2 } from "lucide-react"
import { useHabitStore } from "@/store/useHabitStore"
import JournalModal from "./JournalModal"
import { Button } from "@/components/ui/button"

type AllJournalsModalProps = {
  isOpen: boolean
  onClose: () => void
}

const MOOD_EMOJIS = {
  great: "😄",
  good: "🙂",
  neutral: "😐",
  bad: "😕",
  terrible: "😢",
}

const AllJournalsModal = ({ isOpen, onClose }: AllJournalsModalProps) => {
  const { getAllJournalEntries } = useHabitStore()
  const [editingEntry, setEditingEntry] = useState<string | null>(null)

  const allEntries = getAllJournalEntries()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl p-4 md:p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6">All Journal Entries</h2>

        {allEntries.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No journal entries yet.</p>
        ) : (
          <div className="space-y-6">
            {allEntries.map((entry) => (
              <div key={entry.id} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">
                    {new Date(entry.date).toLocaleDateString("default", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </h3>
                  <Button
                    onClick={() => setEditingEntry(entry.date)}
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Edit2 size={18} />
                  </Button>
                </div>
                {entry.mood && (
                  <p className="text-2xl mb-2">Mood: {MOOD_EMOJIS[entry.mood as keyof typeof MOOD_EMOJIS]}</p>
                )}
                <p className="text-gray-700 dark:text-gray-300 mb-4">{entry.content}</p>
                {entry.savedReflection && (
                  <div className="mt-4 p-3 bg-white dark:bg-gray-600 rounded-lg">
                    <h4 className="text-md font-semibold mb-2">Reflection</h4>
                    <p className="text-gray-600 dark:text-gray-300">{entry.savedReflection}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {editingEntry && <JournalModal isOpen={true} onClose={() => setEditingEntry(null)} date={editingEntry} />}
    </div>
  )
}

export default AllJournalsModal

