
import { AboutUs } from "@/app/aboutUs/aboutus"
import PublicNav from "@/components/navs/PublicNav";

export default function AcercaDePage() {
  return (
    <div>
      <PublicNav/>
      <main className="pt-16">
        <AboutUs/>
      </main>
    </div>
  )
}

