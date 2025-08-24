'use client'

import React, { useState } from 'react'
import PageTemplate from '../../components/templates/PageTemplate'
import Hero from '../../components/organisms/Hero'
import Card from '../../components/molecules/Card'
import FormGroup from '../../components/molecules/FormGroup'
import Heading from '../../components/atoms/Heading'
import Text from '../../components/atoms/Text'
import Button from '../../components/atoms/Button'
import Icon from '../../components/atoms/Icon'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    enquiryType: '',
    message: '',
    preferredContact: 'email',
    consent: false
  })

  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const handleInputChange = (name: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.name.trim()) {
      errors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (!formData.enquiryType) {
      errors.enquiryType = 'Please select an enquiry type'
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required'
    }

    if (!formData.consent) {
      errors.consent = 'Please agree to our privacy policy'
    }

    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setFormStatus('submitting')
    
    try {
      // In a real application, this would submit to your backend
      await new Promise(resolve => setTimeout(resolve, 2000))
      setFormStatus('success')
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        enquiryType: '',
        message: '',
        preferredContact: 'email',
        consent: false
      })
    } catch {
      setFormStatus('error')
    }
  }

  const contactMethods = [
    {
      icon: 'phone',
      title: 'Call Us',
      detail: '+44 (0)123 456 7890',
      description: 'Monday to Friday, 8:30 AM - 5:30 PM',
      action: 'tel:+441234567890'
    },
    {
      icon: 'email',
      title: 'Email Us',
      detail: 'hello@lightyear-recruitment.com',
      description: 'We typically respond within 2 hours',
      action: 'mailto:hello@lightyear-recruitment.com'
    },
    {
      icon: 'map-pin',
      title: 'Visit Our Office',
      detail: '123 Business Park, Reading, RG1 2AB',
      description: 'By appointment only',
      action: 'https://maps.google.com/?q=123+Business+Park,+Reading,+RG1+2AB'
    },
    {
      icon: 'linkedin',
      title: 'LinkedIn',
      detail: 'Lightyear Recruitment',
      description: 'Connect with us professionally',
      action: 'https://www.linkedin.com/company/lightyear-recruitment'
    }
  ]

  const openingHours = [
    { day: 'Monday', hours: '8:30 AM - 5:30 PM' },
    { day: 'Tuesday', hours: '8:30 AM - 5:30 PM' },
    { day: 'Wednesday', hours: '8:30 AM - 5:30 PM' },
    { day: 'Thursday', hours: '8:30 AM - 5:30 PM' },
    { day: 'Friday', hours: '8:30 AM - 5:30 PM' },
    { day: 'Saturday', hours: 'Closed' },
    { day: 'Sunday', hours: 'Closed' }
  ]

  const faqs = [
    {
      question: 'How quickly can you fill a position?',
      answer: 'For temporary roles, we can often provide candidates within 24-48 hours. Permanent positions typically take 1-2 weeks from briefing to placement.'
    },
    {
      question: 'Do you charge fees to job seekers?',
      answer: 'No, never. Our service is completely free for all job seekers. We are paid by the employers who hire our candidates.'
    },
    {
      question: 'What areas do you cover?',
      answer: 'We primarily serve Berkshire including Reading, Slough, Windsor, Bracknell, Maidenhead, and Newbury, with some opportunities in surrounding counties.'
    },
    {
      question: 'Can I register for jobs online?',
      answer: 'Yes, you can register through our online portal. However, we recommend a follow-up call to discuss your requirements in detail.'
    }
  ]

  return (
    <PageTemplate
      variant="default"
      title="Contact Lightyear Recruitment - Warehouse & Logistics Jobs Berkshire"
      description="Get in touch with Lightyear Recruitment. Call +44 (0)123 456 7890, email hello@lightyear-recruitment.com, or use our contact form. Office in Reading, Berkshire."
      keywords="contact lightyear recruitment, warehouse jobs enquiry, logistics recruitment contact, reading recruitment agency, berkshire staffing contact"
      openGraph={{
        title: 'Contact Lightyear Recruitment | Warehouse & Logistics Jobs',
        description: 'Get in touch about warehouse and logistics opportunities in Berkshire. Quick response times and personal service guaranteed.',
        image: '/images/og-contact.jpg'
      }}
      structuredData={{
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        mainEntity: {
          '@type': 'Organization',
          name: 'Lightyear Recruitment',
          telephone: '+441234567890',
          email: 'hello@lightyear-recruitment.com',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '123 Business Park',
            addressLocality: 'Reading',
            postalCode: 'RG1 2AB',
            addressCountry: 'GB'
          },
          openingHours: [
            'Mo-Fr 08:30-17:30',
            'Sa-Su closed'
          ]
        }
      }}
      pageType="contact"
      conversionGoals={['contact_form', 'phone_call', 'email_inquiry']}
      trackingData={{
        page_category: 'contact',
        form_type: 'dual_purpose'
      }}
    >
      {/* Hero Section */}
      <Hero
        layout="centered"
        headline="Get in Touch"
        subheadline="Ready to find your perfect warehouse job or hire quality staff? We're here to help with personal service and expert advice."
        primaryCta={{
          text: 'Register for Jobs',
          href: 'https://registration.recruso.co.uk/Form/Worker/RdcgtU2Ti03C3gbg7Q6uWoxra98ucBoAnSg21MBO',
          variant: 'primary'
        }}
        secondaryCta={{
          text: 'Call Us Now',
          href: 'tel:+441234567890',
          variant: 'outline'
        }}
        statistics={[
          { label: 'Response Time', value: '< 2 Hours' },
          { label: 'Office Hours', value: 'Mon-Fri 8:30-5:30' },
          { label: 'Years Experience', value: '13+' },
          { label: 'Local Focus', value: 'Berkshire' }
        ]}
      />

      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <Heading level={2} size="2xl" className="mb-6">
                Send Us a Message
              </Heading>
              <Text color="muted" className="mb-8">
                Use the form below to get in touch. We&apos;ll respond within 2 hours during business hours.
              </Text>

              {formStatus === 'success' ? (
                <Card variant="default" className="p-6 text-center">
                  <Icon name="check-circle" size="xl" color="success" className="mx-auto mb-4" />
                  <Heading level={3} size="lg" className="mb-2">
                    Message Sent Successfully!
                  </Heading>
                  <Text color="muted" className="mb-4">
                    Thank you for your enquiry. We&apos;ll get back to you within 2 hours during business hours.
                  </Text>
                  <Button
                    onClick={() => setFormStatus('idle')}
                    variant="outline"
                    size="small"
                  >
                    Send Another Message
                  </Button>
                </Card>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormGroup
                      name="name"
                      label="Your Name"
                      type="text"
                      value={formData.name}
                      onChange={(value) => handleInputChange('name', value as string)}
                      error={formErrors.name}
                      required
                      placeholder="e.g. John Smith"
                    />

                    <FormGroup
                      name="email"
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={(value) => handleInputChange('email', value as string)}
                      error={formErrors.email}
                      required
                      placeholder="e.g. john@example.com"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormGroup
                      name="phone"
                      label="Phone Number"
                      type="tel"
                      value={formData.phone}
                      onChange={(value) => handleInputChange('phone', value as string)}
                      placeholder="e.g. 07123 456789"
                      helpText="Optional - for quicker response"
                    />

                    <FormGroup
                      name="company"
                      label="Company Name"
                      type="text"
                      value={formData.company}
                      onChange={(value) => handleInputChange('company', value as string)}
                      placeholder="e.g. ABC Logistics Ltd"
                      helpText="Required for employer enquiries"
                    />
                  </div>

                  <FormGroup
                    name="enquiryType"
                    label="Type of Enquiry"
                    type="select"
                    value={formData.enquiryType}
                    onChange={(value) => handleInputChange('enquiryType', value as string)}
                    error={formErrors.enquiryType}
                    required
                    options={[
                      { value: '', label: 'Please select...' },
                      { value: 'candidate', label: 'I&apos;m looking for a job' },
                      { value: 'employer-permanent', label: 'I need to hire permanent staff' },
                      { value: 'employer-temporary', label: 'I need temporary staff' },
                      { value: 'employer-general', label: 'General employer enquiry' },
                      { value: 'other', label: 'Other enquiry' }
                    ]}
                  />

                  <FormGroup
                    name="preferredContact"
                    label="Preferred Contact Method"
                    type="select"
                    value={formData.preferredContact}
                    onChange={(value) => handleInputChange('preferredContact', value as string)}
                    options={[
                      { value: 'email', label: 'Email' },
                      { value: 'phone', label: 'Phone call' },
                      { value: 'either', label: 'Either email or phone' }
                    ]}
                  />

                  <FormGroup
                    name="message"
                    label="Your Message"
                    type="textarea"
                    value={formData.message}
                    onChange={(value) => handleInputChange('message', value as string)}
                    error={formErrors.message}
                    required
                    placeholder="Please tell us about your requirements, experience, or what you&apos;d like to discuss..."
                    rows={5}
                  />

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="consent"
                          checked={formData.consent}
                          onChange={(e) => handleInputChange('consent', e.target.checked)}
                          className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          required
                        />
                        <div className="flex-1">
                          <Text size="sm" className="leading-5">
                            I agree to the privacy policy and terms of service <span className="text-red-500">*</span>
                          </Text>
                          <Text size="xs" color="muted" className="mt-1">
                            We&apos;ll only use your information to respond to your enquiry and provide relevant updates.
                          </Text>
                        </div>
                      </label>
                      {formErrors.consent && (
                        <Text size="sm" color="error" role="alert" aria-live="polite">
                          {formErrors.consent}
                        </Text>
                      )}
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="large"
                      disabled={formStatus === 'submitting'}
                      className="w-full"
                    >
                      {formStatus === 'submitting' ? 'Sending Message...' : 'Send Message'}
                    </Button>

                    {formStatus === 'error' && (
                      <Text color="error" size="sm" className="text-center">
                        Something went wrong. Please try again or call us directly.
                      </Text>
                    )}
                  </div>
                </form>
              )}
            </div>

            {/* Contact Information */}
            <div>
              <Heading level={2} size="2xl" className="mb-6">
                Other Ways to Reach Us
              </Heading>
              
              <div className="space-y-6 mb-12">
                {contactMethods.map((method, index) => (
                  <Card key={index} variant="default" className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 p-3 bg-primary/10 rounded-lg">
                        <Icon name={method.icon as 'phone' | 'email' | 'map-pin' | 'linkedin'} size="lg" color="accent" />
                      </div>
                      <div className="flex-1">
                        <Heading level={3} size="base" className="mb-1">
                          {method.title}
                        </Heading>
                        <Text weight="medium" className="mb-1">
                          <a 
                            href={method.action}
                            className="text-primary hover:text-primary-dark"
                            target={method.action.startsWith('http') ? '_blank' : '_self'}
                            rel={method.action.startsWith('http') ? 'noopener noreferrer' : undefined}
                          >
                            {method.detail}
                          </a>
                        </Text>
                        <Text size="sm" color="muted">
                          {method.description}
                        </Text>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Opening Hours */}
              <Card variant="default" className="p-6 mb-8">
                <Heading level={3} size="lg" className="mb-4">
                  Opening Hours
                </Heading>
                <div className="space-y-2">
                  {openingHours.map((day, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <Text weight="medium">{day.day}</Text>
                      <Text color={day.hours === 'Closed' ? 'muted' : 'default'}>
                        {day.hours}
                      </Text>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Text size="sm" color="muted">
                    For urgent enquiries outside office hours, please email us and we&apos;ll respond first thing the next working day.
                  </Text>
                </div>
              </Card>

              {/* Emergency Contact */}
              <Card variant="highlighted" className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-3 bg-secondary/10 rounded-lg">
                    <Icon name="alert-circle" size="lg" color="warning" />
                  </div>
                  <div>
                    <Heading level={3} size="base" className="mb-2">
                      Urgent Staffing Requirements
                    </Heading>
                    <Text size="sm" color="muted" className="mb-3">
                      Need staff urgently? Call our emergency line for same-day temporary placements.
                    </Text>
                    <Button
                      href="tel:+441234567890"
                      variant="secondary"
                      size="small"
                    >
                      Call Emergency Line
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50" aria-labelledby="faq-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Heading level={2} size="2xl" className="mb-4" id="faq-heading">
              Frequently Asked Questions
            </Heading>
            <Text size="lg" color="muted">
              Quick answers to common questions - can&apos;t find what you&apos;re looking for? Contact us directly.
            </Text>
          </div>

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index}>
                <Heading level={3} size="lg" className="mb-3">
                  {faq.question}
                </Heading>
                <Text color="muted" className="pb-6 border-b border-gray-200">
                  {faq.answer}
                </Text>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Text className="mb-4">
              Still have questions?
            </Text>
            <Button href="tel:+441234567890" variant="outline" size="large">
              Call Us for Immediate Answers
            </Button>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 bg-white" aria-labelledby="location-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Heading level={2} size="2xl" className="mb-4" id="location-heading">
              Find Our Office
            </Heading>
            <Text size="lg" color="muted">
              Located in the heart of Reading&apos;s business district
            </Text>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <Card variant="default" className="p-8 h-full">
                <div className="flex items-start gap-4 mb-6">
                  <Icon name="map-pin" size="xl" color="accent" />
                  <div>
                    <Heading level={3} size="lg" className="mb-2">
                      Office Address
                    </Heading>
                    <Text className="mb-4">
                      123 Business Park<br />
                      Reading, Berkshire<br />
                      RG1 2AB
                    </Text>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Icon name="car" size="base" color="muted" />
                    <Text size="sm">
                      Free parking available on-site
                    </Text>
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon name="train" size="base" color="muted" />
                    <Text size="sm">
                      5 minutes walk from Reading station
                    </Text>
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon name="bus" size="base" color="muted" />
                    <Text size="sm">
                      Multiple bus routes nearby
                    </Text>
                  </div>
                </div>

                <div className="mt-8">
                  <Button
                    href="https://maps.google.com/?q=123+Business+Park,+Reading,+RG1+2AB"
                    variant="outline"
                    size="medium"
                  >
                    Get Directions
                  </Button>
                </div>
              </Card>
            </div>

            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
              <Text color="muted">
                Interactive map would be embedded here
              </Text>
            </div>
          </div>
        </div>
      </section>
    </PageTemplate>
  )
}