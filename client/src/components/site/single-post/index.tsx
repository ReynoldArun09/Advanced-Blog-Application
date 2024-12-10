import { Badge } from "@/components/ui/badge"
import { Blogs } from "@/services/types"

interface SinglePostProps {
    page: Blogs
}

export default function SinglePost({page: {title, desc, image, username, updatedAt, categories}}: SinglePostProps) {
  return (
    <section className="flex flex-col md:flex-row gap-20 py-4">
    <div className="w-[400px] h-[300px] flex-1">
        <img src={image || '/cat.jpg'} alt={title} className="w-full h-full object-cover"/>
    </div>
    <div className="py-3 space-y-5 flex-1">
        <h1 className="text-3xl font-bold capitalize">{title}</h1>
        <div className="flex items-center gap-5">
            <h2>Posted by : <span className="font-bold capitalize">{username}</span></h2>
            <div className="md:flex gap-4">
             <p>{new Date(updatedAt).toString().slice(0, 15)}</p>
             <p>{new Date(updatedAt).toString().slice(16, 24)}</p>
            </div>
        </div>
        <div>
           <p className="text-md">{desc.toString().slice(0, 350)}</p>
        </div>
        <div className="flex gap-2">
            {categories.map((category, index) => (
                <Badge key={index}>{category}</Badge>
            ))}
        </div>
    </div>
</section>
  )
}
