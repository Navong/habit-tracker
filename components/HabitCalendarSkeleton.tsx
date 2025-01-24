import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"

const HabitCalendarSkeleton = () => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
  const daysToShow = isMobile ? 7 : 20

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 md:p-6">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" disabled>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Skeleton className="h-6 w-40" />
              <Button variant="outline" size="icon" disabled>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="lg" disabled>
                <Calendar className="w-4 h-4 mr-2" />
                Today
              </Button>
            </div>
          </div>
        </div>

        {/* Calendar Grid Skeleton */}
        {isMobile ? (
          <div className="space-y-4">
            {[1, 2, 3].map((habit) => (
              <div key={habit} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-center mb-6">
                  <Skeleton className="h-6 w-40" />
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
                <div className="flex justify-between">
                  {[...Array(daysToShow)].map((_, index) => (
                    <Skeleton key={index} className="w-8 h-8 rounded-md" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-left min-w-[120px]">
                    <Skeleton className="h-6 w-20" />
                  </th>
                  {[...Array(daysToShow)].map((_, index) => (
                    <th key={index} className="p-2 text-center w-16">
                      <Skeleton className="h-12 w-full" />
                    </th>
                  ))}
                  <th className="p-2 text-center">
                    <Skeleton className="h-6 w-20 mx-auto" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map((habit) => (
                  <tr key={habit} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="p-2 text-left">
                      <Skeleton className="h-6 w-40" />
                    </td>
                    {[...Array(daysToShow)].map((_, index) => (
                      <td key={index} className="p-2 text-center">
                        <Skeleton className="w-6 h-6 rounded-md mx-auto" />
                      </td>
                    ))}
                    <td className="p-2 text-center space-y-2">
                      <Skeleton className="h-10 w-20 mx-auto" />
                      <Skeleton className="h-10 w-20 mx-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* New Habit Button Skeleton */}
        <Skeleton className="m-2 h-10 w-30" />
      </div>
    </div>
  )
}

export default HabitCalendarSkeleton