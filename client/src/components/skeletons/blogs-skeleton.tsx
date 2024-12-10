import { Skeleton } from "../ui/skeleton";


export default function BlogsSkeleton() {
  return (
    <div className="flex flex-col md:flex-row w-full gap-24 my-5">
    <div className="w-[40%]">
      <Skeleton className="h-[250px]" />
    </div>
    <div className="w-[55%]">
      <Skeleton className="h-[30px]" />
      <div className="flex py-4 justify-between items-center">
        <Skeleton className="w-[150px] h-[20px]" />
        <div className="flex gap-5">
          <Skeleton className="w-[100px] h-[20px]" />
          <Skeleton className="w-[100px] h-[20px]" />
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-[30px]" />
        <Skeleton className="h-[30px]" />
        <Skeleton className="h-[30px]" />
        <Skeleton className="h-[30px]" />
      </div>
    </div>
  </div>
  )
}
