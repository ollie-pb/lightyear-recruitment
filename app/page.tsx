'use client'

import React from 'react'
import PageTemplate from '../components/templates/PageTemplate'
import Hero from '../components/organisms/Hero'
import Card from '../components/molecules/Card'
import Heading from '../components/atoms/Heading'
import Text from '../components/atoms/Text'
import Button from '../components/atoms/Button'
import Icon from '../components/atoms/Icon'

export default function HomePage() {
  const testimonials = [
    {
      name: 'Sarah Thompson',
      role: 'Warehouse Operative',
      company: 'Logistics Solutions Ltd',
      content: 'Lightyear found me the perfect role within a week. Their personal approach made all the difference.',
      avatar: '/images/testimonials/sarah.jpg'
    },
    {
      name: 'Michael Chen',
      role: 'Team Leader',
      company: 'Distribution Hub',
      content: 'Professional service from start to finish. They really understood what I was looking for.',
      avatar: '/images/testimonials/michael.jpg'
    },
    {
      name: 'Emma Wilson',
      role: 'Forklift Driver',
      company: 'Supply Chain Co',
      content: 'Great communication and support throughout the process. Highly recommend!',
      avatar: '/images/testimonials/emma.jpg'
    }
  ]

  const benefits = [
    {
      icon: 'users',
      title: 'Family-Run Agency',
      description: 'Personal service with genuine care for every candidate. No corporate bureaucracy, just real people helping real people.'
    },
    {
      icon: 'map-pin',
      title: 'Local Expertise',
      description: 'Deep knowledge of Berkshire employers and opportunities. We know the area, the companies, and the culture.'
    },
    {
      icon: 'briefcase',
      title: 'Specialist Focus',
      description: 'Exclusively warehouse and logistics roles. We understand your skills and career aspirations in this sector.'
    },
    {
      icon: 'clock',
      title: 'Quick Placement',
      description: 'Most candidates placed within 1-2 weeks. Fast-track your job search with our proven process.'
    },
    {
      icon: 'shield-check',
      title: 'No Hidden Fees',
      description: 'Completely free service for job seekers. Our clients pay us, so you never will.'
    },
    {
      icon: 'trending-up',
      title: 'Career Growth',
      description: 'Long-term relationships focused on your career development and progression opportunities.'
    }
  ]

  const jobStats = {
    total: 47,
    featured: 12,
    newThisWeek: 8,
    averageSalary: '£24,000'
  }

  return (
    <PageTemplate
      variant="landing"
      title="Find Your Perfect Warehouse & Logistics Job in Berkshire"
      description="Lightyear Recruitment - Family-run agency specializing in warehouse and logistics roles across Berkshire. Quick placements, personal service, no fees for candidates."
      keywords="warehouse jobs berkshire, logistics recruitment, forklift driver jobs, warehouse operative berkshire, distribution jobs reading, supply chain careers"
      openGraph={{
        title: 'Find Your Perfect Warehouse Job in Berkshire | Lightyear Recruitment',
        description: 'Family-run recruitment agency with 47 active warehouse and logistics jobs in Berkshire. Quick placements, no fees for candidates.',
        image: '/images/og-homepage.jpg',
        type: 'website'
      }}
      structuredData={{
        '@context': 'https://schema.org',
        '@type': 'EmploymentAgency',
        name: 'Lightyear Recruitment',
        description: 'Family-run recruitment agency specializing in warehouse and logistics roles across Berkshire',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Berkshire',
          addressCountry: 'GB'
        },
        url: 'https://www.lightyear-recruitment.com',
        sameAs: [
          'https://www.linkedin.com/company/lightyear-recruitment'
        ],
        jobLocationType: 'SearchEntireOrganization',
        hiringOrganization: {
          '@type': 'Organization',
          name: 'Lightyear Recruitment'
        }
      }}
      pageType="homepage"
      conversionGoals={['registration', 'job_search', 'contact_inquiry']}
      trackingData={{
        page_category: 'landing',
        job_count: jobStats.total,
        featured_jobs: jobStats.featured
      }}
      headerProps={{
        jobCount: {
          total: jobStats.total,
          featured: jobStats.featured
        },
        featuredBadge: `${jobStats.newThisWeek} New Jobs This Week`
      }}
    >
      {/* Hero Section */}
      <Hero
        layout="with-image"
        headline="Find Your Perfect Warehouse Job in Berkshire"
        subheadline="Family-run recruitment agency with over 40 active roles. Quick placements, personal service, no fees for candidates."
        primaryCta={{
          text: 'Register for Jobs',
          href: 'https://registration.recruso.co.uk/Form/Worker/RdcgtU2Ti03C3gbg7Q6uWoxra98ucBoAnSg21MBO',
          variant: 'primary'
        }}
        secondaryCta={{
          text: 'Browse All Jobs',
          href: '/candidates',
          variant: 'outline'
        }}
        backgroundImage="/images/hero-warehouse.jpg"
        statistics={[
          { label: 'Active Jobs', value: jobStats.total.toString() },
          { label: 'Featured Roles', value: jobStats.featured.toString() },
          { label: 'Avg Salary', value: jobStats.averageSalary },
          { label: 'Quick Placement', value: '1-2 Weeks' }
        ]}
        testimonial={{
          text: 'Found my dream warehouse job in just 5 days. The team really cared about finding the right fit.',
          author: 'James Mitchell',
          role: 'Warehouse Team Leader',
          company: 'Local Warehouse',
          image: '/images/testimonials/james.jpg'
        }}
      />

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50" aria-labelledby="benefits-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Heading level={2} size="2xl" className="mb-4" id="benefits-heading">
              Why Choose Lightyear Recruitment?
            </Heading>
            <Text size="lg" color="muted" className="max-w-3xl mx-auto">
              We&apos;re not just another recruitment agency. As a family-run business, we provide personal service 
              and genuine care for every candidate in the warehouse and logistics sector.
            </Text>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                variant="default"
                className="text-center h-full"
              >
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <Icon name={benefit.icon as 'users' | 'map-pin' | 'briefcase' | 'clock' | 'shield-check' | 'trending-up'} size="xl" color="accent" />
                  </div>
                </div>
                <Heading level={3} size="lg" className="mb-3">
                  {benefit.title}
                </Heading>
                <Text color="muted">
                  {benefit.description}
                </Text>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white" aria-labelledby="testimonials-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Heading level={2} size="2xl" className="mb-4" id="testimonials-heading">
              Success Stories
            </Heading>
            <Text size="lg" color="muted">
              Hear from candidates who found their perfect warehouse and logistics roles through Lightyear
            </Text>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} variant="default" className="h-full">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <Heading level={4} size="base" className="mb-1">
                      {testimonial.name}
                    </Heading>
                    <Text size="sm" color="muted">
                      {testimonial.role} at {testimonial.company}
                    </Text>
                  </div>
                </div>
                <Text className="italic">
                  &ldquo;{testimonial.content}&rdquo;
                </Text>
              </Card>
            ))}
          </div>

          {/* CTA in testimonials section */}
          <div className="text-center mt-12">
            <Text className="mb-6">
              Ready to join our success stories?
            </Text>
            <Button
              href="https://registration.recruso.co.uk/Form/Worker/RdcgtU2Ti03C3gbg7Q6uWoxra98ucBoAnSg21MBO"
              variant="primary"
              size="large"
            >
              Register Today
            </Button>
          </div>
        </div>
      </section>

      {/* Current Opportunities Preview */}
      <section className="py-16 bg-gray-50" aria-labelledby="opportunities-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Heading level={2} size="2xl" className="mb-4" id="opportunities-heading">
              Current Opportunities
            </Heading>
            <Text size="lg" color="muted" className="mb-6">
              {jobStats.total} active warehouse and logistics jobs across Berkshire
            </Text>
            <div className="flex flex-wrap justify-center gap-6 text-center">
              <div>
                <Text size="xl" weight="bold" color="accent" className="block">
                  {jobStats.featured}
                </Text>
                <Text size="sm" color="muted">Featured Roles</Text>
              </div>
              <div>
                <Text size="xl" weight="bold" color="warning" className="block">
                  {jobStats.newThisWeek}
                </Text>
                <Text size="sm" color="muted">New This Week</Text>
              </div>
              <div>
                <Text size="xl" weight="bold" color="success" className="block">
                  {jobStats.averageSalary}
                </Text>
                <Text size="sm" color="muted">Average Salary</Text>
              </div>
            </div>
          </div>

          {/* Sample job cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card
              variant="job-listing"
              title="Warehouse Operative"
              company="Distribution Solutions Ltd"
              location="Reading, Berkshire"
              salary="£22,000 - £25,000"
              jobType="Full-time"
              featured={true}
            >
              <Text size="sm" color="muted">
                Immediate start available. Forklift license preferred but training provided. 
                Great benefits package including pension and healthcare.
              </Text>
            </Card>

            <Card
              variant="job-listing"
              title="Forklift Driver"
              company="Logistics Hub"
              location="Slough, Berkshire"
              salary="£26,000 - £28,000"
              jobType="Full-time"
            >
              <Text size="sm" color="muted">
                Counterbalance and reach truck experience required. Day shifts Monday to Friday. 
                Excellent overtime rates available.
              </Text>
            </Card>

            <Card
              variant="job-listing"
              title="Team Leader"
              company="Supply Chain Co"
              location="Windsor, Berkshire"
              salary="£30,000 - £35,000"
              jobType="Full-time"
            >
              <Text size="sm" color="muted">
                Lead a team of 15+ warehouse operatives. Management experience required. 
                Career progression opportunities available.
              </Text>
            </Card>
          </div>

          <div className="text-center">
            <Button
              href="/candidates"
              variant="outline"
              size="large"
              className="mr-4"
            >
              View All Jobs
            </Button>
            <Button
              href="https://registration.recruso.co.uk/Form/Worker/RdcgtU2Ti03C3gbg7Q6uWoxra98ucBoAnSg21MBO"
              variant="primary"
              size="large"
            >
              Register for Job Alerts
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-primary text-white" aria-labelledby="final-cta-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heading level={2} size="2xl" className="mb-4 text-white" id="final-cta-heading">
            Ready to Take the Next Step?
          </Heading>
          <Text size="lg" color="inverse" className="mb-8 opacity-90">
            Join hundreds of successful candidates who found their perfect warehouse and logistics 
            roles through Lightyear Recruitment. Registration takes just 2 minutes.
          </Text>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              href="https://registration.recruso.co.uk/Form/Worker/RdcgtU2Ti03C3gbg7Q6uWoxra98ucBoAnSg21MBO"
              variant="secondary"
              size="large"
            >
              Register Now - It&apos;s Free
            </Button>
            <Button
              href="/contact"
              variant="outline"
              size="large"
              className="border-white text-white hover:bg-white hover:text-primary"
            >
              Speak to Our Team
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-8 text-sm opacity-75">
            <span className="flex items-center gap-2">
              <Icon name="check" size="sm" />
              No fees for candidates
            </span>
            <span className="flex items-center gap-2">
              <Icon name="check" size="sm" />
              Local Berkshire experts
            </span>
            <span className="flex items-center gap-2">
              <Icon name="check" size="sm" />
              Quick 1-2 week placement
            </span>
          </div>
        </div>
      </section>
    </PageTemplate>
  )
}