import SiteFooter from "@/components/site/site-footer";
import SiteHeader from "@/components/site/site-header";
import { Outlet } from "react-router-dom";


export default function SiteLayout() {
  return (
    <>
     <SiteHeader />
     <Outlet />
     <SiteFooter />
    </>
  )
}
