import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import MobileTopNav from './components/MobileTopNav'
import Hero from './components/Hero'
import About from './components/About'
import RecommendSection from './components/RecommendSection'
import SnsCarousel from './components/SnsCarousel'
import VisitSection from './components/VisitSection'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'
import PrivateRoute from './admin/PrivateRoute'

function HomePage() {
  return (
    <div className="bg-cream-50">
      {/* 데스크탑 전용 상단 헤더 (Header.jsx 내부에서도 hidden md:block 처리) */}
      <Header />
      {/*
       * 모바일: mobile-snap-container → 100svh 스크롤 컨테이너 + y 스냅
       * 데스크탑: 클래스 미적용 → 기존 자연스러운 페이지 스크롤
       */}
      <main className="mobile-snap-container min-h-screen">
        <Hero />
        <About />
        <RecommendSection />
        <SnsCarousel />
        <VisitSection />
        <ContactSection />
      </main>
      {/* Footer: 데스크탑에서만 표시 (모바일은 snap 컨테이너 밖에 있어 노출 안 됨) */}
      <div className="hidden md:block">
        <Footer />
      </div>
      {/* 모바일 전용 상단 네비게이션 바 (홈 섹션에서 자동 숨김) */}
      <MobileTopNav />
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
