import PageBanner from '../../components/common/PageBanner'
import ContactSection from '../../components/sections/ContactSection'

export default function Contact() {
  return (
    <>
      <PageBanner title="Contact Us" subtitle="Get in touch with us for any queries, partnerships, or support." breadcrumbs={[{ label: 'Contact' }]} />
      <ContactSection />
    </>
  )
}
