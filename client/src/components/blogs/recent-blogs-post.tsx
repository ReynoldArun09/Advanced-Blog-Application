import { useRecentBlogsQuery } from "@/services/queries"
import { Link } from "react-router-dom"
import RecentPost from "./recent-post"


export default function RecentBlogsPosts() {
  const {data: posts, isLoading} = useRecentBlogsQuery()

  console.log(posts)

  return (
   <section className="container mx-auto py-5">
     <h1 className="text-3xl font-bold py-1">Recent Posts</h1>
     <div className="grid grid-cols-1 grid-rows-3 gap-5 lg:grid-cols-2">
        {posts?.map((post, index:number) => (
            <Link to="/" key={index} className={index === 0 ? 'row-span-3' : ''}>
                <RecentPost post={post} index={index}/>
            </Link>
        ))}
    </div>
   </section>
)}
