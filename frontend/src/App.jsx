import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import SnsCarousel from './components/SnsCarousel'
import StoreInfo from './components/StoreInfo'
import Footer from './components/Footer'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'
import PrivateRoute from './admin/PrivateRoute'

function HomePage() {
  return (
    <div className="min-h-screen bg-cream-50">
      <Header />
      <main>
        <Hero />
        <About />
        <SnsCarousel />
        <StoreInfo />
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
