import LoadingSpinner from "@/components/loading-spinner";
import SinglePost from "@/components/site/single-post";
import BlogsSkeleton from "@/components/skeletons/blogs-skeleton";
import { useFetchBlogsQuery } from "@/services/queries";
import { useEffect, useRef, Fragment } from "react";
import { Link } from "react-router-dom";

export default function AllBlogsPosts() {
  const {
    data: posts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useFetchBlogsQuery();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <section className="container mx-auto items-center py-5">
          {[...Array(5)].map((_, i: number) => (
            <BlogsSkeleton key={i} />
          ))}
      </section>
    );
  }

  return (
   <section className="container mx-auto items-center">
     <h1 className="text-3xl font-bold py-1">All Posts</h1>
     <div className="py-5 min-h-screen">
        {posts?.pages.map((page, index: number) => (
          <Fragment key={index}>
            {page?.data.map((post) => (
              <Link key={post._id} to={`/post/${post._id}`}>
                <SinglePost page={post} key={post._id} />
              </Link>
            ))}
          </Fragment>
        ))}
      <div ref={loadMoreRef}>{isFetchingNextPage && <LoadingSpinner />}</div>
    </div>
   </section>
  );
}
