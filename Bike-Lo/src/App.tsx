import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './hooks/use-theme'
import { BackgroundComponents } from './components/ui/background-components'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Bikes from './pages/Bikes'
import Buy from './pages/Buy'
import Sell from './pages/Sell'
import Service from './pages/Service'
import Parts from './pages/Parts'
import About from './pages/About'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <BackgroundComponents>
        <Navbar />
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bikes" element={<Bikes />} />
            <Route path="/buy" element={<Buy />} />
            <Route path="/sell" element={<Sell />} />
            <Route path="/service" element={<Service />} />
            <Route path="/parts" element={<Parts />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </BackgroundComponents>
    </ThemeProvider>
  )
}

export default App
