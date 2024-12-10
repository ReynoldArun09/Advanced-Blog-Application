import SiteAuthButtons from "./site-authbuttons";
import SiteLogo from "./site-logo";
import SiteSeachBar from "./site-searchbar";


export default function SiteHeader() {
  return (
    <header className="border-b-[1px]">
        <div className="flex justify-between items-center container mx-auto h-14">
            <SiteLogo />
            <SiteSeachBar />
            <SiteAuthButtons />
        </div>
    </header>
  )
}
