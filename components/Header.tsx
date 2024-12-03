import Link from "next/link"
import { Home, BarChart2, Book, Settings } from "lucide-react"
import { ModeToggle } from "./ModeToggle"

const Header = () => {
    return (
        <header className="bg-white dark:bg-gray-800 shadow-md">
            <div className="container mx-auto px-4 py-4">
                <nav className="flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        Habit Tracker
                    </Link>
                    <ul className="flex space-x-4 items-center">
                        <li>
                            <Link
                                href="/"
                                className="flex items-center text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                            >
                                <Home className="w-5 h-5 mr-1" />
                                <span className="hidden sm:inline">Home</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/statistics"
                                className="flex items-center text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                            >
                                <BarChart2 className="w-5 h-5 mr-1" />
                                <span className="hidden sm:inline">Statistics</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/journal"
                                className="flex items-center text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                            >
                                <Book className="w-5 h-5 mr-1" />
                                <span className="hidden sm:inline">Journal</span>
                            </Link>
                        </li>
                        <li>
                            <ModeToggle />
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Header

