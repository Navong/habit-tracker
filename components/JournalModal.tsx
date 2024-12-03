"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { useHabitStore } from "@/store/useHabitStore"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

type JournalModalProps = {
  isOpen: boolean
  onClose: () => void
  date: string | Date
}

const MOOD_EMOJIS = {
  great: "😄",
  good: "🙂",
  neutral: "😐",
  bad: "😕",
  terrible: "😢",
}

const JournalModal = ({ isOpen, onClose, date }: JournalModalProps) => {
  const { addJournalEntry, editJournalEntry, deleteJournalEntry, getJournalEntry, saveReflection } = useHabitStore()

  const dateString = typeof date === "string" ? date : date.toISOString().slice(0, 10)

  const [entry, setEntry] = useState(getJournalEntry(dateString))
  const [content, setContent] = useState("")
  const [mood, setMood] = useState<keyof typeof MOOD_EMOJIS | undefined>(undefined)
  const [reflection, setReflection] = useState<string | null>(null)
  const [isReflecting, setIsReflecting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const fetchedEntry = getJournalEntry(dateString)
      setEntry(fetchedEntry)
      setContent(fetchedEntry?.content || "")
      setMood(fetchedEntry?.mood)
      setReflection(fetchedEntry?.savedReflection || null)
    }
  }, [isOpen, dateString, getJournalEntry])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (entry) {
      editJournalEntry(entry.id, content, mood, reflection || undefined)
    } else {
      addJournalEntry({ date: dateString, content, mood })
    }
    onClose()
  }

  const handleDelete = () => {
    if (entry && window.confirm("Are you sure you want to delete this journal entry?")) {
      deleteJournalEntry(entry.id)
      onClose()
    }
  }

  const handleReflect = async () => {
    setIsReflecting(true)
    setReflection(null)

    try {
      const response = await fetch("/api/reflect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate reflection")
      }

      const data = await response.json()
      setReflection(data.reflection)
    } catch (error) {
      console.error("Error generating reflection:", error)
      toast.error("Failed to generate reflection. Please try again.")
    } finally {
      setIsReflecting(false)
    }
  }

  const handleSaveReflection = async () => {
    if (entry && reflection) {
      try {
        await saveReflection(entry.id, reflection)
        toast.success("Reflection saved successfully")
      } catch (error) {
        console.error("Error saving reflection:", error)
        toast.error("Failed to save reflection. Please try again.")
      }
    }
  }

  if (!isOpen) return null

  const formattedDate = new Date(dateString).toLocaleDateString("default", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-6xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-2">Journal Entry</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{formattedDate}</p>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium mb-2">How are you feeling today?</label>
                <div className="flex gap-4">
                  {Object.entries(MOOD_EMOJIS).map(([key, emoji]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setMood(key as keyof typeof MOOD_EMOJIS)}
                      className={`text-2xl p-2 rounded-full transition-transform ${
                        mood === key ? "bg-blue-100 dark:bg-blue-900 scale-125" : "hover:scale-110"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Journal Entry</label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-4 border rounded-lg h-[300px] dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Write your thoughts for the day..."
                />
              </div>

              <div className="flex justify-between">
                {entry && (
                  <Button type="button" onClick={handleDelete} variant="destructive">
                    Delete Entry
                  </Button>
                )}
                <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
                  {entry ? "Update Entry" : "Save Entry"}
                </Button>
              </div>
            </form>
          </div>

          <div className="flex-1 space-y-6">
            <div>
              <Button onClick={handleReflect} disabled={isReflecting || !content} className="w-full">
                {isReflecting ? "Generating Reflection..." : "Generate AI Reflection"}
              </Button>
            </div>

            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 h-[400px] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-2">AI Reflection</h3>
              {reflection ? (
                <>
                  <div
                    className="text-gray-700 dark:text-gray-300 prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: reflection }}
                  />
                  {!entry?.savedReflection && (
                    <Button onClick={handleSaveReflection} className="mt-4">
                      Save This Reflection
                    </Button>
                  )}
                </>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No reflection generated yet. Click the button above to generate one.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JournalModal

