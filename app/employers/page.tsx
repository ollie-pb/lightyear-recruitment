'use client'

import React from 'react'
import PageTemplate from '../../components/templates/PageTemplate'
import Hero from '../../components/organisms/Hero'
import Card from '../../components/molecules/Card'
import Heading from '../../components/atoms/Heading'
import Text from '../../components/atoms/Text'
import Button from '../../components/atoms/Button'
import Icon from '../../components/atoms/Icon'

export default function EmployersPage() {
  const services = [
    {
      title: 'Permanent Recruitment',
      description: 'Find the right long-term employees for your warehouse and logistics operations',
      features: ['Rigorous screening process', '3-month replacement guarantee', 'Cultural fit assessment', 'Skill verification'],
      icon: 'users'
    },
    {
      title: 'Temporary Staffing',
      description: 'Flexible staffing solutions for peak periods, holiday cover, and short-term projects',
      features: ['Same-day placement', 'Vetted candidates', 'Flexible duration', 'Competitive rates'],
      icon: 'clock'
    },
    {
      title: 'Temp-to-Perm',
      description: 'Try before you buy with our temporary-to-permanent placement service',
      features: ['Risk-free trial period', 'Smooth transition process', 'Reduced recruitment costs', 'Better cultural fit'],
      icon: 'trending-up'
    },
    {
      title: 'Specialist Roles',
      description: 'Expert recruitment for specialized warehouse and logistics positions',
      features: ['Team leaders & supervisors', 'Health & safety officers', 'Logistics coordinators', 'Technical specialists'],
      icon: 'briefcase'
    }
  ]

  const benefits = [
    {
      icon: 'target',
      title: 'Specialist Focus',
      description: 'Exclusive focus on warehouse and logistics means deeper industry knowledge and better candidate quality'
    },
    {
      icon: 'map-pin',
      title: 'Local Network',
      description: 'Established relationships with Berkshire employers and extensive local candidate database'
    },
    {
      icon: 'shield-check',
      title: 'Quality Guarantee',
      description: '3-month replacement guarantee on permanent placements and comprehensive candidate screening'
    },
    {
      icon: 'clock',
      title: 'Fast Turnaround',
      description: 'Average time to fill: 5-7 days for temporary roles, 10-14 days for permanent positions'
    },
    {
      icon: 'pound-sterling',
      title: 'Cost Effective',
      description: 'Competitive fees with no upfront costs and flexible payment terms for established clients'
    },
    {
      icon: 'headphones',
      title: 'Personal Service',
      description: 'Dedicated account management with direct access to decision makers, not just junior consultants'
    }
  ]

  const process = [
    {
      step: 1,
      title: 'Initial Consultation',
      description: 'We discuss your specific requirements, company culture, and hiring challenges',
      duration: '30-45 minutes'
    },
    {
      step: 2,
      title: 'Job Specification',
      description: 'Detailed role specification including skills, experience, and cultural requirements',
      duration: 'Within 24 hours'
    },
    {
      step: 3,
      title: 'Candidate Search',
      description: 'We search our database and actively recruit for your specific requirements',
      duration: '2-3 days'
    },
    {
      step: 4,
      title: 'Screening & Interviews',
      description: 'Comprehensive screening including skills assessment and reference checks',
      duration: '1-2 days'
    },
    {
      step: 5,
      title: 'Candidate Presentation',
      description: 'Present shortlisted candidates with detailed profiles and our recommendations',
      duration: 'Same day'
    },
    {
      step: 6,
      title: 'Interview Support',
      description: 'Coordinate interviews and provide feedback to ensure the best outcome',
      duration: 'Ongoing'
    }
  ]

  const clientTypes = [
    {
      type: 'Distribution Centers',
      description: 'Large-scale distribution operations requiring high-volume staffing',
      examples: ['Amazon fulfillment', '3PL operators', 'Retail distribution']
    },
    {
      type: 'Manufacturing',
      description: 'Production facilities with warehouse and logistics requirements',
      examples: ['FMCG companies', 'Automotive parts', 'Electronics assembly']
    },
    {
      type: 'Logistics Companies',
      description: 'Specialist logistics and transport operations',
      examples: ['Freight forwarders', 'Courier services', 'Cold chain logistics']
    },
    {
      type: 'Retail & E-commerce',
      description: 'Retailers with their own warehouse and fulfillment operations',
      examples: ['Online retailers', 'Furniture stores', 'Fashion brands']
    }
  ]

  return (
    <PageTemplate
      variant="default"
      title="Warehouse & Logistics Recruitment Services for Berkshire Employers"
      description="Professional warehouse and logistics recruitment services in Berkshire. Permanent, temporary, and temp-to-perm solutions with 3-month guarantee. Family-run agency since 2010."
      keywords="warehouse recruitment berkshire, logistics staffing, temporary warehouse staff, permanent recruitment, forklift driver recruitment, team leader recruitment"
      openGraph={{
        title: 'Professional Warehouse Recruitment Services | Lightyear Recruitment',
        description: 'Specialist warehouse and logistics recruitment in Berkshire. Permanent, temporary & temp-to-perm solutions with 3-month guarantee.',
        image: '/images/og-employers.jpg'
      }}
      structuredData={{
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        name: 'Lightyear Recruitment - Employer Services',
        description: 'Professional warehouse and logistics recruitment services for employers in Berkshire',
        provider: {
          '@type': 'Organization',
          name: 'Lightyear Recruitment'
        },
        areaServed: {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressRegion: 'Berkshire',
            addressCountry: 'GB'
          }
        },
        serviceType: ['Permanent Recruitment', 'Temporary Staffing', 'Temp-to-Perm', 'Specialist Recruitment']
      }}
      pageType="employers"
      conversionGoals={['contact_inquiry', 'service_request']}
      trackingData={{
        page_category: 'employers',
        services_shown: services.length,
        client_types: clientTypes.length
      }}
    >
      {/* Hero Section */}
      <Hero
        variant="simple"
        layout="centered"
        title="Professional Warehouse & Logistics Recruitment"
        subtitle="Specialist recruitment services for Berkshire employers. Find the right warehouse and logistics staff with our proven process and 3-month guarantee."
        primaryCta={{
          text: 'Discuss Your Requirements',
          href: '/contact',
          variant: 'primary'
        }}
        secondaryCta={{
          text: 'View Our Services',
          href: '#services',
          variant: 'outline'
        }}
        statistics={[
          { label: 'Years Experience', value: '10+' },
          { label: 'Average Fill Time', value: '7 Days' },
          { label: 'Replacement Guarantee', value: '3 Months' },
          { label: 'Client Satisfaction', value: '98%' }
        ]}
      />

      {/* Services Section */}
      <section id="services" className="py-16 bg-white" aria-labelledby="services-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Heading level={2} size="2xl" className="mb-4" id="services-heading">
              Our Recruitment Services
            </Heading>
            <Text size="lg" color="muted">
              Comprehensive staffing solutions for warehouse and logistics operations
            </Text>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} variant="default" className="h-full">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0 p-3 bg-primary/10 rounded-lg">
                    <Icon name={service.icon as any} size="lg" color="primary" />
                  </div>
                  <div className="flex-1">
                    <Heading level={3} size="lg" className="mb-2">
                      {service.title}
                    </Heading>
                    <Text color="muted" className="mb-4">
                      {service.description}
                    </Text>
                  </div>
                </div>

                <div className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2">
                      <Icon name="check" size="xs" color="success" />
                      <Text size="sm">{feature}</Text>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button href="/contact" variant="primary" size="lg">
              Get Started Today
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50" aria-labelledby="benefits-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Heading level={2} size="2xl" className="mb-4" id="benefits-heading">
              Why Choose Lightyear Recruitment?
            </Heading>
            <Text size="lg" color="muted">
              Family-run agency with specialist expertise in warehouse and logistics recruitment
            </Text>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <Icon name={benefit.icon as any} size="xl" color="primary" />
                  </div>
                </div>
                <Heading level={3} size="base" className="mb-2">
                  {benefit.title}
                </Heading>
                <Text size="sm" color="muted">
                  {benefit.description}
                </Text>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-16 bg-white" aria-labelledby="process-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Heading level={2} size="2xl" className="mb-4" id="process-heading">
              Our Recruitment Process
            </Heading>
            <Text size="lg" color="muted">
              A proven 6-step process to find the right candidates for your business
            </Text>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {process.map((step, index) => (
              <Card key={index} variant="default" className="text-center h-full">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-lg font-bold">
                    {step.step}
                  </div>
                </div>
                <Heading level={3} size="base" className="mb-3">
                  {step.title}
                </Heading>
                <Text size="sm" color="muted" className="mb-3">
                  {step.description}
                </Text>
                <Text size="xs" color="primary" weight="medium">
                  Timeline: {step.duration}
                </Text>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Text className="mb-6">
              Ready to streamline your recruitment process?
            </Text>
            <Button href="/contact" variant="outline" size="lg">
              Start the Process
            </Button>
          </div>
        </div>
      </section>

      {/* Client Types */}
      <section className="py-16 bg-gray-50" aria-labelledby="clients-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Heading level={2} size="2xl" className="mb-4" id="clients-heading">
              Who We Work With
            </Heading>
            <Text size="lg" color="muted">
              We partner with diverse businesses across the warehouse and logistics sector
            </Text>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {clientTypes.map((client, index) => (
              <Card key={index} variant="default" className="h-full">
                <Heading level={3} size="lg" className="mb-3">
                  {client.type}
                </Heading>
                <Text color="muted" className="mb-4">
                  {client.description}
                </Text>
                <div>
                  <Text size="sm" weight="medium" className="mb-2">
                    Examples:
                  </Text>
                  <div className="flex flex-wrap gap-2">
                    {client.examples.map((example, exampleIndex) => (
                      <span
                        key={exampleIndex}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Information */}
      <section className="py-16 bg-white" aria-labelledby="pricing-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Heading level={2} size="2xl" className="mb-4" id="pricing-heading">
              Transparent Pricing
            </Heading>
            <Text size="lg" color="muted">
              No hidden costs or upfront fees. You only pay when we deliver results.
            </Text>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card variant="default" className="text-center">
              <Heading level={3} size="lg" className="mb-3">
                Temporary Staff
              </Heading>
              <div className="mb-4">
                <Text size="2xl" weight="bold" color="primary">
                  £2-4
                </Text>
                <Text size="sm" color="muted">per hour markup</Text>
              </div>
              <ul className="space-y-2 text-left">
                <li className="flex items-center gap-2">
                  <Icon name="check" size="xs" color="success" />
                  <Text size="sm">No placement fees</Text>
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="check" size="xs" color="success" />
                  <Text size="sm">Weekly invoicing</Text>
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="check" size="xs" color="success" />
                  <Text size="sm">Flexible terms</Text>
                </li>
              </ul>
            </Card>

            <Card variant="highlighted" className="text-center">
              <Heading level={3} size="lg" className="mb-3">
                Permanent Staff
              </Heading>
              <div className="mb-4">
                <Text size="2xl" weight="bold" color="primary">
                  12-18%
                </Text>
                <Text size="sm" color="muted">of annual salary</Text>
              </div>
              <ul className="space-y-2 text-left">
                <li className="flex items-center gap-2">
                  <Icon name="check" size="xs" color="success" />
                  <Text size="sm">3-month guarantee</Text>
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="check" size="xs" color="success" />
                  <Text size="sm">Payment on start date</Text>
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="check" size="xs" color="success" />
                  <Text size="sm">Rebate scheme available</Text>
                </li>
              </ul>
            </Card>

            <Card variant="default" className="text-center">
              <Heading level={3} size="lg" className="mb-3">
                Temp-to-Perm
              </Heading>
              <div className="mb-4">
                <Text size="2xl" weight="bold" color="primary">
                  8-12%
                </Text>
                <Text size="sm" color="muted">conversion fee</Text>
              </div>
              <ul className="space-y-2 text-left">
                <li className="flex items-center gap-2">
                  <Icon name="check" size="xs" color="success" />
                  <Text size="sm">Trial period included</Text>
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="check" size="xs" color="success" />
                  <Text size="sm">Reduced permanent fee</Text>
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="check" size="xs" color="success" />
                  <Text size="sm">Risk-free hiring</Text>
                </li>
              </ul>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Text size="sm" color="muted">
              Volume discounts available for multiple placements. Contact us for a bespoke quote.
            </Text>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-primary text-white" aria-labelledby="cta-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heading level={2} size="2xl" color="inverse" className="mb-4" id="cta-heading">
            Ready to Solve Your Staffing Challenges?
          </Heading>
          <Text size="lg" color="inverse" className="mb-8 opacity-90">
            Let's discuss how we can help you find the right warehouse and logistics staff. 
            No obligation consultation with our experienced team.
          </Text>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/contact" variant="secondary" size="lg">
              Book a Consultation
            </Button>
            <Button href="tel:+441234567890" variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
              Call Now
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-8 text-sm opacity-75">
            <span>✓ 3-month guarantee</span>
            <span>✓ Local Berkshire expertise</span>
            <span>✓ 7-day average fill time</span>
            <span>✓ No upfront costs</span>
          </div>
        </div>
      </section>
    </PageTemplate>
  )
}