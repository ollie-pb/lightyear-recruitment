'use client'

import React from 'react'
import PageTemplate from '../../components/templates/PageTemplate'
import Hero from '../../components/organisms/Hero'
import Card from '../../components/molecules/Card'
import Heading from '../../components/atoms/Heading'
import Text from '../../components/atoms/Text'
import Button from '../../components/atoms/Button'
import Icon from '../../components/atoms/Icon'

export default function AboutPage() {
  const timeline = [
    {
      year: '2010',
      title: 'Company Founded',
      description: 'Lightyear Recruitment was established by the Johnson family with a vision to provide personal, professional recruitment services to the warehouse and logistics sector in Berkshire.'
    },
    {
      year: '2012',
      title: 'First 100 Placements',
      description: 'Reached our first major milestone with 100 successful permanent placements, establishing relationships with key employers across Reading and Slough.'
    },
    {
      year: '2015',
      title: 'Temporary Division Launch',
      description: 'Expanded our services to include temporary staffing solutions, helping businesses manage seasonal peaks and unexpected staff shortages.'
    },
    {
      year: '2018',
      title: 'Digital Transformation',
      description: 'Invested in modern recruitment technology while maintaining our personal touch, improving candidate experience and placement speed.'
    },
    {
      year: '2020',
      title: 'Remote Services',
      description: 'Adapted to provide virtual interviews and remote onboarding during the pandemic, ensuring continuous support for clients and candidates.'
    },
    {
      year: '2023',
      title: '1000+ Placements',
      description: 'Celebrated over 1000 successful placements with a 95% candidate satisfaction rate and strong relationships with 50+ local employers.'
    }
  ]

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Managing Director',
      description: 'Sarah founded Lightyear with 15 years of recruitment experience. She specializes in senior appointments and maintains key client relationships.',
      expertise: ['Leadership recruitment', 'Client relations', 'Business development'],
      image: '/images/team/sarah-johnson.jpg'
    },
    {
      name: 'Mark Johnson',
      role: 'Operations Director',
      description: 'Mark oversees daily operations and candidate management. His warehouse background helps him understand both sides of the recruitment process.',
      expertise: ['Operational roles', 'Candidate screening', 'Process improvement'],
      image: '/images/team/mark-johnson.jpg'
    },
    {
      name: 'Emma Stevens',
      role: 'Senior Consultant',
      description: 'Emma specializes in temporary staffing and has built strong relationships with flexible workers across Berkshire.',
      expertise: ['Temporary staffing', 'Shift management', 'Compliance'],
      image: '/images/team/emma-stevens.jpg'
    },
    {
      name: 'James Mitchell',
      role: 'Recruitment Consultant',
      description: 'James focuses on entry-level and operational roles, helping newcomers to the industry find their first positions.',
      expertise: ['Entry-level roles', 'Training programs', 'Career guidance'],
      image: '/images/team/james-mitchell.jpg'
    }
  ]

  const values = [
    {
      icon: 'heart',
      title: 'Personal Service',
      description: 'We treat every candidate and client as an individual, not just a number. Your success is our success.'
    },
    {
      icon: 'shield-check',
      title: 'Trust & Integrity',
      description: 'Honest communication, transparent processes, and ethical practices in all our relationships.'
    },
    {
      icon: 'users',
      title: 'Community Focus',
      description: 'Supporting the local Berkshire community by connecting people with meaningful work opportunities.'
    },
    {
      icon: 'target',
      title: 'Quality Over Quantity',
      description: 'We focus on making the right matches rather than just filling positions quickly.'
    },
    {
      icon: 'trending-up',
      title: 'Continuous Improvement',
      description: 'Always learning and evolving to provide better service to our candidates and clients.'
    },
    {
      icon: 'clock',
      title: 'Responsiveness',
      description: 'Quick response times and proactive communication throughout the recruitment process.'
    }
  ]

  const achievements = [
    {
      metric: '1000+',
      label: 'Successful Placements',
      description: 'Over a thousand satisfied candidates placed in roles'
    },
    {
      metric: '50+',
      label: 'Active Clients',
      description: 'Long-term partnerships with local employers'
    },
    {
      metric: '95%',
      label: 'Satisfaction Rate',
      description: 'Candidates who would recommend our service'
    },
    {
      metric: '13',
      label: 'Years Experience',
      description: 'Established presence in Berkshire recruitment'
    }
  ]

  return (
    <PageTemplate
      variant="default"
      title="About Lightyear Recruitment - Family-Run Warehouse & Logistics Recruitment"
      description="Learn about Lightyear Recruitment, the family-run agency specializing in warehouse and logistics recruitment in Berkshire since 2010. Our story, team, and values."
      keywords="about lightyear recruitment, family recruitment agency berkshire, warehouse recruitment history, logistics staffing company, recruitment team berkshire"
      openGraph={{
        title: 'About Lightyear Recruitment | Family-Run Agency Since 2010',
        description: 'Meet the family-run team behind Berkshire\'s leading warehouse and logistics recruitment agency. Our story, values, and commitment to personal service.',
        image: '/images/og-about.jpg'
      }}
      structuredData={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Lightyear Recruitment',
        description: 'Family-run recruitment agency specializing in warehouse and logistics roles across Berkshire',
        foundingDate: '2010',
        address: {
          '@type': 'PostalAddress',
          addressRegion: 'Berkshire',
          addressCountry: 'GB'
        },
        employee: team.map(member => ({
          '@type': 'Person',
          name: member.name,
          jobTitle: member.role
        }))
      }}
      pageType="about"
      conversionGoals={['contact_inquiry', 'trust_building']}
      trackingData={{
        page_category: 'about',
        team_members: team.length,
        company_age: 13
      }}
    >
      {/* Hero Section */}
      <Hero
        layout="centered"
        headline="Our Story: 13 Years of Personal Service"
        subheadline="Family-run recruitment agency specializing in warehouse and logistics roles across Berkshire. We believe in building relationships, not just filling positions."
        primaryCta={{
          text: 'Meet Our Team',
          href: '#team',
          variant: 'primary'
        }}
        secondaryCta={{
          text: 'Work With Us',
          href: '/contact',
          variant: 'outline'
        }}
        statistics={achievements.map(achievement => ({
          value: achievement.metric,
          label: achievement.label
        }))}
      />

      {/* Company Story */}
      <section className="py-16 bg-white" aria-labelledby="story-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Heading level={2} size="2xl" className="mb-4" id="story-heading">
              The Lightyear Story
            </Heading>
            <Text size="lg" color="muted">
              How a family business became Berkshire&apos;s trusted recruitment partner
            </Text>
          </div>

          <div className="prose prose-lg mx-auto">
            <Text className="mb-6">
              Lightyear Recruitment was born from a simple observation: the recruitment industry had become 
              too impersonal. In 2010, Sarah and Mark Johnson founded our company with a commitment to 
              bring the human touch back to recruitment, specializing exclusively in the warehouse and 
              logistics sector they knew and understood.
            </Text>

            <Text className="mb-6">
              Having both worked in warehouse operations before moving into recruitment, they understood 
              the challenges faced by both employers and job seekers. They saw how the right person in 
              the right role could transform both individual lives and business operations.
            </Text>

            <Text className="mb-6">
              What started as a husband-and-wife team has grown into a close-knit family business employing 
              dedicated consultants who share our values of personal service, integrity, and community focus. 
              We&apos;ve maintained our personal approach while leveraging modern technology to serve our clients 
              and candidates better.
            </Text>

            <Text>
              Today, we&apos;re proud to be known as the go-to recruitment agency for warehouse and logistics 
              roles in Berkshire. Our success is measured not just in placements made, but in the lasting 
              relationships we&apos;ve built and the positive impact we&apos;ve had on our community.
            </Text>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-gray-50" aria-labelledby="timeline-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Heading level={2} size="2xl" className="mb-4" id="timeline-heading">
              Our Journey
            </Heading>
            <Text size="lg" color="muted">
              Key milestones in our 13-year history
            </Text>
          </div>

          <div className="space-y-8">
            {timeline.map((event, index) => (
              <div key={index} className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    {event.year}
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <Heading level={3} size="lg" className="mb-2">
                    {event.title}
                  </Heading>
                  <Text color="muted">
                    {event.description}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-16 bg-white" aria-labelledby="team-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Heading level={2} size="2xl" className="mb-4" id="team-heading">
              Meet Our Team
            </Heading>
            <Text size="lg" color="muted">
              The dedicated professionals behind your recruitment success
            </Text>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {team.map((member, index) => (
              <Card key={index} variant="default" className="text-center h-full">
                <div className="mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
                  />
                  <Heading level={3} size="lg" className="mb-1">
                    {member.name}
                  </Heading>
                  <Text color="accent" weight="medium" className="mb-4">
                    {member.role}
                  </Text>
                </div>

                <Text size="sm" color="muted" className="mb-6 text-left">
                  {member.description}
                </Text>

                <div className="text-left">
                  <Text size="sm" weight="medium" className="mb-2">
                    Expertise:
                  </Text>
                  <div className="flex flex-wrap gap-2">
                    {member.expertise.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50" aria-labelledby="values-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Heading level={2} size="2xl" className="mb-4" id="values-heading">
              Our Values
            </Heading>
            <Text size="lg" color="muted">
              The principles that guide everything we do
            </Text>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <Icon name={value.icon as 'heart' | 'shield-check' | 'users' | 'target' | 'trending-up' | 'clock'} size="xl" color="accent" />
                  </div>
                </div>
                <Heading level={3} size="base" className="mb-2">
                  {value.title}
                </Heading>
                <Text size="sm" color="muted">
                  {value.description}
                </Text>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-white" aria-labelledby="mission-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heading level={2} size="2xl" className="mb-6" id="mission-heading">
            Our Mission
          </Heading>
          
          <div className="bg-primary/5 p-8 rounded-lg">
            <Text size="xl" className="mb-6 italic">
              &ldquo;To connect talented individuals with meaningful warehouse and logistics opportunities 
              across Berkshire, providing personal service that makes a real difference to careers 
              and businesses alike.&rdquo;
            </Text>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div>
                <Heading level={3} size="base" className="mb-2">
                  For Candidates
                </Heading>
                <Text size="sm" color="muted">
                  We help you find not just any job, but the right job for your skills, goals, and lifestyle.
                </Text>
              </div>
              <div>
                <Heading level={3} size="base" className="mb-2">
                  For Employers
                </Heading>
                <Text size="sm" color="muted">
                  We provide quality candidates who will contribute to your success and stay for the long term.
                </Text>
              </div>
              <div>
                <Heading level={3} size="base" className="mb-2">
                  For Community
                </Heading>
                <Text size="sm" color="muted">
                  We strengthen the local economy by connecting Berkshire&apos;s workforce with local opportunities.
                </Text>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accreditations & Memberships */}
      <section className="py-16 bg-gray-50" aria-labelledby="accreditations-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heading level={2} size="2xl" className="mb-8" id="accreditations-heading">
            Professional Memberships
          </Heading>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card variant="default" className="text-center">
              <div className="mb-4">
                <Icon name="shield-check" size="xl" color="accent" />
              </div>
              <Heading level={3} size="base" className="mb-2">
                REC Membership
              </Heading>
              <Text size="sm" color="muted">
                Full member of the Recruitment & Employment Confederation, 
                ensuring ethical practices and professional standards.
              </Text>
            </Card>

            <Card variant="default" className="text-center">
              <div className="mb-4">
                <Icon name="award" size="xl" color="accent" />
              </div>
              <Heading level={3} size="base" className="mb-2">
                Industry Recognition
              </Heading>
              <Text size="sm" color="muted">
                Consistently rated among the top recruitment agencies in Berkshire 
                by client and candidate satisfaction surveys.
              </Text>
            </Card>
          </div>

          <div className="mt-8">
            <Text size="sm" color="muted">
              All our consultants undertake regular training and professional development 
              to maintain the highest standards of service.
            </Text>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white" aria-labelledby="cta-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heading level={2} size="2xl" className="mb-4" id="cta-heading">
            Ready to Experience Personal Service?
          </Heading>
          <Text size="lg" className="mb-8 opacity-90">
            Whether you&apos;re looking for your next career move or need help finding the right staff, 
            we&apos;d love to hear from you. Let&apos;s discuss how we can help.
          </Text>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/candidates" variant="secondary" size="large">
              I&apos;m Looking for Work
            </Button>
            <Button href="/employers" variant="outline" size="large" className="border-white text-white hover:bg-white hover:text-primary">
              I Need to Hire Staff
            </Button>
          </div>

          <div className="mt-8">
            <Text size="sm" color="inverse" className="opacity-75">
              Or call us directly at +44 (0)123 456 7890
            </Text>
          </div>
        </div>
      </section>
    </PageTemplate>
  )
}