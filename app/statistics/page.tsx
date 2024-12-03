import HabitStatistics from "@/components/HabitStatistics"

export default function StatisticsPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Habit Statistics</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Visualize your progress and gain insights into your habit-forming journey.
        </p>
      </div>
      <HabitStatistics />
    </div>
  )
}

