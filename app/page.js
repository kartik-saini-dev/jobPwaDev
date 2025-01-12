import Banner from "@/components/Landing/banner"
import AboutUs from "@/components/Landing/About"
import Services from "@/components/Landing/services"
import Pricing from "@/components/Landing/pricing"
import ContactUs from "@/components/Landing/contactUs"
import Footer from "@/components/Landing/footer"
export default function Home() {
 // Dependency array includes setPageLevelLoader

  return (
    <div >
          <Banner />
          <AboutUs />
          <Services />
          <Pricing />
          <ContactUs />
          <Footer />
    </div>
  );
}
