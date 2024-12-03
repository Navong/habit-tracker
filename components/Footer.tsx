import { Heart } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-card text-card-foreground shadow-md mt-8 dark:bg-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Habit Tracker. All rights reserved.
          </p>
          <div className="flex items-center mt-2 sm:mt-0">
            <span className="text-muted-foreground text-sm mr-2">Made with</span>
            <Heart className="w-4 h-4 text-destructive" />
            <span className="text-muted-foreground text-sm ml-2">by Navong</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

