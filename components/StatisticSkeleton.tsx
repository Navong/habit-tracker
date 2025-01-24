import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"

export default function HabitStatisticsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Completion Rates Chart Skeleton */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="w-full h-[300px]" />
        </div>

        {/* Longest Streaks Chart Skeleton */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="w-full h-[300px]" />
        </div>

        {/* Habit Distribution Chart Skeleton */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="w-full h-[300px]" />
        </div>

        {/* Detailed Habit Statistics Skeleton */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg space-y-2">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-2 w-full h-2.5 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}