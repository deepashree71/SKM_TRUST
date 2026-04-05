import HeroSection from '../../components/sections/HeroSection'
import QuickAccess from '../../components/sections/QuickAccess'
import AboutNewsSection from '../../components/sections/AboutNewsSection'
import GalleryPreview from '../../components/sections/GalleryPreview'
import CampaignSection from '../../components/sections/CampaignSection'
import GoalsSection from '../../components/sections/GoalsSection'
import CSRSection from '../../components/sections/CSRSection'
import VolunteerBanner from '../../components/sections/VolunteerBanner'
import TestimonialsSection from '../../components/sections/TestimonialsSection'
import ContactSection from '../../components/sections/ContactSection'

export default function Home() {
  return (
    <>
      <HeroSection />
      <QuickAccess />
      <AboutNewsSection />
      <GalleryPreview />
      <CampaignSection />
      <GoalsSection />
      <CSRSection />
      <VolunteerBanner />
      <TestimonialsSection />
      <ContactSection />
    </>
  )
}
