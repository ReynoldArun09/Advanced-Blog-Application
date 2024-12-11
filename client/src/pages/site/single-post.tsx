import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCommentsQuery, useSinglePostQuery } from "@/services/queries";
import { TrashIcon } from "lucide-react";
import { useParams } from "react-router-dom";
import Comments from "./comments";

export default function SinglePost() {
  const { id } = useParams<{ id: string }>();

  const { data: post } = useSinglePostQuery(id as string);
  const { data: comments } = useCommentsQuery(id as string);

  console.log(comments);

  const isAuth = false;

  return (
    <section className="max-w-5xl mx-auto py-10 space-y-3 min-h-screen">
      <div>
        <h1 className="font-bold text-3xl capitalize">{post?.title}</h1>
        <div className="flex items-center justify-between">
          <h2 className="capitalize font-bold">Posted by: {post?.username}</h2>
          <div className="flex gap-3 items-center">
            <p>{new Date(post?.updatedAt as string).toString().slice(0, 15)}</p>
            <p>
              {new Date(post?.updatedAt as string).toString().slice(16, 24)}
            </p>
            {isAuth && <TrashIcon size={20} />}
          </div>
        </div>
      </div>
      <div className="w-full h-[500px]">
        <img
          src={post?.image || "/cat.jpg"}
          alt={post?.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="space-y-5">
        <p>{post?.desc}</p>
        <div className="flex gap-3 items-center">
          {post?.categories.map((category, index) => (
            <Badge key={index}>{category}</Badge>
          ))}
        </div>
      </div>
      <div className="space-y-5 w-2/4">
        <h1>Comments:</h1>
        <div className="flex items-center gap-x-2">
          <Input placeholder="write comment" />
          <Button>Submit</Button>
        </div>
      </div>
      <div>
        <ul className="space-y-3">
          {comments?.map((comment) => (
            <li key={comment._id} className="border-2 p-3 rounded-md">
              <Comments data={comment} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
