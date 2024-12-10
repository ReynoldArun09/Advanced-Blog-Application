import { NotebookIcon } from "lucide-react";
import { Link } from "react-router-dom";


export default function SiteLogo() {
  return (
    <Link to="/">
        <h1 className="font-bold flex items-center gap-2">
            <NotebookIcon />
            <span className="text-md">Blogs</span>
            <span className="sr-only">blog icon</span>
        </h1>
    </Link>
  )
}
