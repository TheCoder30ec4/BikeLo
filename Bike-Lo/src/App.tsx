import { Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/hooks/use-theme'
import { AuthProvider } from '@/hooks/use-auth'
import { BackgroundComponents } from '@/components/ui/background-components'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Home from '@/pages/Home'
import Bikes from '@/pages/Bikes'
import Buy from '@/pages/Buy'
import Sell from '@/pages/Sell'
import Service from '@/pages/Service'
import Parts from '@/pages/Parts'
import About from '@/pages/About'
import Auth from '@/pages/Auth'
import Profile from '@/pages/Profile'
import VerifyOTP from '@/pages/VerifyOTP'
import Admin from '@/pages/Admin'
import AdminAddBike from '@/pages/AdminAddBike'
import AdminUsers from '@/pages/AdminUsers'
import BikeDetails from '@/pages/BikeDetails'
import '@/App.css'
import { ErrorBoundary } from '@/components/ErrorBoundary'

function App() {
  const location = useLocation();
  const hideFooterRoutes = ['/login', '/signup'];
  const shouldShowFooter = !hideFooterRoutes.includes(location.pathname);

  return (
    <ThemeProvider>
      <AuthProvider>
        <BackgroundComponents>
          <Navbar />
          <main className="min-h-screen">
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Auth />} />
                <Route path="/signup" element={<Auth />} />
                <Route path="/verify-otp" element={<VerifyOTP />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/bikes" element={<Bikes />} />
                <Route path="/buy" element={<Buy />} />
                <Route path="/sell" element={<Sell />} />
                <Route path="/service" element={<Service />} />
                <Route path="/parts" element={<Parts />} />
                <Route path="/about" element={<About />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/add-bike" element={<AdminAddBike />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/buy/:id" element={<BikeDetails />} />
              </Routes>
            </ErrorBoundary>
          </main>
          {shouldShowFooter && <Footer />}
          <Toaster position="bottom-right" theme="system" />
        </BackgroundComponents>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
