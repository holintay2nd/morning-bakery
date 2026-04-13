import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Menu from './components/Menu'
import StoreInfo from './components/StoreInfo'
import Reservation from './components/Reservation'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-cream-50">
      <Header />
      <main>
        <Hero />
        <About />
        <Menu />
        <StoreInfo />
        <Reservation />
      </main>
      <Footer />
    </div>
  )
}
