"use client"

import React, { useState } from "react"
import { useHabitStore } from "@/store/useHabitStore"
import JournalModal from "@/components/JournalModal"
import { Edit2, Plus, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/DatePicker"

const MOOD_EMOJIS = {
  great: "😄",
  good: "🙂",
  neutral: "😐",
  bad: "😕",
  terrible: "😢",
}

export default function JournalPage() {
  const { getAllJournalEntries } = useHabitStore()
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null)
  const [isNewEntryModalOpen, setIsNewEntryModalOpen] = useState(false)
  const [newEntryDate, setNewEntryDate] = useState<Date | undefined>(new Date())

  const allEntries = getAllJournalEntries()

  const handleEntryClick = (date: string) => {
    setSelectedEntry(date)
  }

  const handleCloseModal = () => {
    setSelectedEntry(null)
    setIsNewEntryModalOpen(false)
  }

  const handleNewEntry = () => {
    setIsNewEntryModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Journal Entries</h1>
        <div className="flex items-center space-x-2">
          <DatePicker date={newEntryDate} onDateChange={setNewEntryDate} />
          <Button onClick={handleNewEntry} className="bg-blue-500 hover:bg-blue-600 text-white">
            <Plus className="w-5 h-5 mr-2" />
            New Entry
          </Button>
        </div>
      </div>

      {allEntries.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No journal entries yet.</p>
      ) : (
        <div className="space-y-4">
          {allEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              onClick={() => handleEntryClick(entry.date)}
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold">
                  {new Date(entry.date).toLocaleDateString("default", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h2>
                <div className="flex items-center">
                  {entry.mood && (
                    <span className="text-2xl mr-2" title={`Mood: ${entry.mood}`}>
                      {MOOD_EMOJIS[entry.mood as keyof typeof MOOD_EMOJIS]}
                    </span>
                  )}
                  <Edit2 className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 line-clamp-2">{entry.content}</p>
            </div>
          ))}
        </div>
      )}

      <JournalModal isOpen={selectedEntry !== null} onClose={handleCloseModal} date={selectedEntry || ""} />

      <JournalModal isOpen={isNewEntryModalOpen} onClose={handleCloseModal} date={newEntryDate || new Date()} />
    </div>
  )
}

