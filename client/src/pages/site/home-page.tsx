import AllBlogsPosts from "@/components/blogs/all-blogs-posts";
import RecentBlogsPosts from "@/components/blogs/recent-blogs-post";


export default function HomePage() {
  return (
    <section>
        <RecentBlogsPosts />
        <AllBlogsPosts />
    </section>
  )
}
