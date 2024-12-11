import { CommentResponse } from "@/services/types"
import { DeleteIcon } from "lucide-react"

interface CommentProps {
    data: CommentResponse
}

export default function Comments({ data: { username, updatedAt, comment } }: CommentProps) {
    const isAuth = false
    return (
        <section>
            <div className="flex justify-between items-center">
                <h1 className="font-bold">{username}</h1>
                <div className="flex gap-3">
                    <p>{new Date(updatedAt!).toString().slice(0, 15)}</p>
                    <p>{new Date(updatedAt!).toString().slice(16, 24)}</p>
                    {isAuth && (<DeleteIcon />)}
                </div>
            </div>
            <p>{comment}</p>
        </section>
    )
}
