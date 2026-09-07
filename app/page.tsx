import Hero from '../components/Hero'
import About from '../components/About'
import Partners from '../components/Partners'
import Events from '../components/Events'
import Newsletter from '../components/Newsletter'
import DataBridge from '../components/DataBridge'
import Team from '../components/Team'
import Footer from '../components/Footer'

export default function HomePage() {
  return (
    <>
      {/* Hero section with navbar overlay */}
      <Hero />

      {/* About section */}
      <About />

      {/* Partners section */}
      <Partners />

      {/* Byte Consulting (DataBridge) section */}
      <DataBridge />

      {/* Events section */}
      <Events />

      {/* Newsletter section */}
      <Newsletter />

      {/* Team section */}
      <Team />

      {/* Footer */}
      <Footer />
    </>
  )
}
