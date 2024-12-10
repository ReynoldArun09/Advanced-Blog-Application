
const navLinks = [
    'Featured Blogs',
    'Most viewed',
    'Readers Choice',
    'Forum',
    'Support',
    'Recent Posts',
    'Privacy Policy',
    'About Us',
    'Terms & Conditions',
    'Terms of Service'
]

export default function SiteFooter() {
  return (
   <footer className="border-t-[1px] py-4">
    <div className="flex flex-col container mx-auto space-y-3 items-center text-center justify-center">
        <ul className="flex flex-wrap cursor-pointer gap-x-4 mx-2">
            {navLinks.map((link, index) => (
                <li key={index}>{link}</li>
            ))}
        </ul>
        <p>
            &copy; All rights reserved 2024
        </p>
    </div>
   </footer>
  )
}
