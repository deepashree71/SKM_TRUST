import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { LangProvider } from './context/LangContext'
import Layout from './components/layout/Layout'
import Home from './pages/Home/Home'
import About from './pages/About/About'
import Programs from './pages/Programs/Programs'
import Events from './pages/Events/Events'
import Volunteer from './pages/Volunteer/Volunteer'
import Donate from './pages/Donate/Donate'
import Gallery from './pages/Gallery/Gallery'
import Stories from './pages/Stories/Stories'
import Transparency from './pages/Transparency/Transparency'
import Contact from './pages/Contact/Contact'
import ImpactMap from './pages/ImpactMap/ImpactMap'
import Dashboard from './pages/Dashboard/Dashboard'
import GenerateID from './pages/GenerateID/GenerateID'
import VerifyCertificate from './pages/Verify/VerifyCertificate'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30000 } },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LangProvider>
        <AuthProvider>
          <BrowserRouter>
            <Toaster position="top-right" />
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="programs" element={<Programs />} />
                <Route path="events" element={<Events />} />
                <Route path="volunteer" element={<Volunteer />} />
                <Route path="donate" element={<Donate />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="stories" element={<Stories />} />
                <Route path="transparency" element={<Transparency />} />
                <Route path="contact" element={<Contact />} />
                <Route path="impact-map" element={<ImpactMap />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="generate-id" element={<GenerateID />} />
                <Route path="verify/:token" element={<VerifyCertificate />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LangProvider>
    </QueryClientProvider>
  )
}
