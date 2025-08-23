'use client'

import React from 'react'
import PageTemplate from '../../components/templates/PageTemplate'
import Hero from '../../components/organisms/Hero'
import Card from '../../components/molecules/Card'
import FormGroup from '../../components/molecules/FormGroup'
import Heading from '../../components/atoms/Heading'
import Text from '../../components/atoms/Text'
import Button from '../../components/atoms/Button'
import Icon from '../../components/atoms/Icon'

export default function CandidatesPage() {
  const jobTypes = [
    {
      title: 'Warehouse Operative',
      description: 'General warehouse duties including picking, packing, and goods handling',
      salaryRange: '£20,000 - £24,000',
      requirements: ['No experience required', 'Training provided', 'Flexible hours available'],
      count: 18
    },
    {
      title: 'Forklift Driver',
      description: 'Operating counterbalance and reach trucks in busy warehouse environments',
      salaryRange: '£24,000 - £28,000',
      requirements: ['Valid forklift license', '1+ years experience', 'Safety conscious'],
      count: 12
    },
    {
      title: 'Team Leader',
      description: 'Leading warehouse teams and ensuring operational efficiency',
      salaryRange: '£28,000 - £35,000',
      requirements: ['Leadership experience', 'Warehouse background', 'People management skills'],
      count: 8
    },
    {
      title: 'Logistics Coordinator',
      description: 'Planning and coordinating logistics operations and deliveries',
      salaryRange: '£25,000 - £32,000',
      requirements: ['Logistics experience', 'Good IT skills', 'Attention to detail'],
      count: 5
    }
  ]

  const benefits = [
    {
      icon: 'shield-check',
      title: 'Job Security',
      description: 'Permanent positions with established Berkshire employers'
    },
    {
      icon: 'trending-up',
      title: 'Career Progression',
      description: 'Clear advancement opportunities within growing companies'
    },
    {
      icon: 'clock',
      title: 'Flexible Hours',
      description: 'Day shifts, night shifts, and part-time options available'
    },
    {
      icon: 'pound-sterling',
      title: 'Competitive Pay',
      description: 'Above average salaries with overtime opportunities'
    },
    {
      icon: 'heart',
      title: 'Benefits Package',
      description: 'Pension schemes, healthcare, and employee discounts'
    },
    {
      icon: 'users',
      title: 'Team Environment',
      description: 'Friendly, supportive teams with excellent company culture'
    }
  ]

  const process = [
    {
      step: 1,
      title: 'Register Online',
      description: 'Quick 2-minute registration with your details and job preferences',
      icon: 'user-plus'
    },
    {
      step: 2,
      title: 'Initial Consultation',
      description: 'Phone or video call to understand your experience and goals',
      icon: 'phone'
    },
    {
      step: 3,
      title: 'Job Matching',
      description: 'We find suitable roles that match your skills and requirements',
      icon: 'search'
    },
    {
      step: 4,
      title: 'Interview Support',
      description: 'Preparation and guidance to help you succeed in interviews',
      icon: 'user-check'
    },
    {
      step: 5,
      title: 'Job Placement',
      description: 'Start your new role with ongoing support during your first weeks',
      icon: 'briefcase'
    }
  ]

  return (
    <PageTemplate
      variant="default"
      title="Warehouse & Logistics Jobs in Berkshire"
      description="Find your perfect warehouse or logistics job in Berkshire with Lightyear Recruitment. 40+ active roles, quick placements, and no fees for candidates."
      keywords="warehouse jobs berkshire, logistics jobs, forklift driver jobs, warehouse operative, team leader jobs, supply chain careers berkshire"
      openGraph={{
        title: 'Warehouse & Logistics Jobs in Berkshire | Lightyear Recruitment',
        description: '40+ active warehouse and logistics jobs across Berkshire. Quick placements, competitive salaries, no fees for candidates.',
        image: '/images/og-candidates.jpg'
      }}
      structuredData={{
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        title: 'Warehouse and Logistics Jobs in Berkshire',
        description: 'Multiple warehouse and logistics opportunities across Berkshire with competitive salaries and benefits',
        hiringOrganization: {
          '@type': 'Organization',
          name: 'Lightyear Recruitment'
        },
        jobLocation: {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressRegion: 'Berkshire',
            addressCountry: 'GB'
          }
        },
        employmentType: ['FULL_TIME', 'PART_TIME'],
        salaryCurrency: 'GBP',
        baseSalary: {
          '@type': 'MonetaryAmount',
          currency: 'GBP',
          value: {
            '@type': 'QuantitativeValue',
            minValue: 20000,
            maxValue: 35000,
            unitText: 'YEAR'
          }
        }
      }}
      pageType="candidates"
      conversionGoals={['registration', 'job_application']}
      trackingData={{
        page_category: 'candidates',
        job_types_shown: jobTypes.length,
        total_jobs: jobTypes.reduce((sum, type) => sum + type.count, 0)
      }}
    >
      {/* Hero Section */}
      <Hero
        variant="simple"
        layout="centered"
        title="Find Your Perfect Warehouse Job in Berkshire"
        subtitle="40+ active roles across Reading, Slough, Windsor, and surrounding areas. Quick placements with competitive salaries and excellent benefits."
        primaryCta={{
          text: 'Register for Jobs',
          href: 'https://registration.recruso.co.uk/Form/Worker/RdcgtU2Ti03C3gbg7Q6uWoxra98ucBoAnSg21MBO',
          variant: 'primary'
        }}
        secondaryCta={{
          text: 'Speak to Our Team',
          href: '/contact',
          variant: 'outline'
        }}
        statistics={[
          { label: 'Active Jobs', value: '40+' },
          { label: 'Average Placement', value: '1-2 Weeks' },
          { label: 'Salary Range', value: '£20k - £35k' },
          { label: 'No Fees', value: 'Ever' }
        ]}
      />

      {/* Available Job Types */}
      <section className="py-16 bg-white" aria-labelledby="job-types-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Heading level={2} size="2xl" className="mb-4" id="job-types-heading">
              Available Job Types
            </Heading>
            <Text size="lg" color="muted">
              We specialize in warehouse and logistics roles across Berkshire
            </Text>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {jobTypes.map((jobType, index) => (
              <Card key={index} variant="default" className="h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <Heading level={3} size="lg" className="mb-2">
                      {jobType.title}
                    </Heading>
                    <Text color="success" weight="medium" className="mb-3">
                      {jobType.salaryRange}
                    </Text>
                  </div>
                  <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                    {jobType.count} roles
                  </span>
                </div>
                
                <Text color="muted" className="mb-4">
                  {jobType.description}
                </Text>

                <div className="space-y-2">
                  <Text size="sm" weight="medium">Requirements:</Text>
                  <ul className="space-y-1">
                    {jobType.requirements.map((req, reqIndex) => (
                      <li key={reqIndex} className="flex items-center gap-2 text-sm">
                        <Icon name="check" size="xs" color="success" />
                        <Text size="sm">{req}</Text>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              href="https://registration.recruso.co.uk/Form/Worker/RdcgtU2Ti03C3gbg7Q6uWoxra98ucBoAnSg21MBO"
              variant="primary"
              size="lg"
            >
              Apply for These Roles
            </Button>
          </div>
        </div>
      </section>

      {/* Why Work Through Us */}
      <section className="py-16 bg-gray-50" aria-labelledby="benefits-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Heading level={2} size="2xl" className="mb-4" id="benefits-heading">
              Why Work Through Lightyear?
            </Heading>
            <Text size="lg" color="muted">
              We don't just find you any job – we find you the right job
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

      {/* How It Works */}
      <section className="py-16 bg-white" aria-labelledby="process-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Heading level={2} size="2xl" className="mb-4" id="process-heading">
              How It Works
            </Heading>
            <Text size="lg" color="muted">
              Our simple 5-step process to get you into your perfect role
            </Text>
          </div>

          <div className="space-y-8">
            {process.map((step, index) => (
              <div key={index} className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center">
                    <Icon name={step.icon as any} size="lg" />
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <Heading level={3} size="lg" className="mb-2">
                    Step {step.step}: {step.title}
                  </Heading>
                  <Text color="muted">
                    {step.description}
                  </Text>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Text className="mb-6">
              Ready to start your journey to a better job?
            </Text>
            <Button
              href="https://registration.recruso.co.uk/Form/Worker/RdcgtU2Ti03C3gbg7Q6uWoxra98ucBoAnSg21MBO"
              variant="primary"
              size="lg"
            >
              Start Step 1 - Register Now
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50" aria-labelledby="faq-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Heading level={2} size="2xl" className="mb-4" id="faq-heading">
              Frequently Asked Questions
            </Heading>
            <Text size="lg" color="muted">
              Common questions from job seekers in warehouse and logistics
            </Text>
          </div>

          <div className="space-y-8">
            <div>
              <Heading level={3} size="lg" className="mb-3">
                Do I need experience to apply for warehouse jobs?
              </Heading>
              <Text color="muted">
                Not always! Many of our clients offer entry-level positions with full training provided. 
                We have roles for complete beginners as well as experienced professionals.
              </Text>
            </div>

            <div>
              <Heading level={3} size="lg" className="mb-3">
                How quickly can you place me in a job?
              </Heading>
              <Text color="muted">
                Most candidates are placed within 1-2 weeks of registration. Some urgent roles 
                can start within days, while others may take a few weeks to find the perfect match.
              </Text>
            </div>

            <div>
              <Heading level={3} size="lg" className="mb-3">
                Do you charge fees to job seekers?
              </Heading>
              <Text color="muted">
                Never! Our service is completely free for candidates. We're paid by employers, 
                so you'll never pay a penny to register or secure a job through us.
              </Text>
            </div>

            <div>
              <Heading level={3} size="lg" className="mb-3">
                What areas of Berkshire do you cover?
              </Heading>
              <Text color="muted">
                We cover all of Berkshire including Reading, Slough, Windsor, Bracknell, Maidenhead, 
                Newbury, and surrounding areas. We also have opportunities in nearby counties.
              </Text>
            </div>

            <div>
              <Heading level={3} size="lg" className="mb-3">
                What if I need a forklift license?
              </Heading>
              <Text color="muted">
                Many employers provide forklift training for the right candidates. We can also 
                recommend accredited training providers if you want to get licensed independently.
              </Text>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-primary text-white" aria-labelledby="final-cta-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heading level={2} size="2xl" color="inverse" className="mb-4" id="final-cta-heading">
            Ready to Find Your Perfect Job?
          </Heading>
          <Text size="lg" color="inverse" className="mb-8 opacity-90">
            Join the hundreds of satisfied candidates who found their ideal warehouse and logistics 
            roles through Lightyear Recruitment. Your perfect job is waiting.
          </Text>
          
          <Button
            href="https://registration.recruso.co.uk/Form/Worker/RdcgtU2Ti03C3gbg7Q6uWoxra98ucBoAnSg21MBO"
            variant="secondary"
            size="lg"
            className="mb-6"
          >
            Register Now - It's Free & Takes 2 Minutes
          </Button>

          <div className="flex flex-wrap justify-center gap-8 text-sm opacity-75">
            <span>✓ No fees ever</span>
            <span>✓ Local Berkshire experts</span>
            <span>✓ Quick 1-2 week placement</span>
            <span>✓ Full interview support</span>
          </div>
        </div>
      </section>
    </PageTemplate>
  )
}