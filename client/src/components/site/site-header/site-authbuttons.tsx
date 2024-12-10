import { Button, buttonVariants } from "@/components/ui/button"
import { useSignOutUserMutation } from "@/services/mutations"
import { Link } from "react-router-dom"


export default function SiteAuthButtons() {
  const isAuth = false
  const {mutate, isPending} = useSignOutUserMutation()
  const handleSignOut = () => {
    mutate()
  }

  return (
    <div>
        {isAuth && (
            <div className="flex gap-4">
                <Link to="/create-post" className={buttonVariants({variant: 'outline'})}>
                    Create post
                </Link>
                <Button onClick={handleSignOut} disabled={isPending}>Sign out</Button>
            </div>
        )}
        {!isAuth && (
            <div className="flex items-center gap-3">
                <Link to="/signin" className={buttonVariants({variant: 'default'})}>
                    Sign In
                </Link>
                <Link to="/signup" className={buttonVariants({variant: 'outline'})}>
                    Sign up
                </Link>
            </div>
        )}
    </div>
  )
}
