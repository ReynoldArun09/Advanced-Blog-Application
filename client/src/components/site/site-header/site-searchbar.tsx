import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"
import { useLocation } from "react-router-dom"


export default function SiteSeachBar() {
  const location = useLocation()

  if(location.pathname !== "/") return null

  return (
    <div className="flex items-center gap-2 border-2 rounded-full px-2 w-1/3">
        <Input className="outline-none border-none focus:outline-0 focus:border-0 focus-visible:ring-0" type="text" placeholder="Search..." />
        <SearchIcon />
    </div>
  )
}
