import { Blogs } from "@/services/types"
import { Badge } from "../ui/badge"
import { cn } from "@/lib/utils"

interface RecentPostProps {
    post: Blogs,
    index: number
}

export default function RecentPost({post: {updatedAt, username, title, categories, image, desc}, index}: RecentPostProps) {
  console.log(index)
  return (
    <div className={cn(index !== 0 ? 'flex flex-row': '', "gap-5 py-1")}>
       <div>
         <img src={image || "/cat.jpg"} alt={title} className={cn(index !== 0 ? 'w-[300px]' : '',)}/>
       </div>
     <div className="space-y-3">
         <div className="flex items-center gap-4">
            <p className="font-bold capitalize">{username}</p>
            <p className="text-muted-foreground font-semibold">{new Date(updatedAt).toString().slice(4, 15)}</p>
        </div>
        <div className="space-y-3">
            <h1 className="text-2xl font-bold capitalize tracking-wider">{title}</h1>
            <p>{desc}</p>
        </div>
        <div className="flex gap-x-4">
            {categories.map((category, i) => (
                <Badge key={i}>{category}</Badge>
            ))}
        </div>
     </div>
    </div>
  )
}
